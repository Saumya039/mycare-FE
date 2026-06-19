import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "date" | "textarea" | "select"
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  error?: string
  className?: string
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  required,
  error,
  className,
}: FormFieldProps) {
  const id = `field-${name}`

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={error ? "border-destructive" : ""}
        />
      ) : type === "select" ? (
        <Select value={(value as string) ?? ""} onValueChange={(v) => { if (v) onChange?.(v) }} name={name}>
          <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
            <SelectValue placeholder={placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={error ? "border-destructive" : ""}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  loading?: boolean
  maxWidth?: string
}

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
  loading,
  maxWidth = "max-w-md",
}: FormModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={cn("bg-card border border-border rounded-2xl w-full shadow-2xl", maxWidth)}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">{children}</div>
          <div className="p-6 pt-0 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-medium text-sm disabled:opacity-50"
            >
              {loading ? "Loading..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
