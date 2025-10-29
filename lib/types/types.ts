
// types/assets
export interface Asset {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedSection<T> {
  total: number
  count: number
  items: T[]
  facets: any[]
  nextPage?: string
}

export interface PaginatedAssets {
  albums: PaginatedSection<any> // or define Album type later
  assets: PaginatedSection<Asset>
}

// types/url-manager
export interface UrlManager {
  id: number
  uuid: string
  name: string
  shareDetails: ShareDetail[]
  templateDetails: TemplateDetail[]
}

/** SharePlatform */
export interface SharePlatform {
  id: number
  name: string
}

/** Share detail entry (expand with real fields if available) */
export type ShareDetail = {
  id: number
  name: string
  platform: SharePlatform
  settings?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

/** TemplateType */
export type TemplateType =  { id: number; name: string }

export interface TemplateJsonConfig {
  settings: {
    themeColor: string
    pageTitle: string
    pageSize: number
    privateGallery: boolean
    pageLogo: string
    customCSS: string
  }
  content: Array<Record<string, any>>
}

export interface TemplateDetail {
  id: string
  name: string
  templateType: TemplateType
  jsonConfig: TemplateJsonConfig
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

