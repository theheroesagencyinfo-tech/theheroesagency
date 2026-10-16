export function ProgressBar({ value }: { value: number }) {
  return <div>
    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-semibold">{value}%</span></div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress" className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${value}%` }} />
    </div>
  </div>;
}
