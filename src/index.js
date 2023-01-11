import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import firebase from "firebase/compat/app"; //ver 9

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

//index.js에는 App을 랜더하는 용도로 씀.
