function StaticPage({ title, subtitle, Icon, gradient, aside, children }) {
  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-sm bg-gradient-to-r ${gradient} px-6 py-10 text-white shadow-sm md:px-12 md:py-14`}>
        <Icon className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-white/10 md:h-56 md:w-56" />
        <div className="relative flex items-center gap-4 md:gap-6">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 md:flex">
            <Icon className="h-7 w-7 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${aside ? "md:grid-cols-3" : ""}`}>
        <div
          className={`rounded-sm bg-white p-6 shadow-sm md:p-8 ${aside ? "md:col-span-2" : ""} space-y-5 text-sm leading-relaxed text-gray-700 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:first:mt-0 [&_li]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5`}
        >
          {children}
        </div>
        {aside && <div className="space-y-4">{aside}</div>}
      </div>
    </div>
  );
}

export default StaticPage;
