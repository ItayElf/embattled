import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/signIn" element={<Auth signIn={true} key={"signIn"} />} />
      <Route path="/signUp" element={<Auth signIn={false} key={"signUp"} />} />
    </Routes>
  );
}

export default App;
