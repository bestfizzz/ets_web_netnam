import TemplateGenerator from "@/components/customize/template-generator"

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
  const { uuid } = await params

  // ✅ Pass your uuid to fetchTemplate if needed
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
