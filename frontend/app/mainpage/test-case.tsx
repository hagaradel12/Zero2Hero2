import { Card } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"

export function TestCase({
  name,
  status,
  input,
  expected,
  actual,
}: {
  name: string
  status: "passed" | "failed"
  input: string
  expected: string
  actual: string
}) {
  return (
    <Card className={`p-3 ${status === "passed" ? "border-accent" : "border-destructive"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{name}</span>
        {status === "passed" ? (
          <div className="flex items-center gap-1 text-accent text-sm">
            <Check className="w-4 h-4" />
            Passed
          </div>
        ) : (
          <div className="flex items-center gap-1 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            Failed
          </div>
        )}
      </div>
      <div className="space-y-1 text-xs font-mono">
        <div>
          <span className="text-muted">Input: </span>
          <span>{input}</span>
        </div>
        <div>
          <span className="text-muted">Expected: </span>
          <span>{expected}</span>
        </div>
        <div>
          <span className={status === "failed" ? "text-destructive" : ""}>
            <span className="text-muted">Actual: </span>
            {actual}
          </span>
        </div>
      </div>
    </Card>
  )
}
