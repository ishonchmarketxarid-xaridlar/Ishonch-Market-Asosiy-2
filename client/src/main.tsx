import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

let userId = localStorage.getItem("userId");

if (!userId) {
  userId = Math.floor(Math.random() * 100000000).toString();
  localStorage.setItem("userId", userId);
}

createRoot(document.getElementById("root")!).render(<App />);

