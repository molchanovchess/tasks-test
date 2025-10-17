import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthGate } from "./modules/auth/AuthGate";
import SignIn from "./modules/auth/SignIn";
import Dashboard from "./modules/dashboard/Dashboard";
import Checklists from "./modules/checklists/Checklists";
import SignUp from "./modules/auth/SignUp";

const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  {
    path: "/",
    element: (
      <AuthGate>
        <Dashboard />
      </AuthGate>
    ),
  },
  {
    path: "/checklists",
    element: (
      <AuthGate>
        <Checklists />
      </AuthGate>
    ),
  },
  { path: "*", element: <div className="p-6">Not found</div> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
