import { useState } from "react";
import Unit from "../../interfaces/unit";
import PrimaryButton from "../primaryButton";
import ProgressBar from "../progressBar";

interface Props {
  units: {
    [key: number]: Unit;
  };
  onBack: () => void;
  isOwner: boolean;
}

const UnitsPanel: React.FC<Props> = ({ units, onBack, isOwner }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [index, setIndex] = useState(-1);

  if (selectedUnit) {
    return (
      <>
        <PrimaryButton
          className="s2"
          onClick={() => {
            setSelectedUnit(null);
            setIndex(-1);
          }}
        >
          Back
        </PrimaryButton>
        <div>
          <h5 className="h5 text-center font-bold">
            {selectedUnit.name} - {selectedUnit.clas} (#{index})
          </h5>
          <div className="flex space-x-4">
            <div className="w-full">
              <p className="h6 text-center">
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
              <p className="h6 text-center">
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
            {selectedUnit.ammunition && selectedUnit.ammunition_max && (
              <div className="w-full">
                <p className="h6 text-center">
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
              <div className="s1 space-y-2">
                <p>Speed: {selectedUnit.speed}</p>
                <p>Armor: {selectedUnit.armor}</p>
                <p>Defense: {selectedUnit.defense}</p>
              </div>
              <div className="s1 space-y-2">
                <p>Attack: {selectedUnit.melee_attack}</p>
                <p>Damage: {selectedUnit.melee_damage}</p>
                <p>Charge: +{selectedUnit.charge_bonus}%</p>
              </div>
              <div className="s1 space-y-2">
                <p>Range: {selectedUnit.range ?? "N/A"}</p>
                <p>R.Attack: {selectedUnit.ranged_attack ?? "N/A"}</p>
                <p>R.Damage: {selectedUnit.ranged_damage ?? "N/A"}</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 s1 mt-2">
              <p>
                Attributes:{" "}
                {selectedUnit.attributes.length !== 0
                  ? selectedUnit.attributes.map((a) => a.name).join(", ")
                  : "None"}
              </p>
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

  return (
    <>
      <PrimaryButton className="s2" onClick={onBack}>
        Back
      </PrimaryButton>
      <div className="grid grid-cols-4 gap-4 mt-2">
        {Object.keys(units).map((i) => (
          <PrimaryButton
            key={i}
            className="s1"
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
