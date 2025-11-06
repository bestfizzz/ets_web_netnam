"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ImageSearchDialogProps {
    open: boolean
    onClose: () => void
    onUpload: (file: File) => Promise<void>
}

export function ImageSearchDialog({ open, onClose, onUpload }: ImageSearchDialogProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [streamReady, setStreamReady] = useState(false)
    const [videoRatio, setVideoRatio] = useState(4 / 3)
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
    const [loading, setLoading] = useState(false)

    // Start camera when opened
    useEffect(() => {
        if (!open || capturedBlob) return
        let active = true

        const start = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: true })
                if (!active) {
                    s.getTracks().forEach(t => t.stop())
                    return
                }
                setStream(s)
                if (videoRef.current) {
                    videoRef.current.srcObject = s
                    videoRef.current.onloadedmetadata = () => {
                        setVideoRatio(videoRef.current!.videoWidth / videoRef.current!.videoHeight || 4 / 3)
                        setStreamReady(true)
                    }
                }
            } catch (e) {
                toast.error("Camera access failed")
            }
        }

        start()
        return () => {
            active = false
            stream?.getTracks().forEach(t => t.stop())
        }
    }, [open, capturedBlob])

    const capture = () => {
        if (!videoRef.current) return
        const video = videoRef.current
        const canvas = document.createElement("canvas")
        canvas.width = 1080
        canvas.height = canvas.width / videoRatio
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(b => b && setCapturedBlob(b), "image/jpeg")
    }

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) setCapturedBlob(f)
    }

    const upload = async () => {
        if (!capturedBlob) return toast.error("No image selected")
        const file = new File([capturedBlob], "search.jpg", { type: capturedBlob.type })
        setLoading(true)
        try {
            await onUpload(file)
            setCapturedBlob(null)
            handleClose()
        } catch {
            toast.error("Upload failed")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        stream?.getTracks().forEach(t => t.stop())
        setStream(null)
        setStreamReady(false)
        setCapturedBlob(null)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Search by Image</DialogTitle>
                </DialogHeader>

                {!capturedBlob ? (
                    <>
                        <div
                            className="relative w-full rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center"
                            style={{ paddingTop: `${100 / videoRatio}%` }}
                        >
                            {!streamReady && <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading camera...</div>}
                            <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${!streamReady && "hidden"}`} />
                        </div>

                        <div className="flex justify-center gap-4 mt-4">
                            <Button onClick={capture} className="bg-indigo-600 text-white hover:bg-indigo-700">
                                <Camera className="w-5 h-5 mr-2" /> Capture
                            </Button>
                            <label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={selectFile}
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
                ) : (
                    <div className="flex flex-col items-center gap-4 mt-2">
                        <img src={URL.createObjectURL(capturedBlob)} alt="preview" className="w-full rounded-md object-cover border" />
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setCapturedBlob(null)}>
                                <Trash2 className="w-5 h-5 mr-2" /> Delete
                            </Button>
                            <Button disabled={loading} onClick={upload} className="bg-green-600 text-white hover:bg-green-700">
                                {loading ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
