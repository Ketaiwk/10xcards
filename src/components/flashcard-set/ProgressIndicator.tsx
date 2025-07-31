import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  status: string;
}

export function ProgressIndicator({ progress, status }: ProgressIndicatorProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-2">
      <Progress
        value={displayProgress}
        className="w-full transition-all duration-500 ease-in-out dark:bg-slate-800"
        aria-label="Postęp generowania"
        role="progressbar"
        aria-valuenow={displayProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <p className="text-sm text-muted-foreground text-center animate-pulse" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
