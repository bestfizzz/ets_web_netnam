  "use client"

  import { useEffect, useRef } from "react"
  import { Fancybox } from "@fancyapps/ui"
  import "@fancyapps/ui/dist/fancybox/fancybox.css"
  import { toast } from "sonner"

  export function useFancybox(
    images: any[],
    performDownload: (url?: string, filename?: string) => void,
    selectMode?: boolean
  ) {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
      const container = ref.current
      if (!container || !images || images.length === 0) return

      try {
        Fancybox.unbind(container)
      } catch {}

      Fancybox.bind(container, "[data-fancybox='gallery']", {
        Carousel: {
          Toolbar: {
            display: {
              left: ["counter"],
              middle: [
                "zoomIn",
                "zoomOut",
                "toggle1to1",
                "rotateCCW",
                "rotateCW",
                "flipX",
                "flipY",
                "reset",
              ],
              right: ["autoplay","download", "thumbs", "close"],
            },
            items: {
              myDownload: {
                tpl: `<button class="f-button" title="Download" data-fancybox-mydownload>
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path d="M5 20h14v-2H5v2zM12 2v12l4-4h-3V2h-2v8H8l4 4z"/>
                        </svg>
                      </button>`,
                click: (fancybox, slide) => {
                  const trigger = slide.$trigger as HTMLElement | null
                  if (trigger) {
                    const url = trigger.dataset.downloadSrc
                    const filename = trigger.dataset.downloadFilename
                    if (url) performDownload(url, filename)
                    else toast.error("No download URL")
                  }
                },
              },
            },
          },
        },
      })

      return () => {
        try {
          Fancybox.unbind(container)
        } catch {}
      }
    }, [images, selectMode, performDownload])

    return ref
  }
