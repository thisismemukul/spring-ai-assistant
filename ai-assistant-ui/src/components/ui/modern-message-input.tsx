import * as React from "react"
import { cn } from "@/utils/cn"
import { Button } from "./button"
import { SendIcon, Loader2 } from "lucide-react"

interface ModernMessageInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend: (message: string) => void
  isLoading?: boolean
  className?: string
}

export const ModernMessageInput: React.FC<ModernMessageInputProps> = ({
  onSend,
  isLoading = false,
  className,
  ...props
}) => {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className={cn("relative flex w-full items-end gap-2", className)}>
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] p-4 text-foreground shadow-md focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
          placeholder="Type a message..."
          disabled={isLoading}
          {...props}
        />
      </div>
      
      <Button
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="h-[50px] min-w-[50px] rounded-full bg-[hsl(var(--vibrant-yellow))] text-[hsl(var(--vibrant-black))] shadow-md hover:bg-[hsl(var(--vibrant-yellow))] hover:brightness-105"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
} 