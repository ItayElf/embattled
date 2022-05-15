import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/header";
import Loading from "../components/loading";
import { BASE_WS } from "../constants";
import globals from "../globals";
import useCurrentUser from "../hooks/useCurrentUser";

interface LocationState {
  army: string;
}

export default function Game() {
  const { hash } = useParams();
  const [init, setInit] = useState(false);
  const user = useCurrentUser(true);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const army = state
    ? state.army
    : '{"name":"First Army","mode":{"board_size":16,"id":1,"name":"Blitz","points":1000},"units":[{"position":[1,1],"name":"Swordsmen"},{"position":[2,2],"name":"Swordsmen"},{"position":[3,3],"name":"Swordsmen"},{"position":[4,4],"name":"Swordsmen"},{"position":[4,1],"name":"Swordsmen"}]}';

  useEffect(() => {
    if (user && !init) {
      setInit(true);
      const ws = new WebSocket(BASE_WS + hash);
      ws.onopen = () => {
        console.log("here");
        ws.send(globals.accessToken);
      };
      ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data);
        if (res.type === "error") {
          if (res.content === "No room") navigate("/rooms");
        } else if (res.type === "request") {
          if (res.content === "army") ws.send(army);
        }
      };
    }
  }, [hash, user, navigate, army, init]);

  if (!user) return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
    </>
  );
}
