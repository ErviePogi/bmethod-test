import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { SESSION } from "@/lib/constants";
import { MESSAGES } from "@/lib/messages";

const API_BASE_URL = process.env.API_BASE_URL;
const VPAY_API_KEY = process.env.VPAY_API_KEY;

type VerifyRequest = {
  code: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: MESSAGES.VALIDATION.CODE_REQUIRED },
        { status: 400 }
      );
    }

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

    // VpayAPI で検証
    const response = await fetch(
      `${API_BASE_URL}/api/v1/sms-sessions/${sessionId}/verify/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VPAY_API_KEY}`,
        },
        body: JSON.stringify({ code, ip_address }),
      }
    );

    const data = await response.json();
    const results = data.results || data;

    if (!response.ok) {
      if (results.error === "INVALID_CODE") {
        return NextResponse.json(
          {
            error: MESSAGES.ERROR.CODE_INVALID,
            remaining_attempts: results.remaining_attempts,
          },
          { status: 400 }
        );
      }
      if (results.error === "TOO_MANY_ATTEMPTS") {
        // セッションをクリア
        cookieStore.delete(SESSION.COOKIE_NAME_SMS_SESSION);
        cookieStore.delete(SESSION.COOKIE_NAME);

        return NextResponse.json(
          { error: MESSAGES.ERROR.TOO_MANY_ATTEMPTS },
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

    if (results.verified) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: MESSAGES.ERROR.CODE_INVALID },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.AUTH_FAILED },
      { status: 500 }
    );
  }
}
