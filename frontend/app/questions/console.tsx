export interface ExecutionResult {
  output: string
  error: string | null
  success: boolean
}

export type Language = "javascript" | "python" | "java"

export async function executeCode(code: string, language: Language = "javascript"): Promise<ExecutionResult> {
  switch (language) {
    case "python":
      return executePython(code)
    case "java":
      return executeJava(code)
    case "javascript":
    default:
      return executeJavaScript(code)
  }
}

function executeJavaScript(code: string): ExecutionResult {
  const logs: string[] = []
  const errors: string[] = []

  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map((arg) => formatOutput(arg)).join(" "))
    },
    error: (...args: any[]) => {
      errors.push(args.map((arg) => formatOutput(arg)).join(" "))
    },
    warn: (...args: any[]) => {
      logs.push("[WARN] " + args.map((arg) => formatOutput(arg)).join(" "))
    },
  }

  try {
    const func = new Function("console", code)
    func(customConsole)

    return {
      output: logs.join("\n"),
      error: errors.length > 0 ? errors.join("\n") : null,
      success: true,
    }
  } catch (error) {
    return {
      output: logs.join("\n"),
      error: error instanceof Error ? error.message : "Unknown error occurred",
      success: false,
    }
  }
}

async function executePython(code: string): Promise<ExecutionResult> {
  try {
    const pyodideModule = (window as any).pyodide

    if (!pyodideModule) {
      return {
        output: "",
        error: "Python runtime is loading. Please try again in a moment.",
        success: false,
      }
    }

    // Check if Pyodide is already initialized
    let pyodide = (window as any).pyodideInstance

    if (!pyodide) {
      pyodide = await pyodideModule.loadPyodide()
      ;(window as any).pyodideInstance = pyodide
    }

    const logs: string[] = []

    // Redirect Python print to capture output
    const pythonCode = `
import sys
from io import StringIO

# Capture output
_old_stdout = sys.stdout
sys.stdout = StringIO()

try:
${code
  .split("\n")
  .map((line) => "    " + line)
  .join("\n")}
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
finally:
    _output = sys.stdout.getvalue()
    sys.stdout = _old_stdout
    print(_output, end='')
`

    // Capture console output
    const originalLog = console.log
    console.log = (...args: any[]) => {
      logs.push(args.map((arg) => formatOutput(arg)).join(" "))
    }

    try {
      await pyodide.runPythonAsync(pythonCode)
      console.log = originalLog

      return {
        output: logs.join("\n"),
        error: null,
        success: true,
      }
    } catch (error) {
      console.log = originalLog
      return {
        output: logs.join("\n"),
        error: error instanceof Error ? error.message : "Python execution failed",
        success: false,
      }
    }
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Python runtime error",
      success: false,
    }
  }
}

function executeJava(code: string): ExecutionResult {
  return {
    output: "",
    error:
      "Java execution requires a backend service. Please use JavaScript or Python for now, or connect a Java execution backend.",
    success: false,
  }
}

function formatOutput(value: any): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function validateOutput(output: string, expected: string): boolean {
  return output.trim() === expected.trim()
}
