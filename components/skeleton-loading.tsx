"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 grow-6 rounded" /> {/* title */}
        <Skeleton className="h-10 grow-3 rounded" /> {/* button */}
      </div>

      {/* Main content blocks */}
      <div className="space-y-6 flex-1">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  )
}
