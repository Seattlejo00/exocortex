import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// On Vercel, use /tmp (ephemeral per invocation) for file storage.
// For production persistence, swap this out for Vercel Postgres, Supabase, or similar.
const DATA_FILE =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "waitlist.json")
    : path.join(process.cwd(), "waitlist.json");

interface WaitlistEntry {
  name: string;
  email: string;
  timestamp: string;
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const entries = await readWaitlist();

    if (entries.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    const newEntry: WaitlistEntry = {
      name: typeof name === "string" ? name.trim() : "",
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
    };

    entries.push(newEntry);
    await writeWaitlist(entries);

    // Log to stdout so signups appear in Vercel function logs
    console.log(`[waitlist] New signup: ${newEntry.email} (${newEntry.name || "no name"})`);

    return NextResponse.json(
      { message: "Successfully joined the waitlist.", count: entries.length },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const entries = await readWaitlist();
  return NextResponse.json({ count: entries.length });
}
