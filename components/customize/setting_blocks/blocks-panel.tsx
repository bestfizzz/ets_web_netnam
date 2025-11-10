import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Label } from "@/components/ui/label"
import { DraggableBlock } from "@/components/customize/draggable-block"
import { DynamicBlockEditor } from "@/components/customize/dynamic-block-editor"
import { Controller } from "react-hook-form"


export default function BlocksPanel({ control, mounted, content, setValue, collapsed, toggleCollapse, removeBlock,scrollContainerRef }: any) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = Number(String(active.id).split("-")[1])
      const to = Number(String(over.id).split("-")[1])
      setValue("content", arrayMove(content, from, to))
      // collapsed rearrangement should be handled by parent if needed
    }
  }

  return (
    <div>
      <Label className="px-3 py-1 text-sm">Content Blocks</Label>
      <div className="flex-1 max-h-[400px] overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100" ref={scrollContainerRef} >
        {mounted && content && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={content.map((_: any, i: any) => `block-${i}`)} strategy={verticalListSortingStrategy}>
              <Controller name="content" control={control} render={({ field }) => (
                <div className="space-y-2">
                  {field.value?.map((block: any, idx: number) => (
                    <DraggableBlock key={idx} id={`block-${idx}`} block={block} idx={idx} collapsed={collapsed[idx]} toggleCollapse={toggleCollapse} removeBlock={removeBlock}>
                      <DynamicBlockEditor block={block} idx={idx} setValue={setValue} fieldValue={field.value} />
                    </DraggableBlock>
                  ))}
                </div>
              )} />
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}