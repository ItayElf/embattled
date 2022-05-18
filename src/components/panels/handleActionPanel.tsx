import Unit from "../../interfaces/unit";
import PrimaryButton from "../primaryButton";

interface Props {
  title: string;
  movedUnit: number | null;
  units: {
    [key: number]: Unit;
  };
  onBack: () => void;
  onRequestAction: (id: number) => void;
}

const HandleActionPanel: React.FC<Props> = ({
  title,
  movedUnit,
  units,
  onBack,
  onRequestAction,
}) => {
  return (
    <>
      <PrimaryButton className="s2 absolute" onClick={onBack}>
        Back
      </PrimaryButton>
      <h5 className="h5 text-center font-bold">{title}</h5>
      <div className="grid grid-cols-4 gap-4 mt-2">
        {(movedUnit ? [movedUnit + ""] : Object.keys(units)).map((i) => {
          const unit = units[parseInt(i)];
          return (
            (!unit.activated || movedUnit) && (
              <PrimaryButton
                key={i}
                className="s1"
                onClick={() => {
                  onRequestAction(parseInt(i));
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

export default HandleActionPanel;
