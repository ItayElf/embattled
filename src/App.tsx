import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import GamePage from "./pages/game";
import Rooms from "./pages/rooms";

function App() {
  return (
    <Routes>
      <Route path="/signIn" element={<Auth signIn={true} key={"signIn"} />} />
      <Route path="/signUp" element={<Auth signIn={false} key={"signUp"} />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/game/:hash" element={<GamePage />} />
    </Routes>
  );
}

export default App;
