/**
 * @fileoverview Redux slice for chat state management.
 * Manages messages, loading state, and error state.
 * Uses createAsyncThunk with redux-thunk (included in RTK by default).
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sendMessage as apiSendMessage } from '../services/openaiService'

/**
 * Generates a UUID-like unique identifier for messages.
 * @returns {string}
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Async thunk to send a user message and fetch the AI response.
 * Reads the current conversation history from Redux state to maintain context.
 *
 * @param {string} userContent - The user's message text.
 * @param {object} thunkAPI - RTK thunk API ({ getState, rejectWithValue }).
 * @returns {Promise<object>} The assistant message object on success.
 */
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (userContent, { getState, rejectWithValue }) => {
        try {
            // Build full conversation history (role + content only) for the API call
            const { chat } = getState()
            const history = chat.messages.map(({ role, content }) => ({
                role,
                content,
            }))

            // Append the new user message to history before calling the API
            history.push({ role: 'user', content: userContent })

            const assistantText = await apiSendMessage(history)

            return {
                id: generateId(),
                role: 'assistant',
                content: assistantText,
                timestamp: Date.now(),
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

/**
 * Async thunk to edit an existing user message, remove all subsequent messages,
 * and fetch a new AI response.
 */
export const editMessage = createAsyncThunk(
    'chat/editMessage',
    async ({ id, newContent }, { getState, rejectWithValue }) => {
        try {
            const { chat } = getState()
            const messageIndex = chat.messages.findIndex((m) => m.id === id)
            if (messageIndex === -1) throw new Error('Message not found.')

            // Build history up to (but not including) the edited message
            const history = chat.messages
                .slice(0, messageIndex)
                .map(({ role, content }) => ({ role, content }))

            // Append the new edited message
            history.push({ role: 'user', content: newContent })

            const assistantText = await apiSendMessage(history)

            return {
                assistantMessage: {
                    id: generateId(),
                    role: 'assistant',
                    content: assistantText,
                    timestamp: Date.now(),
                },
                id,
                newContent,
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

/**
 * Async thunk to retry the last user message, if the last message was from the user
 * and we didn't get an AI response (due to an error).
 */
export const retryMessage = createAsyncThunk(
    'chat/retryMessage',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { chat } = getState()
            const messages = chat.messages
            if (messages.length === 0) throw new Error('No message to retry.')

            const lastMessage = messages[messages.length - 1]
            if (lastMessage.role !== 'user') throw new Error('Last message was not from user.')

            const history = messages.map(({ role, content }) => ({ role, content }))
            const assistantText = await apiSendMessage(history)

            return {
                id: generateId(),
                role: 'assistant',
                content: assistantText,
                timestamp: Date.now(),
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

/**
 * Initial state for the chat slice.
 * @type {{ messages: Array, isLoading: boolean, error: string|null }}
 */
const initialState = {
    messages: [],
    isLoading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        /**
         * Clears all messages from the conversation.
         * @param {object} state
         */
        clearMessages(state) {
            state.messages = []
            state.error = null
        },

        /**
         * Dismisses the current error message.
         * @param {object} state
         */
        clearError(state) {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            /** Pending: add user message immediately and show loading indicator */
            .addCase(sendMessage.pending, (state, action) => {
                const userMessage = {
                    id: generateId(),
                    role: 'user',
                    content: action.meta.arg,
                    timestamp: Date.now(),
                }
                state.messages.push(userMessage)
                state.isLoading = true
                state.error = null
            })

            /** Fulfilled: append assistant response */
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload)
                state.isLoading = false
            })

            /** Rejected: store error message, stop loading */
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'An unexpected error occurred.'
            })

            /** Edit Pending: update message, slice array, set loading */
            .addCase(editMessage.pending, (state, action) => {
                const { id, newContent } = action.meta.arg
                const messageIndex = state.messages.findIndex((m) => m.id === id)
                if (messageIndex !== -1) {
                    // Update user message content
                    state.messages[messageIndex].content = newContent
                    // Remove all messages after the edited one
                    state.messages = state.messages.slice(0, messageIndex + 1)
                }
                state.isLoading = true
                state.error = null
            })
            /** Edit Fulfilled: append assistant response */
            .addCase(editMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload.assistantMessage)
                state.isLoading = false
            })
            /** Edit Rejected: store error, stop loading */
            .addCase(editMessage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'An unexpected error occurred.'
            })

            /** Retry Pending: set loading state, optionally clear error */
            .addCase(retryMessage.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            /** Retry Fulfilled: append assistant response */
            .addCase(retryMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload)
                state.isLoading = false
            })
            /** Retry Rejected: store error, stop loading */
            .addCase(retryMessage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'An unexpected error occurred.'
            })
    },

})

export const { clearMessages, clearError } = chatSlice.actions
export default chatSlice.reducer
