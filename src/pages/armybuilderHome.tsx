import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import ImportExportModal from "../components/importExportModal";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Army, { ArmyUnit } from "../interfaces/army";
import Mode from "../interfaces/mode";
import { getFetch, postFetch } from "../utils/fetchUtils";

const getPoints = (army: Army) => army.units.reduce((s, u) => s + u.cost, 0);
export const getFaction = (units: ArmyUnit[]) => {
  let f: string | null = null;
  units.forEach((u) => {
    if (u.faction) f = u.faction;
  });
  return f ?? "Mercenaries";
};

const reg = /^Untitled (\d+)$/;

export default function ArmybuilderHome() {
  const [modes, setModes] = useState<Mode[] | null>(null);
  const [armies, setArmies] = useState(
    JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[]
  );
  const [exportedArmy, setExportedArmy] = useState<Army | undefined>();
  const user = useCurrentUser(true);
  const navigate = useNavigate();

  const validate = useCallback(async (army: Army) => {
    const res = await postFetch(BASE_API + "rooms/validate_army", {
      army,
      mode_id: army.mode.id,
    });
    if (res.status === 406) {
      alert("Invalid army:\n" + JSON.parse(await res.text()).join("\n"));
      return;
    } else {
      alert(`This army is valid for ${army.mode.name} (${army.mode.points}P)!`);
    }
  }, []);

  useEffect(() => {
    getFetch(BASE_API + "modes")
      .then((res) => res.text())
      .then((t) => setModes(JSON.parse(t)));
  }, []);

  const onNewArmy = useCallback(() => {
    if (!modes) return;
    const latestUntitled = armies
      .map((a) => a.name)
      .filter((a) => reg.test(a))
      .map((a) => parseInt((reg.exec(a) ?? "1")[1]))
      .sort((a, b) => b - a);
    if (latestUntitled.length === 0) latestUntitled.push(0);
    const name = `Untitled ${latestUntitled[0] + 1}`;
    localStorage.setItem(
      "armies",
      JSON.stringify([...armies, { name, units: [], mode: modes[0] }])
    );
    navigate(`/army/${name}`);
  }, [armies, navigate, modes]);

  const onDelete = useCallback(
    (name: string) => {
      const newArmies = armies.filter((a) => a.name !== name);
      localStorage.setItem("armies", JSON.stringify(newArmies));
      setArmies(newArmies);
    },
    [armies]
  );

  if (!user || !modes) return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
      <div className="mt-24 flex flex-col items-center justify-center px-24">
        <h1 className="h4 lg:h2">All Armies</h1>
        <PrimaryButton className="h6 lg:h4 w-72" onClick={onNewArmy}>
          + New Army
        </PrimaryButton>
        <table className="mt-4 w-full">
          <thead>
            <tr className="s1 lg:h6 bg-primary-600 text-white">
              <td className="py-2 pl-6">Name</td>
              <td className="py-2">Mode</td>
              <td className="py-2">Worth</td>
              <td className="py-2">Faction</td>
              <td className="py-2">Actions</td>
            </tr>
          </thead>
          <tbody>
            {armies.map((a, i) => (
              <tr
                key={i}
                className={`s2 lg:h6 ${
                  i % 2 === 0 ? "bg-primary-50" : "bg-primary-100"
                }`}
              >
                <td className="py-2 pl-6">{a.name}</td>
                <td className="py-2">
                  {a.mode.name} ({a.mode.points}P)
                </td>
                <td className="py-2">{getPoints(a)} Points</td>
                <td className="py-2">{getFaction(a.units)}</td>
                <td className="flex max-w-[280px] space-x-2 py-2 lg:max-w-[230px]">
                  <PrimaryButton
                    onClick={() => validate(a)}
                    className="caption lg:s2"
                  >
                    Validate
                  </PrimaryButton>
                  <Link to={`/army/${a.name}`}>
                    <PrimaryButton className="caption lg:s2">
                      Edit
                    </PrimaryButton>
                  </Link>
                  <PrimaryButton
                    className="caption lg:s2"
                    onClick={() => onDelete(a.name)}
                  >
                    Delete
                  </PrimaryButton>
                  <PrimaryButton
                    className="caption lg:s2"
                    onClick={() => setExportedArmy(a)}
                  >
                    Import/Export
                  </PrimaryButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ImportExportModal
        army={exportedArmy}
        onClose={() => setExportedArmy(undefined)}
      />
    </>
  );
}
