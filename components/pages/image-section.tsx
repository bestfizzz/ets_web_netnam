import { Label } from "@/components/ui/label"
import ImageGrid from "@/components/pages/image-grid"
import PaginationBar from "@/components/pages/search/pagination-bar"
import { useGalleryContext } from "@/hooks/gallery-context"

export default function ImageSection() {
    const { pageSize, page, total } = useGalleryContext()
    return (
        <>
            <Label className="mt-6 text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">{pageSize * (page - 1) + 1}</span>–
                <span className="font-medium">
                    {Math.min(pageSize * page, total)}
                </span>{" "}
                of <span className="font-medium">{total}</span>{" "}
                {total === 1 ? "image" : "images"} found
            </Label>

            <ImageGrid />

            <div className="flex justify-center mt-10">
                <PaginationBar />
            </div>
        </>
    )
}