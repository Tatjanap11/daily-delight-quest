
import React from "react";

interface PracticeLimitNoticeProps {
  exitToDaily: () => void;
}

const PracticeLimitNotice: React.FC<PracticeLimitNoticeProps> = ({ exitToDaily }) => (
  <div className="flex flex-col gap-6">
    <div className="bg-pink-900/60 text-pink-200 rounded-lg p-5 border border-pink-500 text-lg text-center font-semibold shadow-lg">
      🚫 You have reached your practice problem limit for today. Come back tomorrow for more!
    </div>
    <div className="flex justify-center">
      <button
        onClick={exitToDaily}
        className="bg-gradient-to-r from-blue-700 to-cyan-700 px-6 py-2 rounded text-lg text-white shadow hover:from-blue-800 hover:to-cyan-800 transition font-bold"
      >
        Exit to Today's Challenge
      </button>
    </div>
  </div>
);

export default PracticeLimitNotice;
