import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target } from "lucide-react";

interface CompoundGrowthCounterProps {
  initialValue?: number;
  dailyImprovement?: number;
  days?: number;
  animated?: boolean;
  className?: string;
}

export const CompoundGrowthCounter: React.FC<CompoundGrowthCounterProps> = ({
  initialValue = 1,
  dailyImprovement = 0.01, // 1% = 0.01
  days = 365,
  animated = true,
  className = ""
}) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [currentValue, setCurrentValue] = useState(initialValue);

  const finalValue = Math.pow(1 + dailyImprovement, days);
  const improvement = ((finalValue - 1) * 100).toFixed(0);

  useEffect(() => {
    if (!animated) {
      setCurrentDay(days);
      setCurrentValue(finalValue);
      return;
    }

    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= days) {
          clearInterval(interval);
          return days;
        }
        
        const newDay = prev + 1;
        const newValue = Math.pow(1 + dailyImprovement, newDay);
        setCurrentValue(newValue);
        
        return newDay;
      });
    }, 20); // Fast animation

    return () => clearInterval(interval);
  }, [animated, days, dailyImprovement, finalValue]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Crescimento Exponencial</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {(dailyImprovement * 100).toFixed(1)}% ao dia
            </Badge>
          </div>

          {/* Main counter */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">
              {currentValue.toFixed(2)}x
            </div>
            <p className="text-sm text-muted-foreground">
              melhor que no início
            </p>
          </div>

          {/* Progress indicators */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{currentDay}</div>
                <div className="text-xs text-muted-foreground">dias</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-green-600">
                  +{improvement}%
                </div>
                <div className="text-xs text-muted-foreground">melhoria total</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentDay / days) * 100}%` }}
            />
          </div>

          {/* Explanation */}
          {currentDay >= days && (
            <div className="text-center text-xs text-muted-foreground animate-fade-in">
              <p>
                Melhorando apenas <strong>{(dailyImprovement * 100).toFixed(1)}%</strong> por dia,
                você fica <strong>{improvement}%</strong> melhor em um ano!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompoundGrowthCounter;