import AdminLayout from "@/components/layout-admin"
import { URLTable, URL } from "@/components/url/url-table"
import { cookies } from "next/headers";

async function getURLs(): Promise<{ data: URL[]; error?: string }> {
    try {
        const cookieStore = cookies()
        const session = (await cookieStore).get("session")?.value
        const accessToken = (await cookieStore).get("accessToken")?.value
        const res = await fetch(`${process.env.URL}/api/url-manager`, {
            cache: "no-store",
            headers: {
                cookie: `session=${session};accessToken=${accessToken}`,
            },
        })

        if (!res.ok) {
            const text = await res.text()
            console.error("Failed to fetch URLs:", res.status, text)
            return { data: [], error: `Failed to fetch URLs: ${res.status}` }
        }

        const data: URL[] = await res.json()
        return { data }
    } catch (err) {
        console.error("Network error:", err)
        return { data: [], error: "Network error while fetching URLs" }
    }
}

export default async function Page() {
    const { data, error } = await getURLs()

    return (
        <AdminLayout>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <URLTable tableData={data} error={error} />
            </div>
        </AdminLayout>
    )
}
