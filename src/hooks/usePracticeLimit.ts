
import { useEffect, useState } from "react";

export function usePracticeLimit(maxPracticePerDay: number = 3) {
  const [practiceCount, setPracticeCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const metaStr = localStorage.getItem("practiceMeta");
    let countForToday = 0;
    if (metaStr) {
      try {
        const meta = JSON.parse(metaStr);
        if (meta.date === today) {
          countForToday = meta.count || 0;
        }
      } catch {
        // ignore parse error
      }
    }
    setPracticeCount(countForToday);
  }, []);

  const updateCount = (newCount: number) => {
    const today = new Date().toDateString();
    localStorage.setItem("practiceMeta", JSON.stringify({ date: today, count: newCount }));
    setPracticeCount(newCount);
  };

  const canPractice = practiceCount < maxPracticePerDay;

  return { practiceCount, setPracticeCount: updateCount, canPractice };
}
