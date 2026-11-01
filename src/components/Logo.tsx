type Props = { variant?: "dark" | "light"; size?: number };

export function LogoMark({ variant = "dark", size = 44 }: Props) {
  const circle = variant === "dark" ? "#0F2A24" : "#FFFFFF";
  const panel = variant === "dark" ? "#FFFFFF" : "#0F2A24";
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="22" fill={circle} />
      <circle cx="22" cy="19" r="7" fill="#F5B301" />
      <path d="M10 33h24l-3-7H13z" fill={panel} />
      <path
        d="M16 26l-1.5 7M22 26v7M28 26l1.5 7M11.5 29.5h21"
        stroke={circle}
        strokeWidth="1.2"
      />
    </svg>
  );
}
