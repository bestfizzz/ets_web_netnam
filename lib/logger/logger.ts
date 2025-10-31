import fs from "fs"
import path from "path"
import chalk from "chalk"

const logDir = path.resolve(process.cwd(), "logs")
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogOptions {
  context?: string | Record<string, any>
  [key: string]: any
}

/**
 * Extract the caller file and line number
 */
function getCallerInfo(): string {
  const stack = new Error().stack
  if (!stack) return "unknown"

  const lines = stack.split("\n")

  for (const line of lines) {
    if (
      !line.includes("at ") ||
      line.includes("logger.ts") ||
      line.includes("logger.js") ||
      line.includes("node:") ||
      line.includes("internal/") ||
      line.includes("node_modules") ||
      line.includes(".next/server/chunks")
    )
      continue

    const match = line.match(/\((.+?):(\d+):\d+\)/) || line.match(/at (.+?):(\d+):\d+/)
    if (match) {
      const file = path.basename(match[1])
      const lineNum = match[2]
      return `${file}:${lineNum}`
    }
  }

  return "unknown"
}

/**
 * Get formatted timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Format a complete log line
 */
function formatLogMessage(level: LogLevel, message: string, opts?: LogOptions): string {
  const timestamp = getTimestamp()
  const caller = typeof opts?.context === "string" ? opts.context : getCallerInfo()
  const levelStr = level.toUpperCase()

  let logLine = `[${levelStr}] [${timestamp}] [${caller}]: ${message}`

  if (opts) {
    const meta = { ...opts }
    if (typeof meta.context === "string") delete meta.context
    if (Object.keys(meta).length > 0) {
      try {
        logLine += `\n${JSON.stringify(meta, null, 2)}`
      } catch {
        logLine += " [metadata serialization failed]"
      }
    }
  }

  return logLine
}

/**
 * Apply colors to console output
 */
function colorize(level: LogLevel, line: string): string {
  switch (level) {
    case "info":
      return chalk.green(line)
    case "warn":
      return chalk.yellow(line)
    case "error":
      return chalk.red(line)
    case "debug":
      return chalk.cyan(line)
    default:
      return line
  }
}

/**
 * Write log to console + file
 */
function writeLog(level: LogLevel, message: string, opts?: LogOptions): void {
  const isDev = process.env.NODE_ENV === "development"
  if (level === "debug" && !isDev) return
  const formatted = formatLogMessage(level, message, opts)

  console.log(colorize(level, formatted))

  const logPath = path.join(logDir, "app.log")
  try {
    fs.appendFileSync(logPath, formatted + "\n", "utf8")
  } catch (err) {
    console.error("Failed to write log:", err)
  }
}

/**
 * Export logger instance
 */
export const logger = {
  info: (msg: string, opts?: LogOptions) => writeLog("info", msg, opts),
  warn: (msg: string, opts?: LogOptions) => writeLog("warn", msg, opts),
  error: (msg: string, opts?: LogOptions) => writeLog("error", msg, opts),
  debug: (msg: string, opts?: LogOptions) => writeLog("debug", msg, opts),
}
