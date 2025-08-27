import React, { memo } from "react";
import { Progress } from "@/components/ui/progress";

interface OptimizedProgressProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export const OptimizedProgress = memo(({ value, className, style }: OptimizedProgressProps) => {
  return (
    <Progress 
      value={value} 
      className={className}
      style={style}
    />
  );
});

OptimizedProgress.displayName = "OptimizedProgress";