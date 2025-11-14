import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const performDownload = async (url?: string | null, filename?: string) => {
  if (!url) return toast.error("Không tìm thấy URL tải xuống")
  const id = toast.loading("Đang tải xuống ảnh của bạn...")
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const ext = blob.type.split("/")[1] || "jpeg"
    const objUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objUrl
    a.download = `${filename}.${ext}` || `Image_${Date.now()}.jpeg`
    a.click()
    URL.revokeObjectURL(objUrl)
    toast.success("Tải xuống hoàn tất", { id })
  } catch {
    toast.error("❌ Tải xuống thất bại", { id })
  }
}

export const downloadSelected = async (
  selectedMap: Record<string, { download: string; filename?: string }>,
  pageTitle?: string
) => {
  const title = pageTitle?.trim() ? pageTitle : "Event" 

  const ids = Object.keys(selectedMap)
  if (ids.length === 0) return toast.error("Không có ảnh nào được chọn")

  // Single image → direct download
  if (ids.length === 1) {
    const id = ids[0]
    const meta = selectedMap[id]
    if (!meta?.download) return toast.error("Không tìm thấy URL tải xuống")
    await performDownload(meta.download, meta.filename || `Image_${id}.jpeg`)
    return
  }

  // Multiple images → ZIP
  const total = ids.length
  const toastId = toast.loading(`Đang tải xuống 0 / ${total} ảnh...`)
  const zip = new JSZip()
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const meta = selectedMap[id]
    if (!meta?.download) {
      failCount++
      continue
    }

    try {
      const res = await fetch(meta.download)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const blob = await res.blob()
      const ext = blob.type.split("/")[1] || "jpeg"
      const filename = meta.filename ? `${meta.filename}.${ext}` : `Image_${i + 1}.${ext}`

      zip.file(filename, blob, { binary: true })
      successCount++
    } catch (err) {
      console.warn(`❌ Failed to fetch ${meta.download}`, err)
      failCount++
    }

    toast.message(`🔄 Đang tải ảnh ${successCount + failCount} / ${total}...`, { id: toastId })
    await new Promise((r) => setTimeout(r, 50))
  }

  toast.message("📦 Đang nén ảnh...", { id: toastId })

  try {
    const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" })
    saveAs(zipBlob, `${title}_${Date.now()}.zip`) 
    toast.success(`✅ Hoàn tất tải ${successCount}/${total} ảnh`, { id: toastId })
  } catch (err) {
    console.error(err)
    toast.error("❌ Nén ảnh thất bại", { id: toastId })
  }
}

export const scrollToGallery = () => {
  const target = document.getElementById("gallery-section")
  if (!target) return

  const header = document.querySelector("header")
  const headerHeight = header?.offsetHeight ?? 0

  // Get the real scroll position relative to the document
  const y =
    target.getBoundingClientRect().top +
    (window.pageYOffset || document.documentElement.scrollTop) -
    headerHeight

  // Force browser reflow before scrolling (helps on mobile Safari)
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, behavior: "smooth" })
  })
}

export const toTitle = (str: string) => {
  return str
    // insert space before capitals or numbers
    .replace(/([A-Z0-9])/g, " $1")
    // capitalize first character
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

export const nSpaceTrimmer = (str: string) => {
  const cleaned = str.replace(/\n{3,}/g, "\n\n")
  return cleaned.trim()
}

export const formatVietnamesePhone = (input: string) => {
  const digits = input.replace(/\D/g, "")
  if (digits.startsWith("84")) return digits
  if (digits.startsWith("0")) return "84" + digits.slice(1)
  if (digits.startsWith("84")) return digits
  if (digits.length === 9) return "84" + digits
  return digits
}

export function extractIdsByPrefix(payload: Record<string, any>, prefix: string): number[] {
  return Object.entries(payload)
    .filter(([key, value]) => key.startsWith(prefix) && value && value !== "none")
    .map(([_, value]) => Number(value))
    .filter((n) => !Number.isNaN(n))
}


