import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useGalleryContext } from "@/hooks/gallery-context"
import ImageComponentGrid from "@/components/pages/image-component-grid"
import PaginationBar from "@/components/pages/search/pagination-bar"

export default function ImageContentSection({layoutType="default"}: { layoutType?: "default" | "masonry"}) {
  const { pageSize, page, total, mode, setPage, loading, nextPage } = useGalleryContext()

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  return (
    <>
      {/* ✅ Hide total label if keyword mode */}
      {mode !== "keyword" && (
        <Label className="mt-6 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">{pageSize * (page - 1) + 1}</span>–
          <span className="font-medium">
            {Math.min(pageSize * page, total)}
          </span>{" "}
          of <span className="font-medium">{total}</span>{" "}
          {total === 1 ? "image" : "images"} found
        </Label>
      )}

      <ImageComponentGrid layoutType={layoutType} />

      {/* ✅ If keyword mode: show "Load more" instead of pagination */}
      {mode === "keyword" ? (
        <div className="flex justify-center mt-10">
          {nextPage && (
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <PaginationBar />
        </div>
      )}
    </>
  )
}
