import Room from "../interfaces/room";
import Modal from "react-modal";
import Army from "../interfaces/army";
import { FormEvent, useCallback, useState } from "react";
import PrimaryButton from "./primaryButton";
import { BASE_API } from "../constants";
import { postFetch, postFetchSafe } from "../utils/fetchUtils";
import { useNavigate } from "react-router";

interface Props {
  onClose: () => void;
  room: Room | null;
  armies: Army[];
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

const JoinModal: React.FC<Props> = ({ room, onClose, armies }) => {
  const [selectedArmyName, setSelectedArmyName] = useState("");
  const navigate = useNavigate();

  const join = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const army = armies.filter((a) => a.name === selectedArmyName)[0];
      const res = await postFetch(BASE_API + "rooms/validate_army", {
        army,
        mode_id: room?.mode.id,
      });
      if (res.status === 406) {
        alert("Invalid army:\n" + JSON.parse(await res.text()).join("\n"));
        return;
      }
      try {
        const res2 = await postFetchSafe(BASE_API + "rooms/join", {
          name: room?.name,
          mode_id: room?.mode.id,
        });
        navigate(`/game/${await res2.text()}`, {
          state: { army: JSON.stringify(army) },
        });
      } catch (e) {
        alert(e);
      }
    },
    [armies, navigate, room?.mode.id, room?.name, selectedArmyName]
  );

  if (!room) return <></>;

  const filteredArmies = armies.filter(
    (a) => a.mode.points <= room.mode.points
  );

  return (
    <Modal
      isOpen={!!room}
      onRequestClose={onClose}
      style={customStyles}
      overlayClassName="bg-black/70 fixed inset-0 z-20"
      ariaHideApp={false}
    >
      <h2 className="h2">Join Room - {room.name}</h2>
      <div className="flex justify-between">
        <h3 className="h4">
          {room.mode.name} ({room.mode.points}P)
        </h3>
        <h4 className="h4">
          {room.host.name} ({room.host.rating})
        </h4>
      </div>
      <form onSubmit={join}>
        <select
          className="h5 mt-10 w-full rounded border-none bg-primary-50 py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
          value={selectedArmyName}
          onChange={(e) => setSelectedArmyName(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Army
          </option>
          {filteredArmies.map((a, i) => (
            <option value={a.name} key={i}>
              {a.name}
            </option>
          ))}
        </select>
        <PrimaryButton className="mt-6 w-full">Join</PrimaryButton>
      </form>
    </Modal>
  );
};

export default JoinModal;
