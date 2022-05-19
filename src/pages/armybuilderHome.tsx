import { useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Army, { ArmyUnit } from "../interfaces/army";
import { postFetch } from "../utils/fetchUtils";

const getPoints = (army: Army) => army.units.reduce((s, u) => s + u.cost, 0);
export const getFaction = (units: ArmyUnit[]) => {
  let f: string | null = null;
  units.forEach((u) => {
    if (u.faction) f = u.faction;
  });
  return f ?? "Mercenaries";
};

export default function ArmybuilderHome() {
  const user = useCurrentUser(true);
  const armies = JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[];

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

  if (!user) return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
      <div className="flex flex-col mt-24 px-24 justify-center items-center">
        <h1 className="h2">All Armies</h1>
        <PrimaryButton className="w-72">+ New Army</PrimaryButton>
        <table className="w-full mt-4">
          <thead>
            <tr className="bg-primary-600 h6 text-white">
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
                className={`h6 ${
                  i % 2 === 0 ? "bg-primary-50" : "bg-primary-100"
                }`}
              >
                <td className="py-2 pl-6">{a.name}</td>
                <td className="py-2">
                  {a.mode.name} ({a.mode.points}P)
                </td>
                <td className="py-2">{getPoints(a)} Points</td>
                <td className="py-2">{getFaction(a.units)}</td>
                <td className="py-2 flex space-x-2 max-w-[160px]">
                  <PrimaryButton onClick={() => validate(a)} className="s2">
                    Validate
                  </PrimaryButton>
                  <Link to={`/army/${a.name}`}>
                    <PrimaryButton className="s2">Edit</PrimaryButton>
                  </Link>
                  <PrimaryButton className="s2">Delete</PrimaryButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
