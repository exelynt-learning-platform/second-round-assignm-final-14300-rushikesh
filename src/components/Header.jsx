import { BotMessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Top navigation header for the chat application.
 * Contains the app title, logo, and a clear chat action.
 *
 * @param {object} props
 * @param {number} props.messageCount - Number of current messages in chat
 * @param {() => void} props.onClearChat - Callback to reset all messages
 * @param {boolean} props.disabled - If true, disables the clear button
 */
export default function Header({ messageCount, onClearChat, disabled }) {
    return (
        <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 shadow-sm">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">

                {/* Left Side: Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-50 shadow-md dark:bg-slate-100 dark:text-slate-900">
                        <BotMessageSquare className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                            AI Assistant
                        </h1>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            GPT-3.5 Turbo
                        </span>
                    </div>
                </div>

                {/* Right Side: Actions & Badges */}
                <div className="flex items-center gap-3">
                    {messageCount > 0 && (
                        <Badge variant="secondary" className="hidden sm:inline-flex bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {messageCount} {messageCount === 1 ? 'msg' : 'msgs'}
                        </Badge>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearChat}
                        disabled={disabled || messageCount === 0}
                        className="flex items-center gap-2 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/30"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear Chat</span>
                    </Button>
                </div>

            </div>
        </header>
    )
}
