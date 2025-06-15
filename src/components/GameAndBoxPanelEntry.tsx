
import React from "react";
import GameAndBoxPanel from "@/components/GameAndBoxPanel";

interface GameAndBoxPanelEntryProps {
  onPuzzleComplete: (points: number) => void;
  puzzleCompleted: boolean;
  userLevel: number;
  onBoxOpened: () => void;
  practiceModeLocked: boolean;
}

const GameAndBoxPanelEntry: React.FC<GameAndBoxPanelEntryProps> = (props) => {
  // Diagnostic console log
  console.log("GameAndBoxPanelEntry props", props);

  return (
    <div data-testid="game-panel-entry">
      <GameAndBoxPanel
        onPuzzleComplete={props.onPuzzleComplete}
        puzzleCompleted={props.puzzleCompleted}
        userLevel={props.userLevel}
        onBoxOpened={props.onBoxOpened}
        practiceModeLocked={props.practiceModeLocked}
      />
    </div>
  );
};

export default GameAndBoxPanelEntry;
