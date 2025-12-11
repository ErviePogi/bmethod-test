// プランコード → 金額のマッピング
// キーは12文字のランダムな16進数文字列
export const PLANS: Record<string, number> = {
  // テスト用
  "9f933c930f9f": 250,
  b1a29d9f0675: 500,
  f5283b0b5e39: 750,
  // 本番用
  "93f27b59d05a": 1000,
  "4fbf0da3ecc2": 5000,
  c150076d98a1: 10000,
  "2500e0697a20": 20000,
  "9f198cc12a2e": 30000,
  b47eaa617e64: 50000,
  "5c77867b182e": 100000,
  c759a11b7b95: 150000,
  b4fb0353fab5: 200000,
  f42286e2c699: 250000,
  ec4a19134e25: 300000,
};

// プランコードから金額を取得（無効な場合はnull）
export function getAmountByPlanCode(planCode: string | null): number | null {
  if (!planCode) return null;
  return PLANS[planCode] ?? null;
}
