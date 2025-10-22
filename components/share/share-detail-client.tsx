"use client"

import * as React from "react"
import { ShareDetailTable } from "@/components/share/share-detail-table"
import { AddShareDetailModal } from "@/components/share/share-form-modal"
import { AddPlatformModal } from "@/components/share/share-platform-modal"
import { toast } from "sonner"

interface Platform {
  id: number
  name: string
}

interface ShareDetailsClientProps {
  platforms: Platform[]
  data: any[]
  error?: boolean
}

export default function ShareDetailsClient({
  platforms,
  data,
  error,
}: ShareDetailsClientProps) {
  React.useEffect(() => {
    if (error) toast.error("Failed to fetch details")
  }, [error])

  // Group details by platform
  const groupedData = platforms.map((platform) => ({
    platform,
    details: data.filter((item) => item.platform?.id === platform.id),
  }))

  const noDetails =
    !error && groupedData.every((g) => g.details.length === 0)

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <AddPlatformModal />
        <AddShareDetailModal platforms={platforms} />
      </div>

      {noDetails ? (
        <p className="text-gray-500">No details found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {groupedData.map(({ platform, details }) => (
            <ShareDetailTable
              key={platform.id}
              platform={platform}
              data={details}
            />
          ))}
        </div>
      )}
    </>
  )
}
