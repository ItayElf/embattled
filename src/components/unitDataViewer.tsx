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
      <div className="p-4 bg-secondary-dark h-min">
        <PrimaryButton className="s2 absolute" onClick={onClose}>
          Close
        </PrimaryButton>
        <div className="divide-y divide-primary-600">
          <div>
            <h5 className="h5 text-center mb-4 font-bold">
              {unitData.name} - {unitData.clas}
            </h5>
            <div className="flex space-x-4">
              <div className="w-full">
                <p className="h6 text-center">
                  Unit Size: {unitData.unit_size}
                </p>
                <ProgressBar
                  max={unitData.unit_size}
                  current={unitData.unit_size}
                  className="w-full h-6"
                />
              </div>
              <div className="w-full">
                <p className="h6 text-center">Morale: {unitData.morale}</p>
                <ProgressBar
                  max={unitData.morale}
                  current={unitData.morale}
                  className="w-full h-6"
                />
              </div>

              <div className="w-full">
                <p className="h6 text-center">
                  Ammo: {unitData.ammunition ?? "N/A"}
                </p>
                <ProgressBar
                  max={unitData.ammunition ?? 1}
                  current={unitData.ammunition ?? 0}
                  className="w-full h-6"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex space-x-4 justify-between w-1/2 mt-2">
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
              <div className="w-1/2 space-y-2 s1 mt-2">
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
          <div>
            <h6 className="h6 underline  mt-2">Attributes</h6>
            {unitData.attributes.map((a, i) => (
              <p className="h6" key={i}>
                <strong className="text-primary-900">{a.name} - </strong>
                <span className="s1">{a.description}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDataViewer;
