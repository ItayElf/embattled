import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Rooms from "./pages/rooms";

function App() {
  return (
    <Routes>
      <Route path="/signIn" element={<Auth signIn={true} key={"signIn"} />} />
      <Route path="/signUp" element={<Auth signIn={false} key={"signUp"} />} />
      <Route path="/rooms" element={<Rooms />} />
    </Routes>
  );
}

export default App;
