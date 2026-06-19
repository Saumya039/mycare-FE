import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral"

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

interface StatusBadgeProps {
  children: React.ReactNode
  variant: StatusVariant
  className?: string
}

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium text-xs", variantClasses[variant], className)}
    >
      {children}
    </Badge>
  )
}

export function getStatusVariant(status: string): StatusVariant {
  const s = status.toLowerCase()
  if (["completed", "paid", "approved", "active", "discharged", "available", "present"].includes(s)) return "success"
  if (["pending", "scheduled", "waiting", "processing", "in-progress", "admitted", "on-duty"].includes(s)) return "warning"
  if (["cancelled", "overdue", "rejected", "expired", "critical", "discarded"].includes(s)) return "danger"
  if (["dispatched", "in-transit", "assigned"].includes(s)) return "info"
  return "neutral"
}
