import TemplateGenerator from "@/components/customize/template-generator"
import { checkGallery } from "@/app/search/[uuid]/page"
async function fetchTemplate(id: string): Promise<any> {
  id = 'shre_ez17l1hq'
  const res = await fetch(
    `${process.env.URL}/api/customize/get-template?id=${id}&pageType=share`
  )

  if (!res.ok) throw new Error("Template not found")
  const json = await res.json()
  return json.data
}

export default async function SharePage({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = await params

  // ✅ Pass your uuid to fetchTemplate if needed
  
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
  const data = await fetchTemplate(uuid)

  return (
    <TemplateGenerator
      content={data.data.content}
      settings={data.data.settings}
      pageName={data.pageType}
      uuid={uuid}
    />
  )
}
