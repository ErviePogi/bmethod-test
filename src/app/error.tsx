"use client";

import { Header, Footer } from "@/components";
import { MESSAGES } from "@/lib/messages";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-error/80 to-error px-6 py-8 text-center">
              <p className="text-9xl font-bold text-white/90 mb-2">500</p>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {MESSAGES.PAGE.ERROR}
              </h2>
              <p className="text-gray-500 mb-8">{MESSAGES.DESCRIPTION.ERROR}</p>

              <button
                onClick={() => reset()}
                className="w-full py-4 rounded-xl font-bold text-lg bg-accent hover:bg-accent-dark text-primary-dark transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/30"
              >
                {MESSAGES.ACTION.RETRY}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
