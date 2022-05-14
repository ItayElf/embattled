import { useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Mode from "../interfaces/mode";
import Room from "../interfaces/room";
import { getFetch } from "../utils/fetchUtils";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[] | undefined | null>(null);
  const [modes, setModes] = useState<Mode[] | undefined | null>(null);
  const [roomName, setRoomName] = useState("");
  const [mode, setMode] = useState(-1);
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
          <form className="mt-16 space-y-4">
            <TextField
              type="text"
              value={roomName}
              setValue={setRoomName}
              label="Room Name"
              className="py-3"
            />
            <select
              className="w-full rounded border-none h5 bg-primary-50 focus:border-0 focus:ring-0 focus:ring-offset-0 font-ptsans py-3"
              value={mode + ""}
              onChange={(e) => setMode(parseInt(e.target.value))}
            >
              <option value="-1" disabled>
                Mode
              </option>
              {modes.map((m, i) => (
                <option value={m.id + ""}>
                  {m.name} ({m.points}P)
                </option>
              ))}
            </select>
            <select className="w-full rounded border-none h5 bg-primary-50 focus:border-0 focus:ring-0 focus:ring-offset-0 font-ptsans py-3"></select>
            <PrimaryButton className="w-full py-3">Host Room</PrimaryButton>
          </form>
        </div>
      </div>
    </>
  );
}
