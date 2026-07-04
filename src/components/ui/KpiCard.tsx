interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  valueColor?: "default" | "green" | "red" | "amber";
}

const valueColorStyles: Record<string, string> = {
  default: "text-zinc-50",
  green: "text-green-400",
  red: "text-red-400",
  amber: "text-amber-500",
};

const deltaColorStyles: Record<string, string> = {
  up: "text-green-400",
  down: "text-red-400",
  neutral: "text-zinc-500",
};

export function KpiCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  valueColor = "default",
}: KpiCardProps) {
  return (
    <div className="bg-zinc-800/60 rounded-xl border border-zinc-700/60 p-4">
      <p className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <p className={`text-2xl font-medium ${valueColorStyles[valueColor]}`}>
        {value}
      </p>
      {delta && (
        <p className={`text-xs mt-1 ${deltaColorStyles[deltaType]}`}>{delta}</p>
      )}
    </div>
  );
}
