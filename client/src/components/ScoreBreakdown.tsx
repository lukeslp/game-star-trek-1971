import type { GameScore } from "@/lib/gameScoring";
import type { GameState } from "@/types/game";
import { getScoreBreakdown, getGradeColor } from "@/lib/gameScoring";

interface ScoreBreakdownProps {
  score: GameScore;
  state: GameState;
}

export default function ScoreBreakdown({ score, state }: ScoreBreakdownProps) {
  const breakdown = getScoreBreakdown(score, state);
  const gradeColor = getGradeColor(score.grade);

  return (
    <div className="space-y-4">
      {/* Grade Display */}
      <div className="text-center mb-6">
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: gradeColor, textShadow: `0 0 20px ${gradeColor}` }}
        >
          {score.grade}
        </div>
        <div className="text-xl text-foreground font-bold uppercase tracking-wider">
          {score.gradeDescription}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="status-panel">
        <h3 className="text-base font-bold text-primary mb-3 uppercase tracking-wider">
          Score Breakdown
        </h3>
        <div className="space-y-2">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-primary/20 last:border-0">
              <div className="flex-1">
                <div className="text-foreground font-bold text-sm">
                  {item.label}
                </div>
                <div className="text-muted-foreground text-xs">
                  {item.description}
                </div>
              </div>
              <div className="text-primary font-bold text-lg ml-4">
                +{item.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Total Score */}
        <div className="mt-4 pt-4 border-t-2 border-primary/50 flex justify-between items-center">
          <div className="text-foreground font-bold text-lg uppercase tracking-wider">
            Final Score
          </div>
          <div className="text-primary font-bold text-2xl" style={{ textShadow: "0 0 10px currentColor" }}>
            {score.total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
