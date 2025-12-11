// アプリケーション全体で使用する定数定義

// =====================
// 外部URL
// =====================
export const URLS = {
  // アセットベースURL
  ASSET_BASE: "https://fp.vpay.global",

  // 画像
  ICON: "https://fp.vpay.global/img/vp.png",
  LOGO_DESKTOP: "https://fp.vpay.global/asset/img/logo01.png",
  LOGO_MOBILE: "https://fp.vpay.global/asset/img/header-mobile-view-2.png",
  LOGO_FOOTER: "https://fp.vpay.global/asset/img/logo02.png",
  HEADER_CARD: "https://fp.vpay.global/asset/img/header-card-new.png",
  STEP_IMAGE_DESKTOP: "https://fp.vpay.global/asset/img/vp-step1.png",
  STEP_IMAGE_MOBILE: "https://fp.vpay.global/asset/img/vp-mob-step1.png",

  // ドキュメント
  TERMS_OF_SERVICE: "https://fp.vpay.global/asset/file/vp_terms_of_service.pdf",

  // 外部リンク
  COMPANY_HOME: "https://vpay.global",
} as const;

// =====================
// バリデーション
// =====================
export const VALIDATION = {
  // 電話番号
  PHONE: {
    DIGIT_LENGTH: 11,
    MOBILE_PREFIX_PATTERN: /^0[789]0/,
    PLACEHOLDER: "090-1234-5678",
    // マスク表示用のインデックス
    MASK_START_INDEX: 3,
    MASK_END_INDEX: 7,
  },

  // 認証コード
  VERIFICATION_CODE: {
    LENGTH: 6,
    PATTERN: /^\d{6}$/,
    PLACEHOLDER: "123456",
  },
} as const;

// =====================
// セッション・Cookie設定
// =====================
export const SESSION = {
  COOKIE_NAME: "session_phone",
  COOKIE_NAME_SMS_SESSION: "sms_session_id",
  MAX_AGE_SECONDS: 60 * 10, // 10分
  SAME_SITE: "strict" as const,
  PATH: "/",
} as const;

// =====================
// API設定
// =====================
export const API = {
  // 決済設定
  PAYMENT: {
    METHOD: "ONE_TIME",
    SELECTION: "DIRECT",
    CURRENCY: "JPY",
  },

  // 言語設定
  LANGUAGE: "ja",
} as const;

