import Mode from "./mode";
import UnitData from "./unitData";

export default interface Army {
  name: string;
  mode: Mode;
  units: {
    unitData: UnitData;
    position: number[]; // 0 - x, 1 - y
  }[];
}
