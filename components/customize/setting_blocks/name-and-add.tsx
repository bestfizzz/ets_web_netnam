import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Check, Pencil } from "lucide-react"

export default function NameAndAdd({
  editingName,
  setEditingName,
  control,
  errors,
  nameInputRef,
  onAddClick,
  setValue,
}: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 pb-3">
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Template name is required",
          minLength: { value: 3, message: "At least 3 characters" },
          maxLength: { value: 50, message: "Max 50 characters" },
        }}
        render={({ field }) => (
          <div className="relative flex items-center gap-2 w-[60%]">
            {editingName ? (
              <div className="relative w-full">
                <Input
                  {...field}
                  ref={(el: any) => {
                    field.ref(el)
                    nameInputRef.current = el
                  }}
                  placeholder="Enter template name..."
                  className={`text-xl font-bold pr-10 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    if (!errors.name) {
                      setValue("name", field.value, { shouldValidate: true }) // ✅ persist new value
                      setEditingName(false)
                    }
                  }}
                >
                  <Check size={16} />
                </button>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>
            ) : (
              <>
                <span className="text-lg font-bold">{field.value}</span>
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={16} />
                </button>
              </>
            )}
          </div>
        )}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={onAddClick}
          >
            Add Block
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  )
}
