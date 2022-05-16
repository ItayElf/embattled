import { useState } from "react";
import Game from "../interfaces/game";
import UnitsPanel from "./panels/unitsPanel";
import PrimaryButton from "./primaryButton";

interface Props {
  game: Game;
  isHost: boolean;
  className?: string;
}

const ActionPanel: React.FC<Props> = ({ game, isHost, className }) => {
  const [screen, setScreen] = useState("");
  const yourTurn =
    (isHost && game.is_host_turn) || (!isHost && !game.is_host_turn);
  return (
    <div className={`bg-secondary-dark px-4 ${className}`}>
      <h1 className="h5 text-center">
        {game.mode.name} Game, {game.mode.points}P - {game.host.name} (
        {game.host.rating}) VS {game.joiner.name} ({game.joiner.rating})
      </h1>
      <div className="h-px bg-primary-100" />
      <p className="text-center h6">
        {yourTurn ? "Your Turn" : "Opponent's Turn"}
      </p>
      <div className="h-px bg-primary-100" />
      <div className="pt-2">
        {screen === "" && <Actions setScreen={setScreen} />}
        {screen === "units" && (
          <UnitsPanel
            units={isHost ? game.host.army : game.joiner.army}
            onBack={() => setScreen("")}
            isOwner
          />
        )}
        {screen === "oppunits" && (
          <UnitsPanel
            units={isHost ? game.joiner.army : game.host.army}
            onBack={() => setScreen("")}
            isOwner={false}
          />
        )}
      </div>
    </div>
  );
};

export default ActionPanel;

interface ActionProps {
  setScreen: (screen: string) => void;
}

const Actions: React.FC<ActionProps> = ({ setScreen }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <PrimaryButton className="h6" onClick={() => setScreen("units")}>
        Units
      </PrimaryButton>
      <PrimaryButton className="h6" onClick={() => setScreen("oppunits")}>
        Opp. Units
      </PrimaryButton>
    </div>
  );
};
