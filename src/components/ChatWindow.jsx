import { useEffect, useRef } from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import MessageBubble from './MessageBubble'
import LoadingIndicator from './LoadingIndicator'

/**
 * The main chat viewing area. Renders a scrolling list of messages.
 * Automatically scrolls to the bottom when new messages arrive.
 * Displays an empty state card when there are no messages.
 *
 * @param {object} props
 * @param {Array<{id: string, role: 'user'|'assistant', content: string, timestamp: number}>} props.messages
 * @param {boolean} props.isLoading - Whether the AI is currently generating a response
 * @param {(promptText: string) => void} props.onEditPrompt - Passed to MessageBubble to edit old prompts
 */
export default function ChatWindow({ messages, isLoading, onEditPrompt }) {
    const scrollRef = useRef(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length, isLoading])

    return (
        <ScrollArea
            ref={scrollRef}
            className="flex-1 w-full bg-slate-50/50 dark:bg-slate-900/20"
        >
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 py-8">

                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-slide-up text-center px-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-6">
                            <Bot className="h-10 w-10 text-slate-600 dark:text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
                            Hello, there! <Sparkles className="h-5 w-5 text-yellow-500" />
                        </h2>
                        <p className="max-w-md text-slate-500 dark:text-slate-400">
                            I'm your AI assistant. Ask me anything to get started.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        id={msg.id}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        onEditPrompt={onEditPrompt}
                    />
                ))}

                {isLoading && <LoadingIndicator />}
                <div ref={bottomRef} className="h-px w-full" />
            </div>
        </ScrollArea>
    )
}
