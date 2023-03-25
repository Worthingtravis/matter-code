import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>
);
