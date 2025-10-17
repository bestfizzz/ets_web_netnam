import AdminLayout from "@/components/layout-admin"
import ProfilesClient from "@/components/share/share-profile-client"
import { getShareProfiles } from "@/lib/api"

export default async function Page() {
  const { data, error } = await getShareProfiles()

  return (
    <AdminLayout>
      <div className="flex flex-col gap-3 p-3 xs:gap-6 xs:p-6">
        <ProfilesClient data={data} error={error} />
      </div>
    </AdminLayout>
  )
}
