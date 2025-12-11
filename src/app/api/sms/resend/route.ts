import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { SESSION } from "@/lib/constants";
import { MESSAGES } from "@/lib/messages";

const API_BASE_URL = process.env.API_BASE_URL;
const VPAY_API_KEY = process.env.VPAY_API_KEY;

export async function POST() {
  try {
    // CookieからセッションIDを取得
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION.COOKIE_NAME_SMS_SESSION)?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.SESSION_EXPIRED },
        { status: 400 }
      );
    }

    // クライアントIPアドレスを取得
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip_address = forwarded?.split(",")[0]?.trim() || "unknown";

    // VpayAPI で再送信
    const response = await fetch(
      `${API_BASE_URL}/api/v1/sms-sessions/${sessionId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VPAY_API_KEY}`,
        },
        body: JSON.stringify({ action: "resend", ip_address }),
      }
    );

    const data = await response.json();
    const results = data.results || data;

    if (!response.ok) {
      if (results.error === "TOO_MANY_REQUESTS") {
        return NextResponse.json(
          {
            error: MESSAGES.ERROR.TOO_MANY_REQUESTS,
            retry_after: results.retry_after,
          },
          { status: 429 }
        );
      }
      if (
        results.error === "SESSION_EXPIRED" ||
        results.error === "SESSION_NOT_FOUND"
      ) {
        return NextResponse.json(
          { error: MESSAGES.ERROR.SESSION_EXPIRED },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: results.message || data.msg },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.SMS_RESEND_FAILED },
      { status: 500 }
    );
  }
}
