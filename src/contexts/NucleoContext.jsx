import { createContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

import trilhasConfig from '@data/trilhasConfig.json';

export const TRAIL_KEY = 'trailProgress';

export function initializeProgressTracker() {
  const obj = {};
  for (const trailId in trilhasConfig) {
      obj[trailId] = {};
  }

  return obj;
}

export const NucleoContext = createContext({});

export function NucleoProvider({ children }) {
  const [trailSave, setTrailSave] = useLocalStorage(TRAIL_KEY, initializeProgressTracker());

  const getPercentage = useCallback((trailId) => {
    const trailProgress = trailSave;
    const totalChapters = trilhasConfig[trailId].chapters.length;
    const completedChapters = Object.values(trailProgress[trailId]).filter(Boolean).length;

    return ((completedChapters / totalChapters) * 100).toFixed(2);
  }, [trailSave]);

  const markAsRead = useCallback((trailId, chapter) => {
    setTrailSave(prev => {
      const updatedProgress = { ...prev };
      updatedProgress[trailId][chapter] = true;
      return updatedProgress;
    });
  }, [setTrailSave]);

  const markAllAsRead = useCallback((trailId) => {  
    setTrailSave(prev => {
      const totalChapters = trilhasConfig[trailId].chapters.length;
      const updatedProgress = { ...prev };

      for (var i = 0; i < totalChapters; i++) {
        updatedProgress[trailId][i] = true;
      }
      return updatedProgress;
    });
  }, [setTrailSave]); 

  const isChapterRead = useCallback((trailId, chapter) => {
    return trailSave[trailId][chapter];
  }, [trailSave]);

  const value = {
    getPercentage,
    markAsRead,
    markAllAsRead,
    isChapterRead
  };

  return (
    <NucleoContext.Provider
      value={value}
    >
      {children}
    </NucleoContext.Provider>
  )
}