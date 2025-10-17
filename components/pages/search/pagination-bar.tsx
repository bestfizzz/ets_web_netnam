"use client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useGalleryContext } from "@/hooks/gallery-context"

export default function PaginationBar() {
  const { page, totalPages, setPage } = useGalleryContext()
  const handlePageClick = (n: number) => {
    if (n < 1 || n > totalPages) return
    setPage(n)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(1) }} isActive={page === 1}>1</PaginationLink>
        </PaginationItem>

        {page > 4 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(pn => pn !== 1 && pn !== totalPages && pn >= page - 2 && pn <= page + 2)
          .map(pn => (
            <PaginationItem key={pn}>
              <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(pn) }} isActive={pn === page}>{pn}</PaginationLink>
            </PaginationItem>
          ))}

        {page < totalPages - 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(totalPages) }} isActive={page === totalPages}>{totalPages}</PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }} className={page >= totalPages ? "pointer-events-none opacity-50" : ""} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
