import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ActionPanel from "../components/actionPanel";
import BattleCanvas from "../components/battleCanvas";
import Header from "../components/header";
import Loading from "../components/loading";
import { BASE_WS } from "../constants";
import globals from "../globals";
import useCurrentUser from "../hooks/useCurrentUser";
import AttackDestinations from "../interfaces/attackDestinations";
import Game from "../interfaces/game";

interface LocationState {
  army: string;
}

export default function GamePage() {
  const { hash } = useParams();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [index, setIndex] = useState(-1);
  const [moveSquares, setMoveSquares] = useState<number[][] | null>(null);
  const [attackSquares, setAttackSquares] = useState<AttackDestinations | null>(
    null
  );
  const user = useCurrentUser(true);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const army = state.army;

  const onRequestMove = useCallback(
    async (id: number) => {
      if (!ws) return;
      ws.send(JSON.stringify({ type: "move_request", id }));
      setIndex(id);
    },
    [ws]
  );
  const onRequestAttack = useCallback(
    async (id: number) => {
      if (!ws) return;
      ws.send(JSON.stringify({ type: "attack_request", id }));
      setIndex(id);
    },
    [ws]
  );

  const onMove = useCallback(
    async (pos: number[]) => {
      if (!ws) return;
      ws.send(JSON.stringify({ type: "move_action", pos, id: index }));
    },
    [index, ws]
  );

  useEffect(() => {
    if (user && !ws) {
      const ws = new WebSocket(BASE_WS + hash);
      setWs(ws);
      ws.onopen = () => {
        ws.send(globals.accessToken);
      };
      ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data);
        console.log(`WSGOT: ${JSON.stringify(res)}`);
        if (res.type === "error") {
          if (res.content === "No room") navigate("/rooms");
          else alert(res.content);
        } else if (res.type === "request") {
          if (res.content === "army") ws.send(army);
        } else if (res.type === "game_data") {
          setGame(JSON.parse(res.content));
          setIndex(-1);
          setMoveSquares(null);
        } else if (res.type === "move") {
          setMoveSquares(JSON.parse(res.content));
        } else if (res.type === "attack") {
          setAttackSquares(JSON.parse(res.content));
        }
      };
    }
  }, [hash, user, navigate, army, ws]);

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

  const isHost = game.host.name === user.name;

  return (
    <>
      <Header user={user} />
      <div className="flex px-6 mt-24 max-h-screen">
        <BattleCanvas
          game={game}
          moveSquares={moveSquares}
          attackSquares={attackSquares}
          onMove={onMove}
          isHost={isHost}
        />
        <div className="w-full">
          <div className="h-full">
            <ActionPanel
              game={game}
              isHost={isHost}
              className="w-full h-1/2"
              onRequestMove={onRequestMove}
              onRequestAttack={onRequestAttack}
              resetMove={() => setMoveSquares(null)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
