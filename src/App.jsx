import { useState, useCallback } from 'react'
import { useChat } from './hooks/useChat'
import Header from './components/Header'
import ErrorBanner from './components/ErrorBanner'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'

/**
 * Main application component.
 * Assembles the layout and wires the custom `useChat` hook to the UI components.
 */
function App() {
  const { messages, isLoading, error, sendMessage, editMessage, retryLastMessage, clearMessages, clearError } = useChat()
  const [inputText, setInputText] = useState('')
  const [editingMessageId, setEditingMessageId] = useState(null)

  const handleSend = useCallback((text) => {
    if (editingMessageId) {
      editMessage(editingMessageId, text)
      setEditingMessageId(null)
    } else {
      sendMessage(text)
    }
    setInputText('') // Clear input only successfully firing send
  }, [editingMessageId, editMessage, sendMessage])

  const handleEditPrompt = useCallback((id, text) => {
    setInputText(text)
    setEditingMessageId(id)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setInputText('')
    setEditingMessageId(null)
  }, [])

  return (
    <div className="flex h-dvh w-full flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 overflow-hidden">
      <Header
        messageCount={messages.length}
        onClearChat={clearMessages}
        disabled={isLoading}
      />

      <div className="w-full max-w-4xl mx-auto flex-shrink-0 z-10 relative">
        <ErrorBanner error={error} onDismiss={clearError} onRetry={retryLastMessage} />
      </div>

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onEditPrompt={handleEditPrompt}
      />

      <InputBar
        value={inputText}
        onChange={setInputText}
        onSend={handleSend}
        disabled={isLoading}
        isEditing={!!editingMessageId}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  )
}

export default App
