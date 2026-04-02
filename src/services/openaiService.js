/**
 * @fileoverview API service for the chatbot application.
 * Replaced standard OpenAI with Google Gemini's open-compatible endpoint
 * to bypass OpenAI's "insufficient_quota" errors (since Gemini has a generous free tier).
 * The API key is read from import.meta.env.VITE_GEMINI_API_KEY — never hardcoded.
 */

// Google Gemini provides an OpenAI-compatible endpoint format:
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const MODEL = 'gemini-2.5-flash' // Fast, free model

/**
 * Sends the full conversation history to the API and returns the assistant's reply text.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 *   Full conversation history (role + content only).
 * @returns {Promise<string>} The assistant's response text.
 * @throws {Error} On network failure, bad API key, or empty response.
 */
export async function sendMessage(messages) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
        throw new Error(
            'Missing API key. Please set VITE_GEMINI_API_KEY in your .env file.'
        )
    }

    let response
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
            }),
        })
    } catch (networkError) {
        throw new Error(
            'Network error: Unable to reach the API. Check your internet connection.'
        )
    }

    if (!response.ok) {
        let errorMessage
        switch (response.status) {
            case 400:
                errorMessage = 'Bad request (400). Please check your message formatting.'
                break
            case 401:
            case 403:
                errorMessage =
                    'Invalid or missing API key. Please check your VITE_GEMINI_API_KEY.'
                break
            case 429:
                errorMessage =
                    'Rate limit exceeded (429). Too many requests — please wait a moment.'
                break
            case 500:
            case 502:
            case 503:
                errorMessage = `Server error (${response.status}). Please try again later.`
                break
            default:
                errorMessage = `API error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
    }

    let data
    try {
        data = await response.json()
    } catch {
        throw new Error('Failed to parse response.')
    }

    // Parses response perfectly according to OpenAI's spec
    const text = data?.choices?.[0]?.message?.content
    if (!text) {
        throw new Error('Empty response received from the API.')
    }

    return text
}
