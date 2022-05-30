import { useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import Loading from "../components/loading";
import TextField from "../components/textField";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import useTitle from "../hooks/useTitle";
import DamageCalcRes from "../interfaces/damageCalcRes";
import UnitData from "../interfaces/unitData";
import { getFetch } from "../utils/fetchUtils";

export default function DamageCalc() {
  const user = useCurrentUser(false);
  const [unitsData, setUnitsData] = useState<UnitData[] | null>(null);
  const [damage, setDamage] = useState<DamageCalcRes | null>(null);
  const [attacker, setAttacker] = useState<UnitData | null>(null);
  const [defender, setDefender] = useState<UnitData | null>(null);
  const [attackerSize, setAttackerSize] = useState(0);
  const [defenderSize, setDefenderSize] = useState(0);
  const [ranged, setRanged] = useState(false);
  const [flank, setFlank] = useState(false);
  const [charge, setCharge] = useState(false);
  const [advantage, setAdvantage] = useState(0);

  useTitle("Damage Calculator");

  const calcDamage = useCallback(async () => {
    if (!attacker || !defender) return;
    const params = new URLSearchParams({
      attacker: attacker.name,
      defender: defender.name,
      attacker_size: attackerSize + "",
      defender_size: defenderSize + "",
      ranged: ranged ? "1" : "0",
      flank: flank ? "1" : "0",
      charge: charge ? "1" : "0",
      advantage: advantage + "",
    });
    const res = await getFetch(BASE_API + "damage_calc?" + params.toString());
    return JSON.parse(await res.text()) as DamageCalcRes;
  }, [
    attacker,
    defender,
    attackerSize,
    defenderSize,
    advantage,
    charge,
    flank,
    ranged,
  ]);

  useEffect(() => {
    getFetch(BASE_API + "units")
      .then((res) => res.text())
      .then((text) => {
        const data = JSON.parse(text);
        setUnitsData(data);
        setAttacker(data[0]);
        setDefender(data[0]);
      });
  }, []);

  useEffect(() => {
    setAttackerSize(attacker?.unit_size ?? 0);
  }, [attacker]);

  useEffect(() => {
    setDefenderSize(defender?.unit_size ?? 0);
  }, [defender]);

  useEffect(() => {
    calcDamage().then((r) => r && setDamage(r));
  }, [calcDamage]);

  if (!unitsData || !damage || !attacker || !defender)
    return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
      <div className="mt-24 px-6">
        <h3 className="h3 text-center">Damage Calculator</h3>
        <div className="flex space-x-4">
          <div className="w-full">
            <h4 className="h4 text-center">Attacker</h4>
            <div className="flex space-x-4">
              <select
                className="h5 w-full rounded border-none bg-primary-50 py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
                value={attacker.name}
                onChange={(e) =>
                  setAttacker(
                    unitsData.filter((u) => u.name === e.target.value)[0]
                  )
                }
              >
                {unitsData.map((u, i) => (
                  <option value={u.name} key={i}>
                    {u.name}
                  </option>
                ))}
              </select>
              <TextField
                type="number"
                value={attackerSize + ""}
                setValue={(v) => setAttackerSize(parseInt(v))}
                label="Unit Size"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mt-4 space-y-2 border border-primary-900 p-2">
              <h5 className="h5 text-center">
                Casualties: {damage.min_casualties} to {damage.max_casualties}
              </h5>
              <h5 className="h5 text-center">
                Damage: {damage.min_damage} to {damage.max_damage}
              </h5>
              <h5 className="h5 text-center">
                Turns to Kill: {damage.min_turns_to_kill} to{" "}
                {damage.max_turns_to_kill}
              </h5>
            </div>
            <div className="flex">
              <div className="flex w-full items-center space-x-2">
                <input
                  type="checkbox"
                  id="ranged"
                  className="peer cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
                  checked={ranged}
                  onChange={() => setRanged((r) => !r)}
                  disabled={flank || charge || !attacker.ammunition}
                />
                <label
                  htmlFor="ranged"
                  className="h6 cursor-pointer peer-disabled:text-gray"
                >
                  Ranged
                </label>
              </div>
              <div className="flex w-full items-center space-x-2">
                <input
                  type="checkbox"
                  id="flank"
                  className="peer cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
                  checked={flank}
                  onChange={() => setFlank((f) => !f)}
                  disabled={ranged}
                />
                <label
                  htmlFor="flank"
                  className="h6 cursor-pointer peer-disabled:text-gray"
                >
                  Flank
                </label>
              </div>
              <div className="flex w-full items-center space-x-2">
                <input
                  type="checkbox"
                  id="charge"
                  className="peer cursor-pointer rounded transition duration-200 checked:bg-primary-600 hover:checked:bg-primary-400 focus:ring-primary-600 focus:checked:bg-primary-600"
                  checked={charge}
                  onChange={() => setCharge((c) => !c)}
                  disabled={ranged}
                />
                <label
                  htmlFor="charge"
                  className="h6 cursor-pointer peer-disabled:text-gray"
                >
                  Charge
                </label>
              </div>
              <div className="flex w-full items-center space-x-2">
                <select
                  className="h5 w-full rounded border-none bg-primary-50 py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
                  value={advantage}
                  onChange={(e) => setAdvantage(parseInt(e.target.value))}
                >
                  {[...Array(9).keys()].map((v, i) => (
                    <option value={v - 4} key={i}>
                      {v - 4}
                    </option>
                  ))}
                </select>
                <label htmlFor="advantage" className="h6 cursor-pointer">
                  Adv...
                </label>
              </div>
            </div>
          </div>
          <div className="w-full">
            <h4 className="h4 text-center">Defender</h4>
            <div className="flex space-x-4">
              <select
                className="h5 w-full rounded border-none bg-primary-50 py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
                value={defender.name}
                onChange={(e) =>
                  setDefender(
                    unitsData.filter((u) => u.name === e.target.value)[0]
                  )
                }
              >
                {unitsData.map((u, i) => (
                  <option value={u.name} key={i}>
                    {u.name}
                  </option>
                ))}
              </select>
              <TextField
                type="number"
                value={defenderSize + ""}
                setValue={(v) => setDefenderSize(parseInt(v))}
                label="Unit Size"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
