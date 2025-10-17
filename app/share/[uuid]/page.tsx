import TemplateGenerator from "@/components/customize/template-generator"

async function fetchTemplate(id: string): Promise<any> {
  id = 'shre_ez17l1hq'
  const res = await fetch(
    `${process.env.URL}/api/customize/get-template?id=${id}&pageType=share`
  )

  if (!res.ok) throw new Error("Template not found")
  const json = await res.json()
  return json.data
}

// ✅ default export comes last and should not use `async default`
export default async function SharePage({
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
