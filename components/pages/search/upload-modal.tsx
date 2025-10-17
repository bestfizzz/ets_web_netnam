"use client"

import { useRef, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Camera, Upload, Trash2, Search } from "lucide-react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  query: string
  setQuery: (query: string) => void
}

export function UploadModal({ open, onClose, onUpload, query, setQuery }: UploadModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [streamReady, setStreamReady] = useState(false)
  const [videoRatio, setVideoRatio] = useState(4 / 3)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "search">("upload")

  // Start camera when modal opens and upload tab is active
  useEffect(() => {
    if (!open || capturedBlob || activeTab !== "upload") {
      // Stop camera when modal closes or tab switches
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
        setStreamReady(false)
      }
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera not supported on this device")
      return
    }

    let isMounted = true

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        })
        
        if (!isMounted) {
          s.getTracks().forEach((track) => track.stop())
          return
        }
        
        setStream(s)
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.onloadedmetadata = () => {
            if (isMounted && videoRef.current) {
              const ratio =
                videoRef.current.videoWidth / videoRef.current.videoHeight || 4 / 3
              setVideoRatio(ratio)
              setStreamReady(true)
            }
          }
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          toast.error(
            "Unable to access camera. Please check permissions or use file upload."
          )
        }
      }
    }

    startCamera()

    return () => {
      isMounted = false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [open, capturedBlob, activeTab])

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = 1080
    canvas.height = canvas.width / videoRatio
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) setCapturedBlob(blob)
      }, "image/jpeg")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCapturedBlob(file)
  }

  const handleSubmit = async () => {
    if (!capturedBlob) return toast.error("No image selected or captured")
    const file = new File([capturedBlob], "upload.jpg", { type: capturedBlob.type })
    setLoading(true)
    try {
      await onUpload(file)
      setCapturedBlob(null)
      onClose()
    } catch (err) {
      toast.error("Upload failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Clean up camera stream when closing
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setStreamReady(false)
    }
    setCapturedBlob(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Search & Upload</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            Search by text or upload an image to find similar photos.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "search"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="w-4 h-4" />
            Search by Text
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "upload"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
        </div>

        <div className="flex flex-col gap-6 pt-2">
          {/* Search Tab */}
          {activeTab === "search" && (
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Search by keywords
                </label>
                <Input
                  placeholder="e.g., beach sunset, family portrait..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Images
              </Button>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <>
              {!capturedBlob && (
                <>
                  <div
                    className="relative w-full rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center"
                    style={{ paddingTop: `${100 / videoRatio}%` }}
                  >
                    {!streamReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Camera className="w-14 h-14 mb-2" />
                        <span className="text-sm">Camera loading...</span>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`absolute top-0 left-0 w-full h-full object-cover ${
                        !streamReady ? "hidden" : ""
                      }`}
                    />
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={capturePhoto}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 active:scale-95 transition"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </Button>

                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 active:scale-95 transition"
                        asChild
                      >
                        <span className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Select File
                        </span>
                      </Button>
                    </label>
                  </div>
                </>
              )}

              {capturedBlob && (
                <div className="flex flex-col gap-4 items-center">
                  <img
                    src={URL.createObjectURL(capturedBlob)}
                    alt="Preview"
                    className="max-h-64 w-full object-contain rounded-md border"
                  />
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-5 py-3 rounded-lg hover:bg-gray-100 transition"
                      onClick={() => setCapturedBlob(null)}
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={handleSubmit}
                      className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 active:scale-95 transition"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}