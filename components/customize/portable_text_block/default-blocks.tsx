// ----- default blocks -----
const defaultBlocks: Record<string, any> = {
  Span: { _type: "block", style: "normal", children: [{ _type: "span", text: "" }], markDefs: [] },
  H1: { _type: "block", style: "h1", children: [{ _type: "span", text: "" }], markDefs: [] },
  // feature: { _type: "feature", title: "", description: "" },
  footer: { _type: "footer", text: "" },
  // searchBar: { _type: "searchBar", placeholder: "Search..." },
  // logoBlock: { _type: "logoBlock", leftLogo: "", rightLogo: "" },
}

export default defaultBlocks 