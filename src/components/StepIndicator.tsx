type Step = {
  number: number;
  label: string;
};

type Props = {
  currentStep: number;
  steps: Step[];
};

export function StepIndicator({ currentStep, steps }: Props) {
  return (
    <div className="w-full">
      {/* Steps Container */}
      <div className="flex justify-between items-start relative">
        {/* Connector Lines - 絶対配置で円の中心を結ぶ */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 flex justify-center px-8 sm:px-12">
          <div className="flex-1 flex">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={`line-${index}`}
                className={`
                  flex-1 h-0.5 transition-all duration-300
                  ${step.number < currentStep ? "bg-success" : "bg-gray-200"}
                `}
              />
            ))}
          </div>
        </div>

        {/* Step Items */}
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center flex-1 relative z-10"
          >
            {/* Circle */}
            <div
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                text-sm sm:text-base font-semibold transition-all duration-300
                ${
                  step.number === currentStep
                    ? "bg-accent text-primary-dark shadow-lg shadow-accent/30"
                    : step.number < currentStep
                      ? "bg-success text-white"
                      : "bg-gray-200 text-gray-400"
                }
              `}
            >
              {step.number < currentStep ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>

            {/* Label */}
            <span
              className={`
                mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap
                ${
                  step.number === currentStep
                    ? "text-accent"
                    : step.number < currentStep
                      ? "text-success"
                      : "text-gray-400"
                }
              `}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
