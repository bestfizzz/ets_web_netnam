import { AssetsAPI } from "./assets"
import { ShareAPI } from "./share"

export const Endpoints = {
  assets: AssetsAPI,
  share: ShareAPI,
}

export type Endpoints = typeof Endpoints
