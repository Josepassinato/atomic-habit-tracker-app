
import React from "react";
import { Progress } from "@/components/ui/progress";
import { HabitsStatsProps } from "./types";

const HabitsStats: React.FC<HabitsStatsProps> = ({
  habits,
  completedHabits,
  verifiedHabits,
  progress,
  animateProgress
}) => {
  return (
    <>
      <div>
        Today's progress: {completedHabits} habits of {habits.length} habits
        {verifiedHabits > 0 && (
          <span className="text-green-600 ml-1">
            ({verifiedHabits} verified)
          </span>
        )}
      </div>
      <Progress 
        value={progress} 
        className={`h-2 transition-all duration-700 ${animateProgress ? 'scale-y-150' : ''}`} 
      />
    </>
  );
};

export default HabitsStats;
