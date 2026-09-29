/** علامة محطة على مسار التحليق. نقطتها تلتقطها <FlightPath> لترسم المسار عبرها. */
export function Waypoint({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative z-10 flex items-center gap-3 text-[15px] font-medium text-gilt ${className}`}
    >
      <span
        data-waypoint-dot
        aria-hidden
        className="block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gilt bg-night"
      />
      <span>{label}</span>
    </div>
  );
}
