import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import chatReducer, { clearMessages, clearError, sendMessage } from './chatSlice'

import * as openaiService from '../services/openaiService'

vi.mock('../services/openaiService', () => ({
    sendMessage: vi.fn(),
}))

describe('chatSlice', () => {
    let store

    beforeEach(() => {
        store = configureStore({
            reducer: { chat: chatReducer },
        })
        vi.clearAllMocks()
    })

    it('should return initial state', () => {
        const state = store.getState().chat
        expect(state.messages).toEqual([])
        expect(state.isLoading).toBe(false)
        expect(state.error).toBeNull()
    })

    it('should handle clearMessages', () => {
        const preloadedState = {
            chat: {
                messages: [{ id: '1', role: 'user', content: 'hello', timestamp: 123 }],
                isLoading: false,
                error: 'some error',
            },
        }
        store = configureStore({
            reducer: { chat: chatReducer },
            preloadedState,
        })

        store.dispatch(clearMessages())
        const state = store.getState().chat
        expect(state.messages).toEqual([])
        expect(state.error).toBeNull()
    })

    it('should handle clearError', () => {
        const preloadedState = {
            chat: {
                messages: [],
                isLoading: false,
                error: 'some error',
            },
        }
        store = configureStore({
            reducer: { chat: chatReducer },
            preloadedState,
        })

        store.dispatch(clearError())
        const state = store.getState().chat
        expect(state.error).toBeNull()
    })
})
