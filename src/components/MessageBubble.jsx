import React, { useState } from 'react'
import { Bot, Copy, Check, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Enhanced MessageBubble supporting Markdown, Claude-style UI,
 * and Copy/Edit actions.
 *
 * @param {object} props
 * @param {string} props.id - Message ID
 * @param {'user'|'assistant'} props.role
 * @param {string} props.content
 * @param {(id: string, promptText: string) => void} [props.onEditPrompt] - Callback to populate input bar with this prompt
 */
export default React.memo(function MessageBubble({ id, role, content, onEditPrompt }) {
    const isUser = role === 'user'
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            className={cn(
                'group flex w-full animate-fade-slide-up gap-4 px-4 py-4',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {/* Avatar for Assistant only (Claude style) */}
            {!isUser && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl border border-slate-200 bg-white/50 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 mt-1">
                    <Bot className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
            )}

            {/* Message Container */}
            <div
                className={cn(
                    'relative flex flex-col gap-2 max-w-[85%] md:max-w-[75%]',
                    isUser ? 'items-end' : 'items-start'
                )}
            >
                {isUser ? (
                    /* USER MESSAGE (Bubble) */
                    <div className="relative group/user">
                        <div className="rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] leading-relaxed bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
                            {content}
                        </div>

                        {/* User Message Action Bar (Hover only) */}
                        <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 transition-opacity group-hover/user:opacity-100">
                            {onEditPrompt && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white shadow-sm dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                                    onClick={() => onEditPrompt(id, content)}
                                    title="Edit prompt"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white shadow-sm dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                                onClick={handleCopy}
                                title="Copy text"
                            >
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* ASSISTANT MESSAGE (Document Flow) */
                    <div className="w-full">
                        <div className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-p:my-3 prose-pre:my-3 prose-pre:rounded-xl max-w-none text-[15px] text-slate-800 dark:text-slate-200 break-words">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Custom rendering for anchors to style links effectively
                                    a: ({ node, ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-indigo-600 dark:text-indigo-400 no-underline hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                                        />
                                    ),
                                    // Enhance spacing and typography for specific elements
                                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="my-4 list-disc pl-5" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="my-4 list-decimal pl-5" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>

                        {/* Assistant Message Action Bar */}
                        <div className="mt-2 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="text-xs">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5" />
                                        <span className="text-xs">Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})
