import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArmyViewer from "../components/armyViewer";
import Header from "../components/header";
import Loading from "../components/loading";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";
import UnitDataViewer from "../components/unitDataViewer";
import { BASE_API } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import Army, { ArmyUnit } from "../interfaces/army";
import UnitData from "../interfaces/unitData";
import { getFetch } from "../utils/fetchUtils";
import { getFaction } from "./armybuilderHome";

export default function UnitEditor() {
  const user = useCurrentUser(false);
  const { name } = useParams();
  const [unitsData, setUnitsData] = useState<UnitData[] | null>(null);
  const armies = JSON.parse(localStorage.getItem("armies") ?? "[]") as Army[];
  const armiesFiltered = armies.filter((a) => a.name === name);
  const army = armiesFiltered[0];
  const [units, setUnits] = useState(
    army.units.length === 0
      ? [
          {
            name: "",
            cost: 0,
            position: [army.mode.board_size - 1, army.mode.board_size - 1],
            faction: null,
            clas: "",
          },
        ]
      : army.units
  );
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [selectedUnitData, setSelectedUnitData] = useState<UnitData | null>(
    null
  );
  const navigate = useNavigate();

  const filteredUnits = units.filter((u) => u.name !== "" && u.cost !== 0);

  useEffect(() => {
    getFetch(BASE_API + "units")
      .then((res) => res.text())
      .then((text) => setUnitsData(JSON.parse(text)));
  }, []);

  const save = useCallback(() => {
    localStorage.setItem(
      "armies",
      JSON.stringify(
        armies.map((a) => (a.name === army.name ? { ...army, units } : a))
      )
    );
    navigate(`/army/${army.name}`);
  }, [armies, army, navigate, units]);

  const onChangeUnit = useCallback(
    (unit: ArmyUnit) => {
      if (unit.cost === 0 && unitsData) {
        const filtered = unitsData.filter(
          (u) => u.name.toLocaleLowerCase() === unit.name.toLocaleLowerCase()
        );
        if (filtered.length === 1) {
          unit.faction = filtered[0].faction;
          unit.cost = filtered[0].cost;
          unit.name = filtered[0].name;
        }
      }
      setUnits((u) => u.map((u, i) => (i === selectedUnit ? unit : u)));
    },
    [selectedUnit, unitsData]
  );

  const onDelete = useCallback(() => {
    const us = units.filter((_, i) => i !== selectedUnit);
    if (us.length === 0)
      us.push({
        name: "",
        cost: 0,
        position: [army.mode.board_size - 1, army.mode.board_size - 1],
        faction: null,
        clas: "",
      });
    setUnits(us);
    setSelectedUnit((v) => (us.length === 1 ? 0 : v - 1));
  }, [selectedUnit, units, army.mode.board_size]);

  const onAdd = useCallback(() => {
    setUnits((u) => [
      ...u,
      {
        name: "",
        cost: 0,
        position: [army.mode.board_size - 1, army.mode.board_size - 1],
        faction: null,
        clas: "",
      },
    ]);
    setSelectedUnit(units.length);
  }, [units.length, army.mode.board_size]);

  if (!unitsData) return <Loading className="h-screen" />;

  return (
    <>
      <Header user={user} />
      <div className="mt-24 flex px-6">
        <div className="flex w-full">
          <div className="w-24">
            <div className="w-24 divide-y divide-primary-900 overflow-hidden rounded-l">
              {units.map((u, i) => (
                <PrimaryButton
                  className={`caption lg:s2 w-24 rounded-none px-3 py-5 disabled:bg-primary-400`}
                  key={i}
                  onClick={() => setSelectedUnit(i)}
                  disabled={i === selectedUnit}
                >
                  {!!u.name ? u.name : "New Unit"} (#{i + 1})
                </PrimaryButton>
              ))}
              <PrimaryButton
                className="s2 lg:h6 w-24 rounded-none px-3 py-5"
                onClick={onAdd}
              >
                +
              </PrimaryButton>
            </div>
            <PrimaryButton
              className="caption lg:s1 mt-4"
              onClick={save}
              disabled={filteredUnits.length === 0}
            >
              Save Units
            </PrimaryButton>
          </div>
          <UnitDataArea
            unit={units[selectedUnit]}
            unitsData={unitsData}
            boardSize={army.mode.board_size}
            onChangeUnit={onChangeUnit}
            onDelete={onDelete}
            onViewUnit={setSelectedUnitData}
            faction={getFaction(units)}
            className="w-full"
          />
        </div>
        <div className="relative">
          <ArmyViewer
            mode={army.mode}
            faction={getFaction(filteredUnits)}
            units={filteredUnits}
          />
          <UnitDataViewer
            unitData={selectedUnitData}
            onClose={() => setSelectedUnitData(null)}
            className="absolute inset-0"
          />
        </div>
      </div>
    </>
  );
}

interface Props {
  unit: ArmyUnit;
  unitsData: UnitData[];
  className?: string;
  boardSize: number;
  onChangeUnit: (unit: ArmyUnit) => void;
  onViewUnit: (unit: UnitData) => void;
  onDelete: () => void;
  faction: string | null;
}

const UnitDataArea: React.FC<Props> = ({
  unit,
  unitsData,
  className,
  boardSize,
  onChangeUnit,
  onViewUnit,
  onDelete,
  faction,
}) => {
  const [selectedName, setSelectedName] = useState(unit.name);
  const [selectedX, setSelectedX] = useState(unit.position[0] + "");
  const [selectedY, setSelectedY] = useState(unit.position[1] + "");

  useEffect(() => {
    setSelectedName(unit.name);
    setSelectedX(unit.position[0] + "");
    setSelectedY(unit.position[1] + "");
  }, [unit]);

  const filteredData = unitsData.filter((u) => {
    let res = u.name.includes(selectedName);
    if (faction !== "Mercenaries") {
      res = res && (u.faction === faction || u.faction === null);
    }
    return res;
  });

  return (
    <div className={`h-min border border-primary-600 ${className}`}>
      <div className={`space-y-3 bg-primary-50 py-6 px-4`}>
        <div className="flex space-x-2">
          <TextField
            type="text"
            label="Unit Name"
            value={selectedName}
            setValue={(v) => {
              setSelectedName(v);
              onChangeUnit({ ...unit, name: v });
            }}
            className="bg-white"
            wrapperClassName="w-full"
          />
          <PrimaryButton className="s1 lg:h5" onClick={onDelete}>
            Delete
          </PrimaryButton>
        </div>
        <div className="flex justify-between space-x-4">
          <select
            className=" s1 lg:h5 rounded border-none bg-white py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
            value={selectedX}
            onChange={(e) => {
              setSelectedX(e.target.value);
              onChangeUnit({
                ...unit,
                position: [parseInt(e.target.value), unit.position[1]],
              });
            }}
          >
            {[...Array(boardSize).keys()].map((i) => (
              <option value={i + ""} key={i}>
                {String.fromCharCode(65 + i)}
              </option>
            ))}
          </select>
          <select
            className="s1 lg:h5 rounded border-none bg-white py-3 font-ptsans focus:border-0 focus:ring-0 focus:ring-offset-0"
            value={selectedY}
            onChange={(e) => {
              setSelectedY(e.target.value);
              onChangeUnit({
                ...unit,
                position: [unit.position[0], parseInt(e.target.value)],
              });
            }}
          >
            {[...Array(boardSize / 4).keys()].map((i) => (
              <option value={boardSize - i - 1 + ""} key={i}>
                {i + 1}
              </option>
            ))}
          </select>
          <TextField
            type="text"
            label="Faction"
            value={unit.faction ?? "Mercenaries"}
            setValue={() => {}}
            disabled
            className="bg-white"
          />
          <TextField
            type="text"
            label="Cost"
            value={unit.cost + ""}
            setValue={() => {}}
            disabled
            className="bg-white"
          />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="caption lg:s1 bg-primary-600 text-white">
            <td className="py-2 pl-6">Name</td>
            <td className="py-2">Faction</td>
            <td className="py-2">Class</td>
            <td className="py-2">Cost</td>
            <td className="py-2">Ranged</td>
            <td className="py-2">More</td>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((u, i) => (
            <tr
              key={i}
              className={`caption lg:s1 ${
                i % 2 === 0 ? "bg-primary-50" : "bg-primary-100"
              }`}
            >
              <td
                className="cursor-pointer py-2 pl-6"
                onClick={() => {
                  setSelectedName(u.name);
                  onChangeUnit({
                    ...unit,
                    name: u.name,
                    cost: u.cost,
                    faction: u.faction,
                    clas: u.clas,
                  });
                }}
              >
                {u.name}
              </td>
              <td className="py-2">{u.faction ?? "Mercenaries"}</td>
              <td className="py-2">
                {u.clas
                  .split(" ")
                  .map((t) => t[0].toUpperCase())
                  .join(".")}
              </td>
              <td className="py-2">{u.cost}</td>
              <td className="py-2">{u.range === null ? "No" : "Yes"}</td>
              <td
                className="cursor-pointer py-2 text-primary-900 underline"
                onClick={() => onViewUnit(u)}
              >
                View
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
