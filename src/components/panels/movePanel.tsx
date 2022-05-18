import Unit from "../../interfaces/unit";
import PrimaryButton from "../primaryButton";

interface Props {
  units: {
    [key: number]: Unit;
  };
  onBack: () => void;
  onRequestMove: (id: number) => void;
}

const MovePanel: React.FC<Props> = ({ units, onBack, onRequestMove }) => {
  return (
    <>
      <PrimaryButton className="s2 absolute" onClick={onBack}>
        Back
      </PrimaryButton>
      <h5 className="h5 text-center font-bold">Move Unit</h5>
      <div className="grid grid-cols-4 gap-4 mt-2">
        {Object.keys(units).map((i) => {
          const unit = units[parseInt(i)];
          return (
            !unit.activated && (
              <PrimaryButton
                key={i}
                className="s1"
                onClick={() => {
                  onRequestMove(parseInt(i));
                  onBack();
                }}
              >
                {units[parseInt(i)].name} (#{i})
              </PrimaryButton>
            )
          );
        })}
      </div>
    </>
  );
};

export default MovePanel;
