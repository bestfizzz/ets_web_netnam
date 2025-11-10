"use client"

interface AdBannerProps {
  side: "left" | "right"
  src?: string
  alt?: string
}

export default function AdBanner({
  side,
  src = "https://placehold.co/160x900",
  alt = "Ad Banner",
}: AdBannerProps) {
  const positionClasses =
    side === "left"
      ? "left-0"
      : "right-0"

  return (
    <aside
      className={`hidden lg:flex fixed top-[var(--header-height,4rem)] ${positionClasses} 
        h-[calc(100vh-var(--header-height,4rem))] w-40 z-20`}
    >
      <div className="sticky top-0 flex h-full w-full p-2">
        <img
          src={src.trim()==="" ? "https://placehold.co/160x900" : src}
          alt={alt}
          className="rounded-lg shadow-sm object-cover w-full h-full"
        />
      </div>
    </aside>
  )
}
