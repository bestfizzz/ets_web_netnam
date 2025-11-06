"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronRight, GripVertical as IconGripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toTitle } from "@/lib/utils"

interface DraggableBlockProps {
  id: string
  block: any
  idx: number
  collapsed: boolean
  toggleCollapse: (i: number) => void
  removeBlock: (i: number) => void
  children: React.ReactNode
}

export const DraggableBlock = ({
  id,
  block,
  idx,
  collapsed,
  toggleCollapse,
  removeBlock,
  children
}: DraggableBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const blockLabels: Record<string, string> = {
    block: "Text Block",
    feature: "Feature Card",
  }

  const styleLabels: Record<string, string> = {
    h1: "Heading (H1)",
    normal: "Paragraph (Normal)"
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="border rounded p-2 flex flex-col gap-2 bg-white"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <div {...listeners} {...attributes} className="cursor-grab">
          <IconGripVertical className="text-muted-foreground w-4 h-4" />
        </div>

        {/* Block label clickable to toggle collapse */}
        <button
          type="button"
          onClick={() => toggleCollapse(idx)}
          className="text-left font-semibold text-sm ml-1 flex-1 cursor-pointer"
        >
          {blockLabels[block._type] || toTitle(block._type)}
          {block._type === "block" && block.style
            ? ` — ${styleLabels[block.style] || block.style}`
            : ""}
        </button>

        {/* Collapse arrow */}
        <button type="button" onClick={() => toggleCollapse(idx)} className="flex items-center">
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <div className="mt-2 space-y-2">
          {children}

          {/* Remove button */}
          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={() => removeBlock(idx)} disabled={block._type=='GallerySection'||block._type=='GalleryContentSection'}>
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
