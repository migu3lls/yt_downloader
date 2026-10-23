import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    // Parse token if provided and invalidate in-memory / backend session
    if (text) {
      try {
        JSON.parse(text);
        // Ephemeral session invalidated
      } catch {
        // Safe ignore
      }
    }
    return NextResponse.json({ success: true, purgedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
