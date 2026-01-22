import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

interface TutorialCardProps {
    step: string
    title: string
    description: string
    children: React.ReactNode
    className?: string
}

export function TutorialCard({ step, title, description, children, className }: TutorialCardProps) {
    return (
        <div className={cn("group relative flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-start md:p-8", className)}>
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-4 ring-blue-50">
                        {step}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-base">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium opacity-0 transition-opacity group-hover:opacity-100">
                    <CheckCircle2 className="h-4 w-4" /> Tip Pro
                </div>
            </div>

            {/* Visual Area (Mockup Container) */}
            <div className="w-full md:w-[45%] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
                {children}
            </div>
        </div>
    )
}