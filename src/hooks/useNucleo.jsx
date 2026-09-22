import { useContext } from "react";
import { NucleoContext } from "@contexts/NucleoContext";

export function useNucleo() {
  return useContext(NucleoContext);
}