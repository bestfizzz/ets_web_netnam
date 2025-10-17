import { NextResponse, NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/api"

const db =  [
    {
        id: "1",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        name: "Example URL 1",
        userId: "user123",
    },
    {
        id: "2",
        uuid: "550e8400-e29b-41d4-a716-446655440001",
        name: "Example URL 2",
        userId: "user456",
    },
    {
        id: "3",
        uuid: "550e8400-e29b-41d4-a716-446655440002",
        name: "Example URL 3",
        userId: "user789",
    },
    {
        id: "4",
        uuid: "550e8400-e29b-41d4-a716-446655440003",
        name: "Example URL 4",
        userId: "user101",
    },
    {
        id: "5",
        uuid: "550e8400-e29b-41d4-a716-446655440004",
        name: "Example URL 5",
        userId: "user202",
    },
    {
        id: "6",
        uuid: "550e8400-e29b-41d4-a716-446655440005",
        name: "Example URL 6",
        userId: "user303",
    },
    {
        id: "7",
        uuid: "550e8400-e29b-41d4-a716-446655440006",
        name: "Example URL 7",
        userId: "user404",
    },
    {
        id: "8",
        uuid: "550e8400-e29b-41d4-a716-446655440007",
        name: "Example URL 8",
        userId: "user505",
    },
    {
        id: "9",
        uuid: "550e8400-e29b-41d4-a716-446655440008",
        name: "Example URL 9",
        userId: "user606",
    },
    {
        id: "10",
        uuid: "550e8400-e29b-41d4-a716-446655440009",
        name: "Example URL 10",
        userId: "user707",
    },
    {
        id: "11",
        uuid: "550e8400-e29b-41d4-a716-44665544000a",
        name: "Example URL 11",
        userId: "user808",
    },
    {
        id: "12",
        uuid: "550e8400-e29b-41d4-a716-44665544000b",
        name: "Example URL 12",
        userId: "user909",
    },
    {
        id: "13",
        uuid: "550e8400-e29b-41d4-a716-44665544000c",
        name: "Example URL 13",
        userId: "user111",
    },
    {
        id: "14",
        uuid: "550e8400-e29b-41d4-a716-44665544000d",
        name: "Example URL 14",
        userId: "user222",
    },
    {
        id: "15",
        uuid: "550e8400-e29b-41d4-a716-44665544000e",
        name: "Example URL 15",
        userId: "user333",
    },
    {
        id: "16",
        uuid: "550e8400-e29b-41d4-a716-44665544000f",
        name: "Example URL 16",
        userId: "user444",
    },
    {
        id: "17",
        uuid: "550e8400-e29b-41d4-a716-446655440010",
        name: "Example URL 17",
        userId: "user555",
    },
    {
        id: "18",
        uuid: "550e8400-e29b-41d4-a716-446655440011",
        name: "Example URL 18",
        userId: "user666",
    },
    {
        id: "19",
        uuid: "550e8400-e29b-41d4-a716-446655440012",
        name: "Example URL 19",
        userId: "user777",
    },
    {
        id: "20",
        uuid: "550e8400-e29b-41d4-a716-446655440013",
        name: "Example URL 20",
        userId: "user888",
    },
    {
        id: "21",
        uuid: "550e8400-e29b-41d4-a716-446655440014",
        name: "Example URL 21",
        userId: "user999",
    },
    {
        id: "22",
        uuid: "550e8400-e29b-41d4-a716-446655440015",
        name: "Example URL 22",
        userId: "user112",
    },
    {
        id: "23",
        uuid: "550e8400-e29b-41d4-a716-446655440016",
        name: "Example URL 23",
        userId: "user223",
    },
    {
        id: "24",
        uuid: "550e8400-e29b-41d4-a716-446655440017",
        name: "Example URL 24",
        userId: "user334",
    },
    {
        id: "25",
        uuid: "550e8400-e29b-41d4-a716-446655440018",
        name: "Example URL 25",
        userId: "user445",
    },
]

// ---------------- GET ----------------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uuid = searchParams.get("uuid")

    if (uuid) {
      const uuidParam = uuid.trim().toLowerCase()
      console.log("Searching for:", uuidParam)
      
      const urlItem = db.find((x) => {
        const dbUuid = x.uuid.toLowerCase()
        console.log(`Comparing: "${dbUuid}" === "${uuidParam}"`, dbUuid === uuidParam)
        return dbUuid === uuidParam
      })
      
      console.log("Found item:", urlItem)
      
      if (!urlItem) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(urlItem)
    }

    return NextResponse.json([...db].reverse())
  } catch (err) {
    console.error("Failed to fetch URLs:", err)
    return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 })
  }
}

// ---------------- ADD (POST) ----------------
export async function POST(req: Request) {
  try {
    const { data } = await req.json()
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    const newId = (db.length + 1).toString() // simple incremental id
    const newUuid = crypto.randomUUID()
    console.log(data)
    // Ensure social fields exist or default to "none"
    const newUrl = {
      id: newId,
      uuid: newUuid,
      name: data.name,
      userId: userId, // Placeholder user ID
      facebook: data.facebook ?? "none",
      twitter: data.twitter ?? "none",
      linkedin: data.linkedin ?? "none",
      searchTemplate: data.searchTemplate ?? "none",
      shareTemplate: data.shareTemplate ?? "none",
    }
    db.push(newUrl)
    return NextResponse.json(newUrl, { status: 201 })
  } catch (err) {
    console.error("Failed to add URL:", err)
    return NextResponse.json({ error: "Failed to add URL" }, { status: 500 })
  }
}

// ---------------- UPDATE (PUT) ----------------
export async function PUT(req: Request) {
  try {
    const { data } = await req.json()
    const { id } = data

    const index = db.findIndex((url) => url.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 })
    }

    // Update fields, default social fields to "none" if missing
    db[index] = {
      ...db[index],
      name: data.name ?? db[index].name,
      userId: data.userId ?? db[index].userId,
      facebook: data.facebook ?? "none",
      twitter: data.twitter ?? "none",
      linkedin: data.linkedin ?? "none",
      searchTemplate: data.searchTemplate ?? "none",
      shareTemplate: data.shareTemplate ?? "none",
    }

    return NextResponse.json(db[index])
  } catch (err) {
    console.error("Failed to update URL:", err)
    return NextResponse.json({ error: "Failed to update URL" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const index = db.findIndex((url) => url.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 })
    }

    const deleted = db.splice(index, 1)[0]
    return NextResponse.json({ success: true, deleted })
  } catch (err) {
    console.error("Failed to delete URL:", err)
    return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 })
  }
}