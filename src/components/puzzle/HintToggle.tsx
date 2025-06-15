
import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface HintToggleProps {
  showHint: boolean;
  setShowHint: (b: boolean) => void;
  disabled: boolean;
  hint: string;
}

const HintToggle: React.FC<HintToggleProps> = ({ showHint, setShowHint, disabled, hint }) => (
  <>
    <Button
      variant="outline"
      onClick={() => setShowHint(!showHint)}
      className={`text-sm text-white border-none rounded-lg bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-900 hover:to-purple-800 shadow ${
        disabled ? "opacity-50" : ""
      }`}
      disabled={disabled}
    >
      <Lightbulb className="w-4 h-4 mr-2" />
      {showHint ? 'Hide' : 'Show'} Hint
    </Button>
    {showHint && (
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-2">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="font-medium text-blue-300 mb-1">Hint:</p>
            <p className="text-blue-200">{hint}</p>
          </div>
        </div>
      </div>
    )}
  </>
);

export default HintToggle;
