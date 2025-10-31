import { http } from "@/lib/http"

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

  return await http(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets`, {
    method: "POST",
    body: formData,
    parseJson: true,
    throwOnError: true,
  })
}
