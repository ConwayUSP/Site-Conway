export default function InfoCircleIcon({ color = "#FFD60A", size = 56, title, style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      style={{ color, ...style }}
      {...props}
    >
      {title && <title>{title}</title>}
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M12 6.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0 -3Zm-1 5h1a1 1 0 0 1 1 1v4h.5a1 1 0 1 1 0 2H11a1 1 0 1 1 0 -2h.5v-3H11a1 1 0 1 1 0 -2Z"
        fill="#171717"
      />
    </svg>
  );
}
