import { useState } from "react";
import Unit from "../../interfaces/unit";
import PrimaryButton from "../primaryButton";
import ProgressBar from "../progressBar";
import Tooltip from "../tooltip";

interface Props {
  units: {
    [key: number]: Unit;
  };
  onBack: () => void;
  isOwner: boolean;
  originalValue: number;
}

const UnitsPanel: React.FC<Props> = ({
  units,
  onBack,
  isOwner,
  originalValue,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [index, setIndex] = useState(-1);

  if (selectedUnit) {
    return (
      <>
        <PrimaryButton
          className="caption lg:s2 absolute"
          onClick={() => {
            setSelectedUnit(null);
            setIndex(-1);
          }}
        >
          Back
        </PrimaryButton>
        <h5 className="s1 lg:h5 text-center mb-4 font-bold">
          {selectedUnit.name} - {selectedUnit.clas} (#{index})
        </h5>
        <div>
          <div className="flex space-x-4">
            <div className="w-full">
              <p className="s1 lg:h6 text-center">
                Unit Size ({selectedUnit.unit_size}/{selectedUnit.unit_size_max}
                )
              </p>
              <ProgressBar
                max={selectedUnit.unit_size_max}
                current={selectedUnit.unit_size}
                className="w-full h-6"
              />
            </div>
            <div className="w-full">
              <p className="s1 lg:h6 text-center">
                Morale ({isOwner ? selectedUnit.morale : "??"}/
                {selectedUnit.morale_max})
              </p>
              <ProgressBar
                max={selectedUnit.morale_max}
                current={
                  isOwner ? selectedUnit.morale : selectedUnit.morale_max
                }
                className="w-full h-6"
              />
            </div>
            {selectedUnit.ammunition !== null && selectedUnit.ammunition_max && (
              <div className="w-full">
                <p className="s1 lg:h6 text-center">
                  Ammo ({selectedUnit.ammunition}/{selectedUnit.ammunition_max})
                </p>
                <ProgressBar
                  max={selectedUnit.ammunition_max}
                  current={selectedUnit.ammunition}
                  className="w-full h-6"
                />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-4 justify-between w-1/2 mt-2">
              <div className="caption lg:s1 lg:space-y-2">
                <p>Speed: {selectedUnit.speed}</p>
                <p>Armor: {selectedUnit.armor}</p>
                <p>Defense: {selectedUnit.defense}</p>
              </div>
              <div className="caption lg:s1 lg:space-y-2">
                <p>Attack: {selectedUnit.melee_attack}</p>
                <p>Damage: {selectedUnit.melee_damage}</p>
                <p>Charge: +{selectedUnit.charge_bonus}%</p>
              </div>
              <div className="caption lg:s1 lg:space-y-2">
                <p>Range: {selectedUnit.range ?? "N/A"}</p>
                <p>R.Attack: {selectedUnit.ranged_attack ?? "N/A"}</p>
                <p>R.Damage: {selectedUnit.ranged_damage ?? "N/A"}</p>
              </div>
            </div>
            <div className="w-1/2 lg:pl-0 pl-2 lg:space-y-2 caption lg:s1 mt-2">
              <div className="flex space-x-1">
                <p>Attributes: </p>
                {selectedUnit.attributes.length !== 0
                  ? selectedUnit.attributes.map((a, i) => (
                      <div key={i}>
                        <Tooltip title={a.description}>
                          <p className="underline w-max">
                            {a.name}
                            {i !== selectedUnit.attributes.length - 1 && ", "}
                          </p>
                        </Tooltip>
                      </div>
                    ))
                  : "None"}
              </div>
              <p>
                Keywords:{" "}
                {selectedUnit.keywords.length !== 0
                  ? selectedUnit.keywords.join(", ")
                  : "None"}
              </p>
              <p>Acted This Turn: {selectedUnit.activated ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const relative = Object.values(units).reduce(
    (s, u) => s + Math.floor((u.cost * u.unit_size) / u.unit_size_max),
    0
  );
  return (
    <>
      <PrimaryButton className="caption lg:s2 absolute" onClick={onBack}>
        Back
      </PrimaryButton>
      <h5 className="s1 lg:h5 text-center font-bold">
        {isOwner ? "Your" : "Opponent's"} Army ({relative}/{originalValue}{" "}
        points)
      </h5>
      <div className="grid grid-cols-4 gap-4 mt-4 lg:mt-2">
        {Object.keys(units).map((i) => (
          <PrimaryButton
            key={i}
            className="caption lg:s1"
            onClick={() => {
              setSelectedUnit(units[parseInt(i)]);
              setIndex(parseInt(i));
            }}
          >
            {units[parseInt(i)].name} (#{i})
          </PrimaryButton>
        ))}
      </div>
    </>
  );
};

export default UnitsPanel;
