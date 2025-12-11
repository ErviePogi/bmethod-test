import { NextRequest, NextResponse } from "next/server";
import { getAmountByPlanCode } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planCode } = body;

    if (!planCode || typeof planCode !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const amount = getAmountByPlanCode(planCode);

    if (!amount) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
