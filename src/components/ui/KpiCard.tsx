interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  valueColor?: "default" | "green" | "red" | "amber";
}

const valueColorStyles: Record<string, string> = {
  default: "text-muted",
  green: "text-success",
  red: "text-danger",
  amber: "text-brand",
};

const deltaColorStyles: Record<string, string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-text-secondary",
};

export function KpiCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  valueColor = "default",
}: KpiCardProps) {
  return (
    <div className="bg-bg-card rounded-xl border border-border-strong p-4">
      <p className="text-[13.5px] text-text-secondary uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <p className={`text-2xl font-medium ${valueColorStyles[valueColor]}`}>
        {value}
      </p>
      {delta && (
        <p className={`text-[12px] mt-1 ${deltaColorStyles[deltaType]}`}>{delta}</p>
      )}
    </div>
  );
}
