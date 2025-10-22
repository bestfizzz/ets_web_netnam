"use client"

import { PortableText } from "@portabletext/react"
import SearchPageWrapper from "@/components/pages/search/search-page-wrapper"
import GallerySection from "@/components/pages/gallery-section"
import { GalleryProvider } from "@/hooks/gallery-context"
import SharePageWrapper from "@/components/pages/share/share-page-wrapper"
const components = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">
        {children}
      </h1>
    ),
    normal: ({ children }) => (
      <p className="text-white mb-6 text-center text-sm md:text-base">
        {children}
      </p>
    ),
  },
  types: {
    searchBar: ({ value }) => (
      <div className="w-full flex flex-col md:flex-row mb-6 gap-2 md:gap-0">
        <input
          type="text"
          placeholder={value.placeholder}
          className="flex-1 p-3 rounded border"
        />
        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100">
          Search
        </button>
      </div>
    ),
    feature: ({ value }) => (
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded shadow text-center mb-4">
        <h4 className="text-white font-semibold text-lg">{value.title}</h4>
        <p className="text-white text-sm">{value.description}</p>
      </div>
    ),
    footer: ({ value }) => (
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">{value.text}</p>
        </div>
      </footer>
    ),
    logoBlock: ({ value }) => (
      <div className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {value.leftLogo ? (
            <img
              src={value.leftLogo}
              alt="Left Logo"
              className="h-8 w-auto object-contain"
            />
          ) : null}

          {value.rightLogo ? (
            <img
              src={value.rightLogo}
              alt="Right Logo"
              className="h-8 w-auto object-contain"
            />
          ) : null}

        </div>
      </div>
    ),
    GallerySection: () => <GallerySection />,
  },
}

export default function TemplateGenerator({
  content,
  pageName,
  settings,
  preview = false,
  uuid = ""
}) {
  const Wrapper =
    pageName === "search"
      ? SearchPageWrapper
      : pageName === "share"
        ? SharePageWrapper
        : React.Fragment
  return (
    <GalleryProvider gallerySettings={settings}>
      <Wrapper uuid={uuid} settings={settings} preview={preview}>
        {settings.customCSS && <style dangerouslySetInnerHTML={{ __html: settings.customCSS }} />}
        <PortableText value={content} components={components} />
      </Wrapper>
    </GalleryProvider>
  )
}
