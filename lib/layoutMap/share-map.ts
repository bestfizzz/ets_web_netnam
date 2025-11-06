import ShareHeader from "@/components/pages/share/share-header"

export const ShareLayoutMap = {
  default: {
    id: "default",
    label: "default",
    header: ShareHeader,
  }
} as const

export type ShareLayoutKey = keyof typeof ShareLayoutMap
