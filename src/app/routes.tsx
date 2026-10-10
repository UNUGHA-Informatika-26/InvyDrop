import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { InventoryPage } from "./components/InventoryPage";
import { StatisticsPage } from "./components/StatisticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createHashRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: InventoryPage },
      { path: "statistics", Component: StatisticsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);