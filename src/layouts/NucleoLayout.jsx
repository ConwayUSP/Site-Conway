import { Outlet } from "react-router-dom";
import { NucleoProvider } from "@contexts/NucleoContext";

export default function NucleoLayout() {
  return (
    <NucleoProvider>
      <Outlet />
    </NucleoProvider>
  )
}