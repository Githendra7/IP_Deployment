import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Phase1 from "./pages/Phase1";
import Phase2 from "./pages/Phase2";
import Phase3 from "./pages/Phase3";
import Phase4 from "./pages/Phase4";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/phases",
    Component: Layout,
    children: [
      { path: "phase-1", Component: Phase1 },
      { path: "phase-2", Component: Phase2 },
      { path: "phase-3", Component: Phase3 },
      { path: "phase-4", Component: Phase4 },
    ],
  },
]);