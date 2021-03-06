import { useState } from "react";
import Game from "../interfaces/game";
import HandleActionPanel from "./panels/handleActionPanel";
import MovePanel from "./panels/movePanel";
import UnitsPanel from "./panels/unitsPanel";
import PrimaryButton from "./primaryButton";

interface Props {
  game: Game;
  isHost: boolean;
  className?: string;
  onRequestMove: (id: number) => void;
  onRequestAttack: (id: number) => void;
  onRequestHalt: (id: number) => void;
  resetMove: () => void;
}

const ActionPanel: React.FC<Props> = ({
  game,
  isHost,
  className,
  onRequestMove,
  onRequestAttack,
  onRequestHalt,
  resetMove,
}) => {
  const [screen, setScreen] = useState("");
  const yourTurn =
    (isHost && game.is_host_turn) || (!isHost && !game.is_host_turn);
  return (
    <div className={`overflow-auto bg-secondary-dark px-4 ${className}`}>
      <h1 className="s1 lg:h5 text-center">
        {game.mode.name} Game, {game.mode.points}P - {game.host.name} (
        {game.host.rating}) VS {game.joiner.name} ({game.joiner.rating})
      </h1>
      <div className="h-px bg-primary-100" />
      <p className="s2 lg:h6 text-center">
        {game.ended ? "Game Ended" : yourTurn ? "Your Turn" : "Opponent's Turn"}
      </p>
      <div className="h-px bg-primary-100" />
      <div className="pt-2">
        {screen === "" && (
          <Actions
            onRequestAttack={() =>
              game.moved_unit && onRequestAttack(game.moved_unit)
            }
            onRequestHalt={() => onRequestHalt(-1)}
            setScreen={setScreen}
            yourTurn={yourTurn}
            moved={game.moved_unit !== null}
            ended={game.ended}
          />
        )}
        {screen === "units" && (
          <UnitsPanel
            units={isHost ? game.host.army : game.joiner.army}
            onBack={() => setScreen("")}
            isOwner
            originalValue={
              isHost ? game.host.original_value : game.joiner.original_value
            }
          />
        )}
        {screen === "oppunits" && (
          <UnitsPanel
            units={isHost ? game.joiner.army : game.host.army}
            onBack={() => setScreen("")}
            isOwner={false}
            originalValue={
              isHost ? game.joiner.original_value : game.host.original_value
            }
          />
        )}
        {screen === "move" && (
          <MovePanel
            units={isHost ? game.host.army : game.joiner.army}
            onBack={() => {
              setScreen("");
              resetMove();
            }}
            onRequestMove={onRequestMove}
          />
        )}
        {screen === "attack" && (
          <HandleActionPanel
            title="Attack"
            movedUnit={game.moved_unit}
            units={isHost ? game.host.army : game.joiner.army}
            onBack={() => {
              setScreen("");
            }}
            onRequestAction={onRequestAttack}
          />
        )}
        {screen === "halt" && (
          <HandleActionPanel
            title="Halt"
            movedUnit={game.moved_unit}
            units={isHost ? game.host.army : game.joiner.army}
            onBack={() => {
              setScreen("");
            }}
            onRequestAction={onRequestHalt}
          />
        )}
      </div>
    </div>
  );
};

export default ActionPanel;

interface ActionProps {
  onRequestAttack: () => void;
  onRequestHalt: () => void;
  setScreen: (screen: string) => void;
  yourTurn: boolean;
  moved: boolean;
  ended: boolean;
}

const Actions: React.FC<ActionProps> = ({
  onRequestAttack,
  onRequestHalt,
  setScreen,
  yourTurn,
  moved,
  ended,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <PrimaryButton className="s2 lg:h6" onClick={() => setScreen("units")}>
        Units
      </PrimaryButton>
      <PrimaryButton className="s2 lg:h6" onClick={() => setScreen("oppunits")}>
        Opp. Units
      </PrimaryButton>
      {yourTurn && !ended ? (
        <>
          <PrimaryButton
            disabled={moved}
            className="s2 lg:h6"
            onClick={() => setScreen("move")}
          >
            Move Unit
          </PrimaryButton>
          <PrimaryButton
            className="s2 lg:h6"
            onClick={() => (moved ? onRequestAttack() : setScreen("attack"))}
          >
            Attack
          </PrimaryButton>
          <PrimaryButton
            className="s2 lg:h6"
            onClick={() => (moved ? onRequestHalt() : setScreen("halt"))}
          >
            {moved ? "Pass Round" : "Halt"}
          </PrimaryButton>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
