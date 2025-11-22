import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getHighScores, clearHighScores, getGradeColor, type HighScoreEntry } from "@/lib/gameScoring";
import { Trophy, Trash2 } from "lucide-react";
import { useState } from "react";

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LeaderboardDialog({ open, onOpenChange }: LeaderboardDialogProps) {
  const [scores, setScores] = useState<HighScoreEntry[]>(getHighScores());

  const handleClearScores = () => {
    if (confirm("Are you sure you want to clear all high scores? This cannot be undone.")) {
      clearHighScores();
      setScores([]);
    }
  };

  const refreshScores = () => {
    setScores(getHighScores());
  };

  // Refresh scores when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      refreshScores();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-2 border-primary/70">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            High Scores
            <Trophy className="w-8 h-8" />
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center text-base">
            Top 10 Greatest Captains
          </DialogDescription>
        </DialogHeader>

        <div className="status-panel">
          {scores.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No high scores yet</p>
              <p className="text-sm">Be the first to make history!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-[3rem_1fr_auto_6rem_8rem] gap-3 pb-2 border-b-2 border-primary/50 text-xs uppercase tracking-wider text-muted-foreground font-bold">
                <div className="text-center">Rank</div>
                <div>Captain</div>
                <div className="text-right">Score</div>
                <div className="text-center">Grade</div>
                <div className="text-right">Date</div>
              </div>

              {/* Scores */}
              {scores.map((entry, index) => {
                const gradeColor = getGradeColor(entry.grade);
                const isTopThree = index < 3;

                return (
                  <div
                    key={`${entry.timestamp}-${index}`}
                    className={`grid grid-cols-[3rem_1fr_auto_6rem_8rem] gap-3 py-3 border-b border-primary/20 last:border-0 items-center ${
                      isTopThree ? "bg-primary/10" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="text-center font-bold text-lg">
                      {index === 0 && (
                        <span className="text-2xl" style={{ color: "oklch(0.85 0.25 60)" }}>
                          🥇
                        </span>
                      )}
                      {index === 1 && (
                        <span className="text-2xl" style={{ color: "oklch(0.7 0.2 30)" }}>
                          🥈
                        </span>
                      )}
                      {index === 2 && (
                        <span className="text-2xl" style={{ color: "oklch(0.65 0.15 40)" }}>
                          🥉
                        </span>
                      )}
                      {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                    </div>

                    {/* Name */}
                    <div className="font-bold text-foreground text-lg font-mono tracking-wider">
                      {entry.name}
                    </div>

                    {/* Score */}
                    <div className="text-primary font-bold text-lg tabular-nums">
                      {entry.score.toLocaleString()}
                    </div>

                    {/* Grade */}
                    <div className="text-center">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: gradeColor, textShadow: `0 0 8px ${gradeColor}` }}
                      >
                        {entry.grade}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-muted-foreground text-sm text-right tabular-nums">
                      {entry.date}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-4">
          <Button
            onClick={handleClearScores}
            variant="outline"
            className="bg-destructive/10 border-destructive/50 text-destructive hover:bg-destructive/30 hover:border-destructive"
            disabled={scores.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Scores
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 hover:border-primary"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
