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
import LogArea from "../components/logArea";
import { BASE_WS } from "../constants";
import globals from "../globals";
import useCurrentUser from "../hooks/useCurrentUser";
import useTitle from "../hooks/useTitle";
import AttackDestinations from "../interfaces/attackDestinations";
import Game from "../interfaces/game";
import LogMessage from "../interfaces/logMessage";

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
  const [visible, setVisible] = useState<number[][]>([]);
  const [msgs, setMsgs] = useState<LogMessage[]>([]);
  const user = useCurrentUser(true);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const army = state.army;

  useTitle(game ? `${game.host.name} VS ${game.joiner.name}` : "Game");

  const onRequestGenerator = useCallback(
    (type: string) => {
      return (id: number) => {
        if (!ws) return;
        ws.send(JSON.stringify({ type, id }));
        setIndex(id);
      };
    },
    [ws]
  );
  const onRequestMove = onRequestGenerator("move_request");
  const onRequestAttack = onRequestGenerator("attack_request");
  const onRequestHalt = onRequestGenerator("halt");

  const onMove = useCallback(
    async (pos: number[]) => {
      if (!ws) return;
      ws.send(JSON.stringify({ type: "move_action", pos, id: index }));
    },
    [index, ws]
  );
  const onAttack = useCallback(
    async (pos: number[]) => {
      if (!ws) return;
      ws.send(JSON.stringify({ type: "attack_action", pos, id: index }));
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
          const game = JSON.parse(res.content) as Game;
          const isHost = game.host.name === user.name;
          setGame(game);
          setVisible(isHost ? game.host_visible : game.joiner_visible);
          setIndex(-1);
          setMoveSquares(null);
          setAttackSquares(null);
          if (game.ended) {
            ws.send(JSON.stringify({ type: "close" }));
            ws.close();
          }
        } else if (res.type === "move") {
          const obj = JSON.parse(res.content);
          setMoveSquares(obj.squares);
          setIndex(obj.id);
        } else if (res.type === "attack") {
          setAttackSquares(JSON.parse(res.content));
        } else if (res.type === "msg") {
          setMsgs((m) => [...m, JSON.parse(res.content)]);
        }
      };
    }
  }, [hash, user, navigate, army, ws, game]);

  if (!state || !state.army) return <Navigate to={"/rooms"} />;
  if (!user) return <Loading className="h-screen" />;

  if (game === null) {
    return (
      <>
        <Header user={user} />
        <div className="flex h-screen flex-col items-center justify-center space-y-8">
          <h1 className="h2">Waiting for an opponent...</h1>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} />
      <div className="mt-24 flex max-h-screen px-6">
        <BattleCanvas
          game={game}
          moveSquares={moveSquares}
          attackSquares={attackSquares}
          visible={visible}
          onMove={onMove}
          onAttack={onAttack}
          isHost={game.host.name === user.name}
        />
        <div className="w-full">
          <div className="h-full max-h-[816px]">
            <ActionPanel
              game={game}
              isHost={game.host.name === user.name}
              className="h-1/2 w-full"
              onRequestMove={onRequestMove}
              onRequestAttack={onRequestAttack}
              onRequestHalt={onRequestHalt}
              resetMove={() => setMoveSquares(null)}
            />
            <LogArea messages={msgs} className="h-1/2 w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
