import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { SESSION } from "@/lib/constants";
import { MESSAGES } from "@/lib/messages";

const API_BASE_URL = process.env.API_BASE_URL;
const VPAY_API_KEY = process.env.VPAY_API_KEY;

type SendSmsRequest = {
  phone_number: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: SendSmsRequest = await request.json();
    const { phone_number } = body;

    if (!phone_number) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.PHONE_REQUIRED },
        { status: 400 }
      );
    }

    // クライアントIPアドレスを取得
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip_address = forwarded?.split(",")[0]?.trim() || "unknown";

    // VpayAPI でセッション作成
    const response = await fetch(`${API_BASE_URL}/api/v1/sms-sessions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VPAY_API_KEY}`,
      },
      body: JSON.stringify({ phone_number, ip_address }),
    });

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
      if (results.error === "INVALID_PHONE") {
        return NextResponse.json(
          { error: MESSAGES.VALIDATION.PHONE_INVALID },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: results.message || data.msg },
        { status: response.status }
      );
    }

    // セッションIDをCookieに保存
    const cookieStore = await cookies();
    cookieStore.set(SESSION.COOKIE_NAME_SMS_SESSION, results.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: SESSION.SAME_SITE,
      maxAge: SESSION.MAX_AGE_SECONDS,
      path: SESSION.PATH,
    });

    // 電話番号もCookieに保存（表示用）
    cookieStore.set(SESSION.COOKIE_NAME, phone_number, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: SESSION.SAME_SITE,
      maxAge: SESSION.MAX_AGE_SECONDS,
      path: SESSION.PATH,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.SMS_SEND_FAILED },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get(SESSION.COOKIE_NAME)?.value;
    const sessionId = cookieStore.get(SESSION.COOKIE_NAME_SMS_SESSION)?.value;

    if (!phoneNumber || !sessionId) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.SESSION_NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json({ phoneNumber });
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.SESSION_GET_FAILED },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION.COOKIE_NAME_SMS_SESSION)?.value;

    // VpayAPI側のセッションも削除
    if (sessionId) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/sms-sessions/${sessionId}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${VPAY_API_KEY}` },
        });
      } catch {
        // 削除失敗しても続行（既に期限切れの可能性）
      }
    }

    // Cookieをクリア
    cookieStore.delete(SESSION.COOKIE_NAME_SMS_SESSION);
    cookieStore.delete(SESSION.COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.SESSION_DELETE_FAILED },
      { status: 500 }
    );
  }
}
