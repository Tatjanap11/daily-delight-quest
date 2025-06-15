
import React from "react";
import { AlertCircle } from "lucide-react";

interface AttemptsTrackerProps {
  attempts: number;
}

const AttemptsTracker: React.FC<AttemptsTrackerProps> = ({ attempts }) => {
  if (attempts <= 0) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <AlertCircle className="w-4 h-4" />
      {attempts} attempt{attempts !== 1 ? 's' : ''}
    </div>
  );
};

export default AttemptsTracker;
