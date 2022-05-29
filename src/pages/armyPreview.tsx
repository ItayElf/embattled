import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import ArmyViewer from "../components/armyViewer";
import Header from "../components/header";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Army from "../interfaces/army";
import Mode from "../interfaces/mode";
import { getFetch } from "../utils/fetchUtils";
import { getFaction } from "./armybuilderHome";

export default function ArmyPreview() {
  const { name } = useParams();
  const [armies, setArmies] = useState(
    JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[]
  );
  const armiesFiltered = armies.filter((a) => a.name === name);
  const army = armiesFiltered[0];
  const [modes, setModes] = useState<Mode[] | null>(null);
  const [selectedMode, setSelectedMode] = useState((army?.mode?.id ?? "") + "");
  const [selectedName, setSelectedName] = useState(army?.name ?? "");
  const user = useCurrentUser(false);
  const navigate = useNavigate();

  useEffect(() => {
    getFetch(BASE_API + "modes")
      .then((res) => res.text())
      .then((t) => setModes(JSON.parse(t)));
  }, []);

  const saveArmy = useCallback(
    (oldName: string, army: Army) => {
      const armies = JSON.parse(
        localStorage.getItem("armies") ?? "[]"
      ) as Army[];
      const newArmies = armies.map((a) => (a.name !== oldName ? a : army));
      localStorage.setItem("armies", JSON.stringify(newArmies));
      setArmies(newArmies);
      navigate(`/army/${army.name}`);
    },
    [navigate]
  );

  if (army === undefined) {
    return <Navigate to="/armybuilder" />;
  }

  if (!modes) return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
      <div className="flex space-x-2 px-6">
        <div className="mt-24 flex w-full flex-col items-center">
          <TextField
            type="text"
            value={selectedName}
            setValue={setSelectedName}
            label="Army Name"
            className="text-[32px] lg:text-[64px]"
            wrapperClassName="mb-4 w-full"
          />
          <div className="flex w-full space-x-4">
            <select
              className="s1 lg:h5 w-1/2 rounded border-none bg-primary-50 py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
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
            <PrimaryButton
              className="s2 lg:h6 w-1/4"
              disabled={
                selectedMode === army.mode.id + "" &&
                (selectedName === army.name || !selectedName)
              }
              onClick={() =>
                saveArmy(army.name, {
                  ...army,
                  mode: modes.filter((m) => m.id + "" === selectedMode)[0],
                  name: selectedName.trim(),
                })
              }
            >
              Save Changes
            </PrimaryButton>
            <Link to={`/armyunits/${army.name}`} className="w-1/4">
              <PrimaryButton className="s2 lg:h6 h-full w-full">
                Edit Units
              </PrimaryButton>
            </Link>
          </div>
          <h4 className="h6 lg:h4 mt-8">Units</h4>
          <table className="w-full">
            <thead>
              <tr className="s2 lg:h6 bg-primary-600 text-white">
                <td className="py-2 pl-6">Name</td>
                <td className="py-2">Position</td>
                <td className="py-2">Faction</td>
                <td className="py-2">Cost</td>
              </tr>
            </thead>
            <tbody>
              {army.units.map((u, i) => (
                <tr
                  key={i}
                  className={`s2 lg:h6 ${
                    i % 2 === 0 ? "bg-primary-50" : "bg-primary-100"
                  }`}
                >
                  <td className="py-2 pl-6">{u.name}</td>
                  <td className="py-2">
                    {String.fromCharCode(65 + u.position[0])}
                    {u.position[1]}
                  </td>
                  <td className="py-2">{u.faction ?? "Mercenaries"}</td>
                  <td className="py-2">{u.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ArmyViewer
          mode={modes.filter((m) => m.id + "" === selectedMode)[0]}
          faction={getFaction(army.units)}
          units={army.units}
          className="mt-24"
        />
      </div>
    </>
  );
}
