import { AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

/**
 * A dismissible error banner that spans the width of its container.
 * 
 * @param {object} props
 * @param {string|null} props.error - The error message to display
 * @param {() => void} props.onDismiss - Callback when the close button is clicked
 * @param {() => void} [props.onRetry] - Optional callback to retry the failed user message
 */
export default function ErrorBanner({ error, onDismiss, onRetry }) {
    if (!error) return null

    return (
        <div className="w-full px-4 py-2 animate-fade-slide-up">
            <Alert variant="destructive" className="relative pr-12 shadow-md bg-red-50 dark:bg-red-950/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">Error</AlertTitle>
                <AlertDescription className="text-sm mt-1">
                    {error}
                    {onRetry && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRetry}
                                className="h-8 bg-red-100/50 hover:bg-red-200 text-red-900 border-red-200 dark:bg-red-900/40 dark:hover:bg-red-800 dark:text-red-100 dark:border-red-800 transition-colors"
                            >
                                Retry
                            </Button>
                        </div>
                    )}
                </AlertDescription>

                {/* Dismiss Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900 focus:ring-1 focus:ring-red-400"
                    onClick={onDismiss}
                    aria-label="Dismiss error"
                >
                    <X className="h-4 w-4" />
                </Button>
            </Alert>
        </div>
    )
}
