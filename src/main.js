import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import App from "./app/App";
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
