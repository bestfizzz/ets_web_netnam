export default async function uploadAsset(file: File, uuid: string) {
  const MAX_SIZE_MB = 2
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    const err: any = new Error(`File too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`)
    err.code = "FILE_TOO_LARGE"
    throw err
  }

  const formData = new FormData()
  formData.append("assetData", file)
  formData.append("uuid", uuid)

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${text}`)
  }

  return res.json()
}
