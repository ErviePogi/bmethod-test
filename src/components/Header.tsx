export function Header() {
  return (
    <header className="bg-primary-dark border-b border-primary-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4 sm:py-6">
          {/* Card Icons - JCB and MasterCard only */}
          <div className="flex items-center gap-2">
            {/* JCB */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jcb-logomark-img-03.gif"
              alt="JCB"
              className="h-6 sm:h-8 w-auto"
            />

            {/* MasterCard */}
            <div className="bg-white rounded px-1 py-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mc_symbol.svg"
                alt="Mastercard"
                className="h-5 sm:h-7 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
