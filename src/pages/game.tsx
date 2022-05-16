import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import BattleCanvas from "../components/battleCanvas";
import Header from "../components/header";
import Loading from "../components/loading";
import { BASE_WS } from "../constants";
import globals from "../globals";
import useCurrentUser from "../hooks/useCurrentUser";
import Game from "../interfaces/game";

interface LocationState {
  army: string;
}

export default function GamePage() {
  const { hash } = useParams();
  const [init, setInit] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const user = useCurrentUser(true);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const army = state.army;

  useEffect(() => {
    if (user && !init) {
      setInit(true);
      const ws = new WebSocket(BASE_WS + hash);
      ws.onopen = () => {
        ws.send(globals.accessToken);
      };
      ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data);
        console.log(`WSGOT: ${JSON.stringify(res)}`);
        if (res.type === "error") {
          if (res.content === "No room") navigate("/rooms");
        } else if (res.type === "request") {
          if (res.content === "army") ws.send(army);
        } else if (res.type === "game_data") {
          setGame(JSON.parse(res.content));
        }
      };
    }
  }, [hash, user, navigate, army, init]);

  if (!state || !state.army) return <Navigate to={"/rooms"} />;
  if (!user) return <Loading className="h-screen" />;

  if (game === null) {
    return (
      <>
        <Header user={user} />
        <div className="h-screen flex justify-center items-center flex-col space-y-8">
          <h1 className="h2">Waiting for an opponent...</h1>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} />
      <div className="flex px-6 mt-24">
        <BattleCanvas game={game} />
        <div className="w-full">
          <h1 className="h4 text-center">
            {game.mode.name} Game, {game.mode.points}P - {game.host.name} (
            {game.host.rating}) VS {game.joiner.name} ({game.joiner.rating})
          </h1>
        </div>
      </div>
    </>
  );
}
