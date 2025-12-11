# TODO

UI フローの順に記載

## 1. 電話番号入力ページ UI ✅

- **ファイル**: `src/app/[planCode]/page.tsx`
- **内容**: 電話番号入力フォーム、利用規約同意チェック、認証コード送信ボタン
- **状態**: 完了

## 2. SMS 認証コード入力ページ UI ✅

- **ファイル**: `src/app/[planCode]/verify/page.tsx`
- **内容**: 6 桁認証コード入力、再送信ボタン、電話番号マスク表示
- **状態**: 完了

## 3. 決済セッション生成 API ✅

- **ファイル**: `src/app/api/ec-session/route.ts`
- **内容**: 認証成功後、決済セッションを生成
- **エンドポイント**: `POST /api/v1/ec_sessions/`（サーバーサイドで認証）
- **状態**: 完了

## 4. SMS 送信 API ✅

- **ファイル**: `src/app/api/sms/route.ts`
- **内容**: 電話番号入力後、VpayAPI 経由で SMS を送信
- **エンドポイント**: `POST /api/sms` → VpayAPI `/api/v1/sms-sessions/`
- **状態**: 完了（VpayAPI移行済み）

## 5. SMS 認証 API ✅

- **ファイル**: `src/app/api/sms/verify/route.ts`
- **内容**: 認証コードを検証する API
- **エンドポイント**: `POST /api/sms/verify` → VpayAPI `/api/v1/sms-sessions/{id}/verify/`
- **状態**: 完了（VpayAPI移行済み）

## 6. SMS 再送信 API ✅

- **ファイル**: `src/app/api/sms/resend/route.ts`
- **内容**: 認証コードを再送信する API
- **エンドポイント**: `POST /api/sms/resend` → VpayAPI `PATCH /api/v1/sms-sessions/{id}/`
- **状態**: 完了（VpayAPI移行済み）

## 7. Toast 通知 ✅

- **ファイル**: `src/app/layout.tsx`, `src/app/[planCode]/verify/VerifyPageClient.tsx`
- **内容**: react-hot-toast による認証成功・再送信成功時の通知
- **状態**: 完了

## 8. エラーメッセージ汎用化 ✅

- **ファイル**: 各 API ルート
- **内容**: console.error 削除、汎用エラーメッセージのみ返却
- **状態**: 完了

---

# セキュリティ改善 TODO

## 9. 認証コード試行回数制限 ✅

- **ファイル**: `src/app/api/sms/verify/route.ts`
- **内容**: ブルートフォース攻撃対策として、認証コードの試行回数を制限する（5回失敗でロック）
- **状態**: 完了

## 10. 認証コード生成のセキュリティ強化 ✅

- **ファイル**: `src/app/api/session/route.ts`, `src/app/api/sms/resend/route.ts`
- **内容**: `Math.random()` を `crypto.randomInt()` に置き換え、暗号学的に安全な乱数生成を使用する
- **状態**: 完了

## 11. Cookie クリアタイミングの改善 ✅

- **ファイル**: `src/app/[planCode]/verify/VerifyPageClient.tsx`
- **内容**: 認証成功後のCookie削除タイミングを見直し。リダイレクト直前に削除することで、リダイレクト失敗時も再認証可能に
- **状態**: 完了

## 12. 試行回数制限のサーバーサイド化 ✅

- **内容**: VpayAPI側でサーバーサイド管理に移行済み
- **実装内容**:
  - VpayDBでセッションごとに試行回数を管理
  - 5回失敗でロックアウト
- **状態**: 完了（VpayAPI移行済み）

## 13. SMS送信APIのレート制限 ✅

- **内容**: VpayAPI側でレート制限を実装済み
- **実装内容**:
  - IPアドレスまたは電話番号あたり：1時間に10回まで
- **状態**: 完了（VpayAPI移行済み）

## 14. SMS再送信APIのレート制限 ✅

- **内容**: VpayAPI側でレート制限を実装済み
- **実装内容**:
  - 再送信間隔：60秒に1回まで
  - 1セッションあたりの再送信上限：3回まで
- **状態**: 完了（VpayAPI移行済み）

## 15. 認証コードの保護強化 ✅

- **内容**: VpayDBでサーバーサイド管理に移行
- **実装内容**:
  - 認証コードはVpayDBに保存、クライアントには一切渡さない
  - フロントエンドはセッションID（UUID）のみをCookieで保持
  - HttpOnly、Secure、SameSite=strict で保護
- **状態**: 完了（VpayAPI移行済み）

## 16. タイミングセーフな文字列比較 ⚠️【優先度：低】

- **ファイル**: VpayAPI側 `api/views/sms_sessions.py`
- **内容**: 認証コードの比較を定数時間で行い、タイミング攻撃を防止
- **対策案**:
  - Python `hmac.compare_digest()` を使用した比較に変更
- **状態**: 未着手（VpayAPI側で対応）
