import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastContainer position={"bottom-left"} />
    <App />
  </StrictMode>
);
