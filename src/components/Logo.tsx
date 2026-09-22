import logo from "@/assets/ss-logo.jpg.asset.json";

export function Logo({
  size = 40,
  showText = true,
  tone = "default",
}: {
  size?: number;
  showText?: boolean;
  tone?: "default" | "inverted";
}) {
  return (
    <span className="flex items-center gap-3">
      <img
        src={logo.url}
        alt="S&S Business Solutions logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-lg object-contain"
      />
      {showText && (
        <span className="leading-tight">
          <span
            className={`block font-sans text-sm font-semibold sm:text-base ${
              tone === "inverted" ? "text-background" : "text-foreground"
            }`}
          >
            S&amp;S Business Solutions
          </span>
          <span
            className={`block text-[11px] ${
              tone === "inverted" ? "text-background/70" : "text-muted-foreground"
            }`}
          >
            Build. Brand. Digitize. Grow.
          </span>
        </span>
      )}
    </span>
  );
}
