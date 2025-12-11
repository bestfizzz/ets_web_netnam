
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

/** TemplateType */// types.ts (relevant parts)
export interface TemplateType {
  id: number
  name: string
}

/* Base settings shared by all templates */
export interface BaseTemplateSettings {
  metaTitle: string
  metaDescription: string
  themeColor: string
  pageTitle: string
  pageSize: number
  privateGallery: boolean
  pageLogo: string
  customCSS: string
  layout: string
  hasAds: boolean
  adbannerLeft: string
  adbannerRight: string
}

/* Per-template Settings (no accidental overlap) */
export interface ShareTemplateSettings extends BaseTemplateSettings {
  // intentionally empty — no search fields here
}

export interface SearchTemplateSettings extends BaseTemplateSettings {
  shareFields: {
    phone: boolean
    email: boolean
    telegramId: boolean
  }
  // add other search-only fields here
}

/* Json configs */
export interface TemplateJsonConfig {
  settings: BaseTemplateSettings
  content: Array<Record<string, any>>
}

export interface ShareTemplateJsonConfig {
  settings: ShareTemplateSettings
  content: Array<Record<string, any>>
}

export interface SearchTemplateJsonConfig {
  settings: SearchTemplateSettings
  content: Array<Record<string, any>>
}

export interface EmailTemplateJsonConfig {
  source_name: string
  subject: string
  html_content: string
}

/* discriminated TemplateDetail variants */
export interface BaseTemplateDetail {
  id: string
  name: string
  isActive: boolean
  templateType: TemplateType
  createdAt?: string
  updatedAt?: string
}

export interface ShareTemplateDetail extends BaseTemplateDetail {
  jsonConfig: ShareTemplateJsonConfig
}

export interface SearchTemplateDetail extends BaseTemplateDetail {
  jsonConfig: SearchTemplateJsonConfig
}

export interface EmailTemplateDetail extends BaseTemplateDetail {
  jsonConfig: EmailTemplateJsonConfig
}

export type TemplateDetail =
  | ShareTemplateDetail
  | SearchTemplateDetail
  | EmailTemplateDetail



