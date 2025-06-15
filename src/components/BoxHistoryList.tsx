
import React, { useEffect, useState } from "react";

interface BoxOpenEntry {
  date: string;
  timestamp: number;
}

const BoxHistoryList: React.FC = () => {
  const [history, setHistory] = useState<BoxOpenEntry[]>([]);

  useEffect(() => {
    const boxHistory = JSON.parse(localStorage.getItem("boxHistory") || "[]");
    // Sort by most recent first
    setHistory([...boxHistory].sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  if (!history.length) {
    return (
      <div className="text-center text-slate-400 text-sm mt-8">
        No surprise boxes opened yet.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        Surprise Box Opening History
        <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
          {history.length} {history.length === 1 ? "entry" : "entries"}
        </span>
      </h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800/70 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-slate-300 text-xs">#</th>
              <th className="px-4 py-2 text-left text-slate-300 text-xs">Date</th>
              <th className="px-4 py-2 text-left text-slate-300 text-xs">Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => {
              const dt = new Date(entry.timestamp);
              return (
                <tr key={i} className="hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-2 text-slate-200 text-sm">
                    {dt.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-2 text-slate-300 text-xs">
                    {dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoxHistoryList;
