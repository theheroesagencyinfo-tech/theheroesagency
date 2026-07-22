interface MetricCellProps {
  value: string;
  label: string;
  align?: "left" | "center";
}

export function MetricCell({ value, label, align = "left" }: MetricCellProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <div className="font-sans-ui text-2xl md:text-3xl font-semibold text-foreground tabular-nums tracking-tight">
        {value}
      </div>
      <div className="mt-1 font-sans-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
