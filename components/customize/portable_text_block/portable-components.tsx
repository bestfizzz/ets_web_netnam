import { PortableTextComponents, PortableTextBlockComponent, PortableTextComponentProps } from "@portabletext/react"
import type { TypedObject } from "@portabletext/types"
import GallerySection from "@/components/pages/gallery-section"
import GalleryContentSection from "@/components/pages/gallery-content-section"

// -----------------------------
// Components
// -----------------------------
const block: Record<string, PortableTextBlockComponent> = {
    h1: ({ children }: PortableTextComponentProps<TypedObject>) => (
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">{children}</h1>
    ),
    normal: ({ children }: PortableTextComponentProps<TypedObject>) => (
        <p className="mb-6 text-center text-sm md:text-base">{children}</p>
    ),
}

const types: Partial<PortableTextComponents["types"]> = {
    searchBar: ({ value }: any) => (
        <div className="w-full flex flex-col md:flex-row mb-6 gap-2 md:gap-0">
            <input type="text" placeholder={value.placeholder} className="flex-1 p-3 rounded border" />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100">
                Search
            </button>
        </div>
    ),
    feature: ({ value }: any) => (
        <div className="bg-white/30 backdrop-blur-sm p-4 rounded shadow text-center mb-4">
            <h4 className="text-white font-semibold text-lg">{value.title}</h4>
            <p className="text-white text-sm">{value.description}</p>
        </div>
    ),
    footer: ({ value }: any) => (
        <footer className="bg-gray-800 text-white py-4 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm md:text-base">{value.text}</p>
            </div>
        </footer>
    ),
    logoBlock: ({ value }: any) => (
        <div className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {value.leftLogo && <img src={value.leftLogo} alt="Left Logo" className="h-8 w-auto object-contain" />}
                {value.rightLogo && <img src={value.rightLogo} alt="Right Logo" className="h-8 w-auto object-contain" />}
            </div>
        </div>
    ),
    GallerySection: ({ value }: any) => <GallerySection layoutType={value.layoutType} />,
    GalleryContentSection: ({ value }: any) => (
        <GalleryContentSection
            promoImages={{
                imagePromo: value.image1,
                imageInfo: value.image2,
                imageCTA: value.image3,
                imageRow: value.image4,
            }}
        />
    ),
}

const components: Partial<PortableTextComponents> = { block, types }

export default components