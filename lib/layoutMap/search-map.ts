import SearchHeader from "@/components/pages/search/search-header"
import SearchHeader1 from "@/components/pages/search/search-header-1"

export const SearchLayoutMap = {
  default: {
    id: "default",
    label: "Default",
    header: SearchHeader,
  },
  layout1: {
    id: "layout1",
    label: "Layout 1",
    header: SearchHeader1,
  },
} as const

export type SearchLayoutKey = keyof typeof SearchLayoutMap
