import { MESSAGES } from "@/lib/messages";

export function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-primary-light/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center">
            Copyright © {new Date().getFullYear()} All Rights Reserved.
          </p>

          {/* Store Name */}
          <p className="text-xs text-gray-500">{MESSAGES.STORE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
