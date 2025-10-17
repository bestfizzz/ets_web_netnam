"use client"

import * as React from "react"
import { ProfileTable } from "@/components/share/share-profile-table"
import { AddShareProfileModal } from "@/components/share/share-form-modal"
import { toast } from "sonner"

export default function ProfilesClient({ data, error }: any) {
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to fetch profiles")
    }
  }, [error])

  const noProfiles =
    !error &&
    data.facebook.length === 0 &&
    data.twitter.length === 0 &&
    data.linkedin.length === 0

  return (
    <>
      <div className="flex justify-end mb-4">
        <AddShareProfileModal />
      </div>

      {noProfiles && (
        <p className="text-gray-500">No profiles found.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        <ProfileTable socialPlatform="facebook" title="Facebook Profiles" data={data.facebook || []} />
        <ProfileTable socialPlatform="twitter" title="Twitter Profiles" data={data.twitter || []} />
        <ProfileTable socialPlatform="linkedin" title="LinkedIn Profiles" data={data.linkedin || []} />
      </div>
    </>
  )
}
