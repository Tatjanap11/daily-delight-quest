
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
      className="text-sm bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-200"
      disabled={disabled}
    >
      <Lightbulb className="w-4 h-4 mr-2" />
      {showHint ? 'Hide' : 'Show'} Hint
    </Button>
    {showHint && (
      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 mt-2">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <p className="font-medium text-purple-300 mb-1">Hint:</p>
            <p className="text-purple-200">{hint}</p>
          </div>
        </div>
      </div>
    )}
  </>
);

export default HintToggle;
