import { FormEvent, useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Army from "../interfaces/army";
import Mode from "../interfaces/mode";
import Room from "../interfaces/room";
import { getFetch, postFetch } from "../utils/fetchUtils";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[] | undefined | null>(null);
  const [modes, setModes] = useState<Mode[] | undefined | null>(null);
  const armies = JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[];
  const [selectedArmyName, setSelectedArmyName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [mode, setMode] = useState("");
  const user = useCurrentUser(true);

  const refresh = useCallback(async () => {
    try {
      const res = await getFetch(BASE_API + "rooms");
      const json = JSON.parse(await res.text());
      setRooms(json as Room[]);
    } catch (e) {
      setRooms(undefined);
    }
  }, []);

  const host = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const army = armies.filter((a) => a.name === selectedArmyName)[0];
      const res = await postFetch(BASE_API + "rooms/validate_army", {
        army,
        mode_id: mode,
      });
      if (res.status === 406) {
        alert("Invalid army:\n" + JSON.parse(await res.text()).join("\n"));
        return;
      }
    },
    [armies, mode, selectedArmyName]
  );

  useEffect(() => {
    const getData = async () => {
      await refresh();
      try {
        const res = await getFetch(BASE_API + "modes");
        const json = JSON.parse(await res.text());
        setModes(json as Mode[]);
      } catch (e) {
        setModes(undefined);
      }
    };
    getData();
  }, [refresh]);

  if (!user || rooms == null || !modes) {
    return <Loading className="h-screen" />;
  }

  const selectedMode = !mode
    ? null
    : modes.filter((m) => m.id === parseInt(mode))[0];
  const filteredArmies = armies.filter(
    (a) => selectedMode === null || a.mode.points <= selectedMode.points
  );

  return (
    <>
      <Header user={user} />
      <div className="mt-24" />
      <h1 className="h1 text-center">Rooms</h1>
      <div className="flex space-x-16">
        <div className="w-2/3 pl-9">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-600 h6 text-white">
                <td className="py-2 pl-6">Name</td>
                <td className="py-2">Mode</td>
                <td className="py-2">Host</td>
                <td className="py-2">Join</td>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr
                  key={i}
                  className={`h6 ${
                    i % 2 === 0 ? "bg-primary-50" : "bg-primary-100"
                  }`}
                >
                  <td className="py-2 pl-6">{r.name}</td>
                  <td className="py-2">{`${r.mode.name} (${r.mode.points}P)`}</td>
                  <td className="py-2">{r.host.name}</td>
                  <td className="py-2">
                    {r.host.name !== user.name && (
                      <PrimaryButton className="h6 pt-1 w-full -mx-5">
                        Join
                      </PrimaryButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/3 flex pr-16 flex-col">
          <PrimaryButton className="w-full py-3" onClick={() => refresh()}>
            Refresh
          </PrimaryButton>
          <form className="mt-16 space-y-4" onSubmit={host}>
            <TextField
              type="text"
              value={roomName}
              setValue={setRoomName}
              label="Room Name"
              className="py-3"
              required
            />
            <select
              className="w-full rounded border-none h5 bg-primary-50 focus:border-0 focus:ring-0 focus:ring-offset-0 font-ptsans py-3"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              required
            >
              <option value="" disabled>
                Mode
              </option>
              {modes.map((m, i) => (
                <option value={m.id + ""} key={i}>
                  {m.name} ({m.points}P)
                </option>
              ))}
            </select>
            <select
              className="w-full rounded border-none h5 bg-primary-50 focus:border-0 focus:ring-0 focus:ring-offset-0 font-ptsans py-3"
              value={selectedArmyName}
              onChange={(e) => setSelectedArmyName(e.target.value)}
              disabled={!mode}
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
            <PrimaryButton className="w-full py-3">Host Room</PrimaryButton>
          </form>
        </div>
      </div>
    </>
  );
}
