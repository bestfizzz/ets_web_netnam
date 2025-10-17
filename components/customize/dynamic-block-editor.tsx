import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toTitle } from "@/lib/utils"

export function DynamicBlockEditor({
  block,
  idx,
  setValue,
  fieldValue
}: any) {
  const updateField = (key: string, newVal: string) => {
    const copy = [...fieldValue]
    copy[idx] = { ...copy[idx], [key]: newVal }
    setValue("content", copy)
  }

  const renderField = (key: string, value: any) => {
    const lower = key.toLowerCase()
    const title = toTitle(key) || '';
    switch (true) {
      case /^title\d*/.test(lower):
        return (
          <>
            <Label className="text-xs capitalize">{title}</Label>
            <Input
              value={value}
              placeholder="Enter title"
              onChange={(e) => updateField(key, e.target.value)}
            />
          </>
        )

      case /^desc(ription)?\d*/.test(lower):
        return (
          <>
            <Label className="text-xs capitalize">{title}</Label>
            <Textarea
              value={value}
              placeholder="Enter description"
              onChange={(e) => updateField(key, e.target.value)}
            />
          </>
        )

      case /^image(url)?\d*/.test(lower):
      case /logo/.test(lower):
        return (
          <>
            <Label className="text-xs capitalize">{title}</Label>
            <Input
              type="url"
              value={value}
              placeholder="https://example.com/image.png"
              onChange={(e) => updateField(key, e.target.value)}
            />
          </>
        )

      case /color/.test(lower):
        return (
          <>
            <Label className="text-xs capitalize">{title}</Label>
            <Input
              type="color"
              value={value}
              onChange={(e) => updateField(key, e.target.value)}
            />
          </>
        )

      default:
        return (
          <>
            <Label className="text-xs capitalize">{title}</Label>
            <Input
              value={value}
              placeholder={`Enter ${key}`}
              onChange={(e) => updateField(key, e.target.value)}
            />
          </>
        )
    }
  }

  // ✅ Special handling for rich-text "block" type
  if (block._type === "block") {
    const textValue =
      block.children?.map((c: any) => c.text).join(" ") || ""

    const handleTextChange = (newText: string) => {
      const copy = [...fieldValue]
      copy[idx] = {
        ...copy[idx],
        children: [{ _type: "span", text: newText }],
      }
      setValue("content", copy)
    }

    return (
        <Input
          value={textValue}
          placeholder="Enter text content"
          onChange={(e) => handleTextChange(e.target.value)}
        />
    )
  }

  // ✅ Default dynamic block editor for all other types
  return (
    <>
      {Object.entries(block).map(([key, value]) =>
        key === "_type" ? null : (
          <div key={key} className="flex flex-col gap-1">
            {renderField(key, value)}
          </div>
        )
      )}
    </>
  )
}
