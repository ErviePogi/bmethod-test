"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Header, Footer, StepIndicator } from "@/components";
import { MESSAGES } from "@/lib/messages";
import { VALIDATION } from "@/lib/constants";

type FormData = {
  verificationCode: string;
};

type Props = {
  planCode: string;
  amount: number;
};

const STEPS = [
  { number: 1, label: "電話番号入力" },
  { number: 2, label: "認証コード入力" },
  { number: 3, label: "決済" },
];

const formatAmount = (amount: number): string => {
  return `¥${amount.toLocaleString()}`;
};

export default function VerifyPageClient({ planCode, amount }: Props) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    // サーバーサイドセッションから電話番号を取得
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/sms");
        if (!response.ok) {
          // セッションがない場合はプランページにリダイレクト
          router.push(`/${planCode}`);
          return;
        }
        const data = await response.json();
        setPhoneNumber(data.phoneNumber);
      } catch {
        router.push(`/${planCode}`);
      }
    };
    fetchSession();
  }, [router, planCode]);

  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setSubmitError("");
    setIsLoading(true);

    try {
      // SMS認証コードを検証
      const verifyResponse = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: data.verificationCode }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || MESSAGES.ERROR.AUTH_FAILED);
      }

      // 決済セッション生成APIを呼び出す
      const sessionResponse = await fetch("/api/ec-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planCode }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || MESSAGES.ERROR.EC_SESSION_FAILED);
      }

      const sessionData = await sessionResponse.json();

      // Toastを表示してから決済ページへリダイレクト
      toast.success(MESSAGES.MISC.AUTH_SUCCESS);
      setTimeout(async () => {
        // リダイレクト直前にセッションをクリア（リダイレクト失敗時に再認証可能にするため）
        await fetch("/api/sms", { method: "DELETE" });
        window.location.href = sessionData.payment_url;
      }, 1500);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : MESSAGES.ERROR.AUTH_FAILED
      );
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isLoading) return;
    setSubmitError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/sms/resend", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || MESSAGES.ERROR.SMS_RESEND_FAILED);
      }

      toast.success(MESSAGES.MISC.CODE_RESENT);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : MESSAGES.ERROR.SMS_RESEND_FAILED
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 電話番号をマスク表示（例: 090-****-5678）
  const maskedPhoneNumber = (() => {
    if (!phoneNumber) return "";
    const digits = phoneNumber.replace(/[-\s]/g, "");
    if (digits.length !== VALIDATION.PHONE.DIGIT_LENGTH) return phoneNumber;
    return `${digits.slice(0, VALIDATION.PHONE.MASK_START_INDEX)}-****-${digits.slice(VALIDATION.PHONE.MASK_END_INDEX)}`;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Amount Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-8 text-center">
              <p className="text-cyan text-sm font-medium mb-2">お支払い金額</p>
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {formatAmount(amount)}
              </p>
              <p className="text-gray-300 text-sm">{MESSAGES.STORE_NAME}</p>
            </div>

            {/* Step Indicator */}
            <div className="px-6 py-6 border-b border-gray-100">
              <StepIndicator currentStep={2} steps={STEPS} />
            </div>

            {/* Form Section */}
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                {MESSAGES.PAGE.VERIFY_CODE}
              </h2>
              <p className="text-gray-500 text-sm text-center mb-8">
                <span className="text-primary font-semibold">
                  {maskedPhoneNumber}
                </span>{" "}
                に送信された
                <br />
                {MESSAGES.DESCRIPTION.ENTER_CODE}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Code Input */}
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    認証コード
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    placeholder={VALIDATION.VERIFICATION_CODE.PLACEHOLDER}
                    maxLength={VALIDATION.VERIFICATION_CODE.LENGTH}
                    className={`
                      w-full px-4 py-4 text-center text-2xl tracking-[0.5em]
                      border-2 rounded-xl transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-accent/50
                      font-mono
                      ${
                        errors.verificationCode
                          ? "border-error focus:border-error"
                          : "border-gray-200 focus:border-accent"
                      }
                    `}
                    {...register("verificationCode", {
                      required: MESSAGES.VALIDATION.CODE_REQUIRED,
                      pattern: {
                        value: VALIDATION.VERIFICATION_CODE.PATTERN,
                        message: MESSAGES.VALIDATION.CODE_FORMAT,
                      },
                    })}
                  />
                  {errors.verificationCode && (
                    <p className="mt-2 text-sm text-error font-medium">
                      {errors.verificationCode.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
                    <p className="text-sm text-error font-medium text-center">
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg
                    transition-all duration-300 transform
                    ${
                      !isLoading
                        ? "bg-accent hover:bg-accent-dark text-primary-dark hover:scale-[1.02] shadow-lg shadow-accent/30"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {MESSAGES.ACTION.VERIFYING}
                    </span>
                  ) : (
                    MESSAGES.ACTION.VERIFY
                  )}
                </button>
              </form>

              {/* Resend Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  {MESSAGES.MISC.CODE_NOT_RECEIVED}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-primary hover:text-primary-light underline font-medium ml-1 disabled:opacity-50"
                  >
                    {MESSAGES.ACTION.RESEND}
                  </button>
                  {MESSAGES.MISC.CODE_NOT_RECEIVED_SUFFIX}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
