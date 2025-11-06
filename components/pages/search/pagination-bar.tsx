"use client"

import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useGalleryContext } from "@/hooks/gallery-context"

export default function PaginationBar() {
  const { page, totalPages, setPage } = useGalleryContext()

  const [leftJumpVisible, setLeftJumpVisible] = useState(false)
  const [rightJumpVisible, setRightJumpVisible] = useState(false)
  const [jumpValue, setJumpValue] = useState("")

  const handlePageClick = (n: number) => {
    if (n < 1 || n > totalPages) return
    setPage(n)
  }

  const handleJumpSubmit = (e: React.FormEvent, side: "left" | "right") => {
    e.preventDefault()
    const num = Number(jumpValue)
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num)
    }
    setJumpValue("")
    if (side === "left") setLeftJumpVisible(false)
    else setRightJumpVisible(false)
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* ◀ Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) setPage(page - 1)
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* First Page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => { e.preventDefault(); handlePageClick(1) }}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Left Ellipsis */}
        {page > 4 && (
          <PaginationItem>
            {leftJumpVisible ? (
              <form onSubmit={(e) => handleJumpSubmit(e, "left")} className="flex items-center">
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  className="w-16 h-7 text-sm text-center px-1 py-0"
                  autoFocus
                  onBlur={() => setLeftJumpVisible(false)}
                />
              </form>
            ) : (
              <PaginationEllipsis
                className="cursor-pointer hover:text-blue-500 transition"
                onClick={() => {
                  setJumpValue("")
                  setLeftJumpVisible(true)
                  setRightJumpVisible(false)
                }}
              />
            )}
          </PaginationItem>
        )}

        {/* Middle Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(pn => pn !== 1 && pn !== totalPages && pn >= page - 2 && pn <= page + 2)
          .map(pn => (
            <PaginationItem key={pn}>
              <PaginationLink
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageClick(pn) }}
                isActive={pn === page}
              >
                {pn}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Right Ellipsis */}
        {page < totalPages - 3 && (
          <PaginationItem>
            {rightJumpVisible ? (
              <form onSubmit={(e) => handleJumpSubmit(e, "right")} className="flex items-center">
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  className="w-16 h-7 text-sm text-center px-1 py-0"
                  autoFocus
                  onBlur={() => setRightJumpVisible(false)}
                />
              </form>
            ) : (
              <PaginationEllipsis
                className="cursor-pointer hover:text-blue-500 transition"
                onClick={() => {
                  setJumpValue("")
                  setRightJumpVisible(true)
                  setLeftJumpVisible(false)
                }}
              />
            )}
          </PaginationItem>
        )}

        {/* Last Page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => { e.preventDefault(); handlePageClick(totalPages) }}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* ▶ Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) setPage(page + 1)
            }}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
