import { NextRequest, NextResponse } from "next/server";
import { insertWaitlistEntry, getWaitlistCount } from "@/lib/db";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // --- Validation ---
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

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = email.trim().toLowerCase();

    // --- Database insert ---
    const result = await insertWaitlistEntry(cleanName, cleanEmail);

    if (!result.inserted) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    // --- Get total count ---
    const count = await getWaitlistCount();

    // --- Log to stdout (visible in Vercel function logs) ---
    console.log(
      `[waitlist] New signup: ${cleanEmail} (${cleanName || "no name"}) - total: ${count}`
    );

    // --- Send emails (fire-and-forget, errors don't block the response) ---
    void Promise.allSettled([
      sendAdminNotification(cleanName, cleanEmail),
      sendUserConfirmation(cleanName, cleanEmail),
    ]);

    return NextResponse.json(
      { message: "Successfully joined the waitlist.", count },
      { status: 201 }
    );
  } catch (err) {
    console.error("[waitlist] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[waitlist] Count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
