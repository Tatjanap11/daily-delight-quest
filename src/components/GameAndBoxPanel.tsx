
import React from "react";
import PuzzleGame from "@/components/PuzzleGame";
import SurpriseBox from "@/components/SurpriseBox";

interface GameAndBoxPanelProps {
  onPuzzleComplete: (points: number) => void;
  puzzleCompleted: boolean;
  userLevel: number;
  onBoxOpened: () => void;
  practiceModeLocked: boolean;
}

const GameAndBoxPanel: React.FC<GameAndBoxPanelProps> = ({
  onPuzzleComplete,
  puzzleCompleted,
  userLevel,
  onBoxOpened,
  practiceModeLocked,
}) => (
  <div className="grid gap-8 lg:grid-cols-2">
    <PuzzleGame
      onComplete={onPuzzleComplete}
      completed={puzzleCompleted}
      userLevel={userLevel}
      practiceModeLocked={practiceModeLocked}
    />
    <SurpriseBox
      canOpen={puzzleCompleted}
      onBoxOpened={onBoxOpened}
      userLevel={userLevel}
    />
  </div>
);

export default GameAndBoxPanel;
