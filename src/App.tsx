import { Route, Routes } from "react-router-dom";
import ArmybuilderHome from "./pages/armybuilderHome";
import ArmyPreview from "./pages/armyPreview";
import Auth from "./pages/auth";
import DamageCalc from "./pages/damageCalc";
import GamePage from "./pages/game";
import Rooms from "./pages/rooms";
import UnitEditor from "./pages/unitsEditor";

function App() {
  return (
    <Routes>
      <Route path="/signIn" element={<Auth signIn={true} key={"signIn"} />} />
      <Route path="/signUp" element={<Auth signIn={false} key={"signUp"} />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/game/:hash" element={<GamePage />} />
      <Route path="/armybuilder" element={<ArmybuilderHome />} />
      <Route path="/army/:name" element={<ArmyPreview />} />
      <Route path="/armyunits/:name" element={<UnitEditor />} />
      <Route path="/damageCalc" element={<DamageCalc />} />
    </Routes>
  );
}

export default App;
