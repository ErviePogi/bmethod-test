import { notFound } from "next/navigation";
import { getAmountByPlanCode } from "@/lib/plans";
import VerifyPageClient from "./VerifyPageClient";

type Props = {
  params: Promise<{ planCode: string }>;
};

export default async function VerifyPage({ params }: Props) {
  const { planCode } = await params;

  // サーバーサイドでプランコードを検証
  const amount = getAmountByPlanCode(planCode);
  if (!amount) {
    notFound();
  }

  return <VerifyPageClient planCode={planCode} amount={amount} />;
}
