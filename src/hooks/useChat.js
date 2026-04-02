/**
 * @fileoverview Custom hook that wraps Redux dispatch and selectors
 * for the chat feature. Provides a clean interface for components.
 */

import { useDispatch, useSelector } from 'react-redux'
import {
    sendMessage as sendMessageThunk,
    editMessage as editMessageThunk,
    retryMessage as retryMessageThunk,
    clearMessages as clearMessagesAction,
    clearError as clearErrorAction,
} from '../store/chatSlice'

/**
 * Custom hook for interacting with chat state and actions.
 */
export function useChat() {
    const dispatch = useDispatch()

    const messages = useSelector((state) => state.chat.messages)
    const isLoading = useSelector((state) => state.chat.isLoading)
    const error = useSelector((state) => state.chat.error)

    const sendMessage = (content) => {
        if (!content.trim()) return
        dispatch(sendMessageThunk(content.trim()))
    }

    const editMessage = (id, content) => {
        if (!content.trim()) return
        dispatch(editMessageThunk({ id, newContent: content.trim() }))
    }

    const retryLastMessage = () => {
        dispatch(retryMessageThunk())
    }

    const clearMessages = () => dispatch(clearMessagesAction())
    const clearError = () => dispatch(clearErrorAction())

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        editMessage,
        retryLastMessage,
        clearMessages,
        clearError
    }
}
