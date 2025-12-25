function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-6 animate-fadeIn">
        
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="ReportIT"
          className="h-20 w-auto animate-logoPulse drop-shadow-2xl"
        />

        {/* Loading text */}
        <div className="flex items-center gap-2 text-white text-lg tracking-wide">
          <span>Loading</span>
          <span className="flex gap-1">
            <span className="animate-dot">.</span>
            <span className="animate-dot delay-200">.</span>
            <span className="animate-dot delay-400">.</span>
          </span>
        </div>

      </div>
    </div>
  );
}

export default PageLoader;
