import Army from "../interfaces/army";
import Modal from "react-modal";
import PrimaryButton from "./primaryButton";
import { useCallback, useEffect, useState } from "react";
import { postFetch } from "../utils/fetchUtils";
import { BASE_API } from "../constants";

interface Props {
  army: Army | undefined;
  onClose: () => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "36px",
  },
};

const armyToExport = (army?: Army) =>
  army
    ? `${army.name}\n${army.mode.name}|${army.mode.points}|${army.mode.board_size}\n\n` +
      army.units
        .map(
          (u) =>
            `${u.name}|${String.fromCharCode(65 + u.position[0])}${
              u.position[1]
            }`
        )
        .join("\n")
    : "";

const ImportExportModal: React.FC<Props> = ({ army, onClose }) => {
  const [content, setContent] = useState(armyToExport(army));

  useEffect(() => setContent(armyToExport(army)), [army]);

  const save = useCallback(async () => {
    if (!army) return;
    const res = await postFetch(BASE_API + "rooms/import_army", {
      army: content,
    });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    const newArmy = JSON.parse(await res.text());
    const armies = JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[];
    const newArmies = armies.map((a) => (a.name !== army.name ? a : newArmy));
    localStorage.setItem("armies", JSON.stringify(newArmies));
    window.location.reload();
  }, [army, content]);

  if (!army) return <></>;

  return (
    <Modal
      isOpen={!!army}
      onRequestClose={onClose}
      style={customStyles}
      overlayClassName="bg-black/70 fixed inset-0 z-20"
      ariaHideApp={false}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="h6 h-96 w-96"
      />
      <div className="flex justify-between">
        <PrimaryButton className="h5" onClick={onClose}>
          Close
        </PrimaryButton>
        <PrimaryButton className="h5" onClick={save}>
          Save
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ImportExportModal;
