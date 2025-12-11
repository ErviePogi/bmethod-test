// アプリケーション全体で使用するメッセージ定義

export const MESSAGES = {
  // 店舗情報
  STORE_NAME: "私立ビリオネア高校マネ部！",

  // ページタイトル・見出し
  PAGE: {
    SMS_AUTH: "SMS認証",
    VERIFY_CODE: "認証コード入力",
    NOT_FOUND: "ページが見つかりません",
    ERROR: "エラーが発生しました",
  },

  // 説明文
  DESCRIPTION: {
    SMS_AUTH: "決済を進めるために、SMS認証が必要です。",
    ENTER_PHONE: "携帯電話番号を入力してください。",
    ENTER_CODE: "6桁の認証コードを入力してください。",
    NOT_FOUND: "お探しのページは存在しないか、移動した可能性があります。",
    ERROR: "申し訳ございません。しばらく時間をおいてから再度お試しください。",
  },

  // バリデーションエラー
  VALIDATION: {
    PHONE_REQUIRED: "電話番号を入力してください",
    PHONE_MOBILE_ONLY: "携帯電話番号（070/080/090）を入力してください",
    PHONE_INVALID: "正しい電話番号を入力してください",
    CODE_REQUIRED: "認証コードを入力してください",
    CODE_FORMAT: "認証コードは6桁の数字で入力してください",
  },

  // APIエラー
  ERROR: {
    SESSION_CREATE_FAILED: "セッションの作成に失敗しました",
    SESSION_GET_FAILED: "セッションの取得に失敗しました",
    SESSION_DELETE_FAILED: "セッションの削除に失敗しました",
    SESSION_NOT_FOUND: "セッションが見つかりません",
    SESSION_EXPIRED: "セッションが期限切れです。最初からやり直してください。",
    PHONE_REQUIRED: "電話番号が必要です",
    SMS_SEND_FAILED: "SMS送信に失敗しました。もう一度お試しください。",
    SMS_RESEND_FAILED: "再送信に失敗しました。もう一度お試しください。",
    EC_SESSION_FAILED: "決済セッションの作成に失敗しました",
    AUTH_FAILED: "認証に失敗しました。もう一度お試しください。",
    CODE_INVALID: "認証コードが正しくありません",
    TOO_MANY_ATTEMPTS: "試行回数の上限に達しました。最初からやり直してください。",
    TOO_MANY_REQUESTS: "リクエストが多すぎます。しばらく待ってから再試行してください。",
    TOKEN_AUTH_FAILED: "認証に失敗しました",
    SERVER_CONFIG_INCOMPLETE: "サーバー設定が不完全です",
    INVALID_PLAN_CODE: "無効なプランコードです",
  },

  // ボタン・アクション
  ACTION: {
    SEND_CODE: "認証コードを送信",
    SENDING: "送信中...",
    VERIFY: "認証する",
    VERIFYING: "認証中...",
    RESEND: "再送信",
    RETRY: "再試行",
    BACK_TO_TOP: "トップページへ戻る",
  },

  // その他
  MISC: {
    AUTH_SUCCESS: "認証が完了しました",
    CODE_RESENT: "認証コードを再送信しました",
    TERMS_NOTICE: "決済を始められる前に、こちらの",
    TERMS_LINK: "利用規約",
    TERMS_CONFIRM: "をご確認ください。",
    TERMS_AGREE: "利用規約に同意する",
    CODE_NOT_RECEIVED: "コードが届かない場合は",
    CODE_NOT_RECEIVED_SUFFIX: "してください。",
  },
} as const;
