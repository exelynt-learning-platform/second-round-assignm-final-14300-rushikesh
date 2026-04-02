import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'

const persistedStateId = 'chatHistory'
let preloadedState = {}

try {
    const serializedState = localStorage.getItem(persistedStateId)
    if (serializedState) {
        preloadedState = {
            chat: {
                messages: JSON.parse(serializedState),
                isLoading: false,
                error: null,
            }
        }
    }
} catch (e) {
    console.error('Could not load chat history', e)
}

/**
 * The Redux store for the chatbot application.
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
export const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
    preloadedState,
})

// Subscribe to store updates to persist chat messages
store.subscribe(() => {
    try {
        const state = store.getState()
        localStorage.setItem(persistedStateId, JSON.stringify(state.chat.messages))
    } catch (e) {
        console.error('Could not save chat history', e)
    }
})
