export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface HttpOptions extends Omit<RequestInit, "body"> {
  throwOnError?: boolean
  parseJson?: boolean
  query?: Record<string, string | number | boolean | undefined | null>
  body?: BodyInit | Record<string, any>
  baseUrl?: string
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

  const normalizedHeaders: Record<string, string> = {}
  if (headers instanceof Headers) headers.forEach((v, k) => (normalizedHeaders[k] = v))
  else if (Array.isArray(headers)) for (const [k, v] of headers) normalizedHeaders[k] = v
  else Object.assign(normalizedHeaders, headers)

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...normalizedHeaders,
  }

  let finalBody: BodyInit | undefined
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json"
    finalBody = JSON.stringify(body)
  } else finalBody = body as any

  const fetchFn = isServer ? globalThis.fetch : window.fetch

  const res = await fetchFn(finalUrl, {
    method,
    headers: finalHeaders,
    body: finalBody,
    cache: "no-store",
    credentials: "include",
    ...rest,
  })

  if (throwOnError && !res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`)
  }

  if (parseJson && res.headers.get("content-type")?.includes("application/json")) {
    return res.json() as Promise<T>
  }

  return res as unknown as T
}
