import Mode from "./mode";

export default interface Army {
  name: string;
  mode: Mode;
  units: ArmyUnit[];
}

export interface ArmyUnit {
  name: string;
  position: number[]; // 0 - x, 1 - y
  cost: number;
  faction: string;
}
