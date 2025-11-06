"use client"

import GallerySection from '@/components/pages/gallery-section'
import ImageGridWithComponents from '@/components/pages/image-component-grid'
import SearchPageWrapper from '@/components/pages/search/search-page-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { GalleryProvider } from '@/hooks/gallery-context'
import { CalendarDays } from "lucide-react"


type Logos = {
  image: string
  alt: string
}

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-950 to-gray-900 text-white py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
          Empowering <span className="text-primary">Digital Connectivity</span>
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
          Connecting people, data, and possibilities through innovation and global infrastructure.
        </p>
        <div className="mt-10">
          <a
            href="#partners"
            className="inline-block rounded-lg bg-primary px-8 py-3 text-white font-medium hover:bg-primary/80 transition"
          >
            Explore Our Network
          </a>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(120,120,255,0.15),transparent_70%)]"></div>
    </section>
  )
}

const InfoSection = () => {
  return (
    <section className="bg-gray-900 text-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            A Global Network You Can Trust
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Our infrastructure spans continents — ensuring fast, secure, and reliable connections
            for enterprises and communities alike. With partnerships across multiple international
            backbones and local ISPs, we deliver seamless performance for modern digital demands.
          </p>
          <ul className="space-y-3 text-gray-300">
            <li>🌐 150+ Global Data Routes</li>
            <li>⚡ 99.99% Uptime SLA</li>
            <li>🔒 Enterprise-Grade Security</li>
            <li>📡 Multi-Continent Fiber Connectivity</li>
          </ul>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://netnam.com/hubfs/netnam_website_image/01_module_assets/1_1_global_modules_assets/1_1_5_global_cable_map/mjx-netnam-world-cable-map-min-1.png"
            alt="Global Cable Map"
            className="object-cover w-full h-full opacity-90 hover:opacity-100 transition"
          />
        </div>
      </div>
    </section>
  )
}

const StatsSection = () => {
  const stats = [
    { value: "+30", label: "Years of experience accompanying Vietnam’s development" },
    { value: "3", label: "Strategic branches in Hanoi, Ho Chi Minh City, and Da Nang" },
    { value: "+70%", label: "Of S&T national-scale institutions use NetNam’s services" },
    { value: "+1,000", label: "High-profile events utilizing NetNam services annually" },
    { value: "+300", label: "Experienced professionals in Internet & IT" },
  ];

  return (
    <section className="relative bg-[#0B1612] text-white py-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 lg:px-12">
        {/* LEFT SIDE: CONTENT */}
        <div className="flex-1 z-10">
          <p className="text-sm text-emerald-400 uppercase tracking-widest mb-3">
            Leading ISP since 1994
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-10 max-w-xl">
            30 years of pioneering Internet Services and Network Solutions in Vietnam
          </h2>

          {/* STAT GRID */}
          <div className="grid gap-6 sm:grid-cols-2">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <h3 className="text-4xl font-bold text-emerald-400 mb-2">{item.value}</h3>
                <p className="text-gray-300 text-sm">{item.label}</p>
              </div>
            ))}
          </div>

          <a
            href="#learn-more"
            className="inline-block mt-10 text-emerald-400 hover:text-emerald-300 transition"
          >
            Learn more about NetNam →
          </a>
        </div>

        {/* RIGHT SIDE: MAP IMAGE */}
        <div className="flex-1 relative w-full h-[500px] lg:h-[600px]">
          {/* Base map */}
          <img
            src="https://netnam.com/hubfs/netnam_website_image/01_module_assets/1_1_global_modules_assets/1_1_5_global_cable_map/mjx-netnam-world-cable-map-min-1.png"
            alt="World map base"
            className="absolute inset-0 w-full h-full object-contain opacity-60"
          />
          {/* Overlay map */}
          <img
            src="https://netnam.com/hubfs/netnam_website_image/01_module_assets/1_1_global_modules_assets/1_1_5_global_cable_map/mjx-netnam-world-map-cable-mobile.avif"
            alt="World cable overlay"
            className="absolute inset-0 w-full h-full object-contain mix-blend-lighten opacity-90"
          />
        </div>
      </div>
    </section>
  );
}

const LogoCloud = ({ logos }: { logos: Logos[] }) => {
  return (
    <section id="partners" className="bg-muted py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Trusted by <span className="text-primary">Industry Leaders</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Proudly partnering with top brands to drive success.
          </p>
        </div>

        <Card className="py-14 shadow-lg">
          <CardContent className="px-14">
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 max-sm:flex-col">
              {logos.map((logo, index) => (
                <img key={index} src={logo.image} alt={logo.alt} className="h-7 grayscale hover:grayscale-0 transition" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

const logos = [
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/amazon-logo-bw.png', alt: 'Amazon' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/hubspot-logo-bw.png', alt: 'HubSpot' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/walmart-logo-bw.png', alt: 'Walmart' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-logo-bw.png', alt: 'Microsoft' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/evernote-icon-bw.png', alt: 'Evernote' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/paypal-logo-bw.png', alt: 'PayPal' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/airbnb-logo-bw.png', alt: 'Airbnb' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/adobe-logo-bw.png', alt: 'Adobe' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/shopify-logo-bw.png', alt: 'Shopify' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/huawei-logo-bw.png', alt: 'Huawei' },
]



const LogoCloudPage = () => {
  return (
    <GalleryProvider>
      <SearchPageWrapper settings="logo-cloud" uuid="logo-cloud" preview={true}>
        <HeroSection />
        <StatsSection />
        <LogoCloud logos={logos} />
        <ImageGridWithComponents/>
      </SearchPageWrapper>
    </GalleryProvider>
  )
}

export default LogoCloudPage
