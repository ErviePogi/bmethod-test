import { notFound } from "next/navigation";
import { getAmountByPlanCode } from "@/lib/plans";
import PlanPageClient from "./PlanPageClient";

type Props = {
  params: Promise<{ planCode: string }>;
};

export default async function PlanPage({ params }: Props) {
  const { planCode } = await params;

  // サーバーサイドでプランコードを検証
  const amount = getAmountByPlanCode(planCode);
  if (!amount) {
    notFound();
  }

  return <PlanPageClient planCode={planCode} amount={amount} />;
}
