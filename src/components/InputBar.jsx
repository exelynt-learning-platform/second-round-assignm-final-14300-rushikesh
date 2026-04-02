import { useEffect, useRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * The input area at the bottom of the chat interface.
 * Handles typing, text limits, and submission (Enter key or button).
 *
 * @param {object} props
 * @param {string} props.value - Controlled input value
 * @param {(value: string) => void} props.onChange - Input change handler
 * @param {(message: string) => void} props.onSend - Callback to send the message
 * @param {boolean} props.disabled - If true, disables the input and button
 * @param {boolean} [props.isEditing] - If true, the user is editing a past message
 * @param {() => void} [props.onCancelEdit] - Callback to cancel edit mode
 */
export default function InputBar({ value, onChange, onSend, disabled, isEditing, onCancelEdit }) {
    const inputRef = useRef(null)
    const maxLength = 2000

    // Focus the input if the value changes dynamically (e.g. when editing a prompt)
    useEffect(() => {
        if (value && inputRef.current) {
            inputRef.current.focus()
            // Move cursor to end
            const len = value.length
            inputRef.current.setSelectionRange(len, len)
        }
    }, [value])

    const handleSend = (e) => {
        e?.preventDefault()
        if (!value.trim() || disabled) return
        onSend(value.trim())
        // Maintain focus after sending if on desktop
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="w-full bg-white px-4 py-3 border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <form
                onSubmit={handleSend}
                className="mx-auto flex w-full max-w-4xl flex-col gap-2 relative"
            >
                <div className="flex items-center gap-2">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 rounded-full px-5 py-6 text-sm md:text-base border-slate-300 shadow-sm focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        maxLength={maxLength}
                        aria-label="Message input field"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!value.trim() || disabled}
                        className="h-12 w-12 shrink-0 rounded-full shadow-md transition-transform active:scale-95 bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                        aria-label="Send message"
                    >
                        <SendHorizontal className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex justify-between px-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400">
                            Press Enter to send
                        </span>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="text-[10px] text-rose-500 hover:text-rose-600 font-medium transition-colors"
                            >
                                Cancel editing
                            </button>
                        )}
                    </div>
                    {value.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                            {value.length}/{maxLength}
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}
