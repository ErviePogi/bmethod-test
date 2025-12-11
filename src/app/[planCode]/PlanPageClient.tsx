"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Header, Footer, StepIndicator } from "@/components";
import { MESSAGES } from "@/lib/messages";
import { URLS, VALIDATION } from "@/lib/constants";

type FormData = {
  phoneNumber: string;
  agreed: boolean;
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

const validatePhoneNumber = (value: string): string | true => {
  if (!value) {
    return MESSAGES.VALIDATION.PHONE_REQUIRED;
  }

  const digits = value.replace(/[-\s]/g, "");
  if (!VALIDATION.PHONE.MOBILE_PREFIX_PATTERN.test(digits)) {
    return MESSAGES.VALIDATION.PHONE_MOBILE_ONLY;
  }

  if (!isValidPhoneNumber(value, "JP")) {
    return MESSAGES.VALIDATION.PHONE_INVALID;
  }

  return true;
};

export default function PlanPageClient({ planCode, amount }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      phoneNumber: "",
      agreed: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setSubmitError("");
    setIsLoading(true);

    try {
      // セッション作成（認証コード生成 + SMS送信も行う）
      const sessionResponse = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: data.phoneNumber }),
      });

      if (!sessionResponse.ok) {
        throw new Error(MESSAGES.ERROR.SESSION_CREATE_FAILED);
      }

      router.push(`/${planCode}/verify`);
    } catch {
      setSubmitError(MESSAGES.ERROR.SMS_SEND_FAILED);
      setIsLoading(false);
    }
  };

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
              <StepIndicator currentStep={1} steps={STEPS} />
            </div>

            {/* Form Section */}
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                {MESSAGES.PAGE.SMS_AUTH}
              </h2>
              <p className="text-gray-500 text-sm text-center mb-8">
                {MESSAGES.DESCRIPTION.SMS_AUTH}
                <br />
                {MESSAGES.DESCRIPTION.ENTER_PHONE}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Phone Input */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    携帯電話番号
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder={VALIDATION.PHONE.PLACEHOLDER}
                    className={`
                      w-full px-4 py-3 text-center text-lg
                      border-2 rounded-xl transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-accent/50
                      ${
                        errors.phoneNumber
                          ? "border-error focus:border-error"
                          : "border-gray-200 focus:border-accent"
                      }
                    `}
                    {...register("phoneNumber", {
                      validate: validatePhoneNumber,
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-error font-medium">
                      {errors.phoneNumber.message}
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

                {/* Terms */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    {MESSAGES.MISC.TERMS_NOTICE}
                    <a
                      href={URLS.TERMS_OF_SERVICE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-light underline"
                    >
                      {MESSAGES.MISC.TERMS_LINK}
                    </a>
                    {MESSAGES.MISC.TERMS_CONFIRM}
                  </p>
                  <label className="inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("agreed", { required: true })}
                    />
                    <div
                      className={`
                        w-5 h-5 border-2 rounded mr-2 flex items-center justify-center
                        transition-all duration-200
                        peer-checked:bg-accent peer-checked:border-accent
                        ${watch("agreed") ? "border-accent" : "border-gray-300"}
                      `}
                    >
                      {watch("agreed") && (
                        <svg
                          className="w-3 h-3 text-primary-dark"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-accent group-hover:text-accent-dark">
                      {MESSAGES.MISC.TERMS_AGREE}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!watch("agreed") || isLoading}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg
                    transition-all duration-300 transform
                    ${
                      watch("agreed") && !isLoading
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
                      {MESSAGES.ACTION.SENDING}
                    </span>
                  ) : (
                    MESSAGES.ACTION.SEND_CODE
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
