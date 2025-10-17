"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"

interface BackButtonProps {
  path: string
}

export default function BackButton({ path }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() => router.push(path)}
      type="button"
      size={"default"}
      className="inline-flex pl-0 justify-start w-fit items-center gap-3 text-md bg-gray-100"
    >
      <ChevronLeftIcon className="w-5 h-5" strokeWidth={2} />
      Back
    </Button>
  )
}
