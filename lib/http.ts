export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface HttpOptions extends Omit<RequestInit, "body"> {
  throwOnError?: boolean
  parseJson?: boolean
  query?: Record<string, string | number | boolean | undefined | null>
  body?: BodyInit | Record<string, any>
  baseUrl?: string
}

export class HttpError extends Error {
  status: number
  statusText: string
  url: string
  body?: string
  constructor(status: number, statusText: string, url: string, message?: string, body?: string) {
    super(message)
    this.status = status
    this.statusText = statusText
    this.url = url
    this.body = body
  }
}

export async function http<T = any>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    throwOnError = true,
    parseJson = true,
    query,
    baseUrl,
    ...rest
  } = options

  const isServer = typeof window === "undefined"

  // --- Construct final URL ---
  let finalUrl =
    baseUrl && !/^https?:\/\//.test(url)
      ? baseUrl.replace(/\/$/, "") + "/" + url.replace(/^\//, "")
      : url

  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) params.append(key, String(value))
    }
    finalUrl += (finalUrl.includes("?") ? "&" : "?") + params.toString()
  }

  // --- Normalize headers ---
  const normalizedHeaders: Record<string, string> = {}
  if (headers instanceof Headers) headers.forEach((v, k) => (normalizedHeaders[k] = v))
  else if (Array.isArray(headers)) for (const [k, v] of headers) normalizedHeaders[k] = v
  else Object.assign(normalizedHeaders, headers)

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    Referer: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
    ...normalizedHeaders,
  }

  let finalBody: BodyInit | undefined
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json"
    finalBody = JSON.stringify(body)
  } else {
    finalBody = body as any
  }

  const fetchFn = isServer ? globalThis.fetch : window.fetch
  const res = await fetchFn(finalUrl, {
    method,
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  })

  let rawText: string | undefined
  try {
    rawText = await res.text()
  } catch {
    rawText = undefined
  }

  const contentType = res.headers.get("content-type") || ""
  let parsedJson: any = undefined
  if (parseJson && contentType.includes("application/json") && rawText) {
    try {
      parsedJson = JSON.parse(rawText)
    } catch {
      parsedJson = undefined
    }
  }

  // --- Error Handling (preserve status) ---
  if (throwOnError && !res.ok) {
    const message = parsedJson?.message || parsedJson?.error || rawText || res.statusText

    throw new HttpError(res.status, res.statusText, finalUrl, message, rawText)
  }

  // --- Success ---
  if (parseJson && parsedJson !== undefined) return parsedJson as T
  return (rawText as unknown) as T
}
