import { Bot } from 'lucide-react'

/**
 * Animated three-dot typing indicator.
 * Positioned to look like an incoming assistant message.
 */
export default function LoadingIndicator() {
    return (
        <div className="flex w-full animate-fade-slide-up gap-4 px-4 py-2 justify-start items-end">
            {/* Bot Avatar */}
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 mb-5">
                <Bot className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>

            <div className="flex max-w-[85%] flex-col items-start gap-1 md:max-w-[75%]">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="dot-1 h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <div className="dot-2 h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <div className="dot-3 h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 md:text-xs">
                    AI is thinking...
                </span>
            </div>
        </div>
    )
}
