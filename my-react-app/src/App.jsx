import LittleLune from "./LittleLune.jsx";
import NiaaKids from "./NiaaKids.jsx";

// "/" shows the NIAA Kids store; "/littlelune" shows the earlier LittleLune page.
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "").toLowerCase();
  return path === "/littlelune" ? <LittleLune /> : <NiaaKids />;
}
