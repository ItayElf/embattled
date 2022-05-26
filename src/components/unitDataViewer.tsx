import UnitData from "../interfaces/unitData";
import PrimaryButton from "./primaryButton";
import ProgressBar from "./progressBar";

interface Props {
  unitData: UnitData | null;
  onClose: () => void;
  className?: string;
}

const UnitDataViewer: React.FC<Props> = ({ unitData, onClose, className }) => {
  if (!unitData) return <></>;
  return (
    <div className={`bg-black/50 ${className}`}>
      <div className="h-min bg-secondary-dark p-4">
        <PrimaryButton className="s2 absolute" onClick={onClose}>
          Close
        </PrimaryButton>
        <div className="divide-y divide-primary-600">
          <div>
            <h5 className="h5 mb-4 text-center font-bold">
              {unitData.name} - {unitData.clas}
            </h5>
            <h5 className="s1 mb-4 text-center">{unitData.description}</h5>
            <div className="flex space-x-4">
              <div className="w-full">
                <p className="h6 text-center">
                  Unit Size: {unitData.unit_size} ({unitData.hitpoints} HP)
                </p>
                <ProgressBar
                  max={unitData.unit_size}
                  current={unitData.unit_size}
                  className="h-6 w-full"
                />
              </div>
              <div className="w-full">
                <p className="h6 text-center">Morale: {unitData.morale}</p>
                <ProgressBar
                  max={unitData.morale}
                  current={unitData.morale}
                  className="h-6 w-full"
                />
              </div>

              <div className="w-full">
                <p className="h6 text-center">
                  Ammo: {unitData.ammunition ?? "N/A"}
                </p>
                <ProgressBar
                  max={unitData.ammunition ?? 1}
                  current={unitData.ammunition ?? 0}
                  className="h-6 w-full"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="mt-2 flex w-1/2 justify-between space-x-4">
                <div className="s1 space-y-2">
                  <p>Speed: {unitData.speed}</p>
                  <p>Armor: {unitData.armor}</p>
                  <p>Defense: {unitData.defense}</p>
                </div>
                <div className="s1 space-y-2">
                  <p>Attack: {unitData.melee_attack}</p>
                  <p>Damage: {unitData.melee_damage}</p>
                  <p>Charge: +{unitData.charge_bonus}%</p>
                </div>
                <div className="s1 space-y-2">
                  <p>Range: {unitData.range ?? "N/A"}</p>
                  <p>R.Attack: {unitData.ranged_attack ?? "N/A"}</p>
                  <p>R.Damage: {unitData.ranged_damage ?? "N/A"}</p>
                </div>
              </div>
              <div className="s1 mt-2 w-1/2 space-y-2">
                <p>
                  Attributes:{" "}
                  {unitData.attributes.length !== 0
                    ? unitData.attributes.map((a) => a.name).join(", ")
                    : "None"}
                </p>
                <p>
                  Keywords:{" "}
                  {unitData.keywords.length !== 0
                    ? unitData.keywords.map((k) => k.name).join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          </div>
          {unitData.attributes.length !== 0 && (
            <div>
              <h6 className="h6 mt-2  underline">Attributes</h6>
              {unitData.attributes.map((a, i) => (
                <p className="h6" key={i}>
                  <strong className="text-primary-900">{a.name} - </strong>
                  <span className="s1">{a.description}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitDataViewer;
