import { NextRequest, NextResponse } from "next/server";
import { getAmountByPlanCode } from "@/lib/plans";
import { MESSAGES } from "@/lib/messages";
import { API } from "@/lib/constants";

const API_BASE_URL = process.env.API_BASE_URL;
const API_LOGIN_ID = process.env.API_LOGIN_ID;
const API_PASSWORD = process.env.API_PASSWORD;
const EC_SESSION_STORE_ID = process.env.EC_SESSION_STORE_ID;
const EC_SESSION_SUCCESS_URL = process.env.EC_SESSION_SUCCESS_URL;
const EC_SESSION_FAILED_URL = process.env.EC_SESSION_FAILED_URL;

interface TokenResponse {
  results: {
    access: string;
    refresh: string;
  };
}

interface EcSessionResponse {
  code: number;
  msg: string;
  results: {
    ec_session_id: string;
    payment_url: string;
    token: string;
  };
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login_id: API_LOGIN_ID,
      password: API_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(MESSAGES.ERROR.TOKEN_AUTH_FAILED);
  }

  const data: TokenResponse = await response.json();
  return data.results.access;
}

async function createEcSession(
  accessToken: string,
  amount: number
): Promise<EcSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ec_sessions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      store: Number(EC_SESSION_STORE_ID),
      payment_method: API.PAYMENT.METHOD,
      payment_selection: API.PAYMENT.SELECTION,
      currency_code: API.PAYMENT.CURRENCY,
      amount,
      success_url: EC_SESSION_SUCCESS_URL,
      failed_url: EC_SESSION_FAILED_URL,
      language: API.LANGUAGE,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || MESSAGES.ERROR.EC_SESSION_FAILED);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    // 環境変数のチェック
    if (
      !API_BASE_URL ||
      !API_LOGIN_ID ||
      !API_PASSWORD ||
      !EC_SESSION_STORE_ID ||
      !EC_SESSION_SUCCESS_URL ||
      !EC_SESSION_FAILED_URL
    ) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.SERVER_CONFIG_INCOMPLETE },
        { status: 500 }
      );
    }

    // リクエストボディからプランコードを取得
    const body = await request.json().catch(() => ({}));
    const planCode = body.plan as string | undefined;

    // プランコードから金額を取得（無効な場合はエラー）
    const amount = getAmountByPlanCode(planCode ?? null);
    if (!amount) {
      return NextResponse.json(
        { error: MESSAGES.ERROR.INVALID_PLAN_CODE },
        { status: 400 }
      );
    }

    // アクセストークンを取得
    const accessToken = await getAccessToken();

    // 決済セッションを作成
    const ecSession = await createEcSession(accessToken, amount);

    return NextResponse.json({
      payment_url: ecSession.results.payment_url,
      ec_session_id: ecSession.results.ec_session_id,
    });
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERROR.EC_SESSION_FAILED },
      { status: 500 }
    );
  }
}
