
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Star, Trophy } from "lucide-react";

interface MainTabsProps {
  currentTab: string;
  setCurrentTab: (val: string) => void;
}

const tabs = [
  { id: 'game', label: "Today's Puzzle", icon: Brain },
  { id: 'stats', label: 'My Progress', icon: Star },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
];

const MainTabs: React.FC<MainTabsProps> = ({ currentTab, setCurrentTab }) => (
  <div className="flex justify-center mb-8">
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-700">
      <div className="flex gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentTab === id ? "default" : "ghost"}
            onClick={() => setCurrentTab(id)}
            className={`rounded-full transition-all duration-200 ${
              currentTab === id 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default MainTabs;

