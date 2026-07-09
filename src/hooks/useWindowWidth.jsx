import { useSyncExternalStore } from "react";

const subscribe = (callback) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

const snapshot = () => window.innerWidth;

export function useWindowWidth() {
  return useSyncExternalStore(subscribe, snapshot);
}