import TemplateGenerator from "@/components/customize/template-generator"

export async function checkGallery(uuid: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/check-url/${uuid}`)
    if (!res.ok) return false
    const data = await res.json()
    return data.active ?? false
  } catch (err) {
    console.error("Check URL failed:", err)
    return false
  }
}

async function fetchTemplate(id: string): Promise<any> {
    id = 'srch_b47d92aa'
  const res = await fetch(
    `${process.env.URL}/api/customize/get-template?id=${id}&pageType=search`
  )
  if (!res.ok) throw new Error("Template not found")
  const json = await res.json()
  return json.data
}

// ✅ default export comes last and should not use `async default`
export default async function SearchPage({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = params

  // ✅ First check if the gallery is valid
  const isValid = await checkGallery(uuid)

  if (!isValid) {
    // Invalid UUID: show 404 / not found page
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested gallery does not exist or has been deactivated.
        </p>
      </div>
    )
  }

  // ✅ Only fetch template if UUID is valid
  const templateData = await fetchTemplate(uuid)

  return (
    <TemplateGenerator
      content={templateData.data.content}
      settings={templateData.data.settings}
      pageName={templateData.pageType}
      uuid={uuid}
    />
  )
}
