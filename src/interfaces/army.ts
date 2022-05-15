import Mode from "./mode";

export default interface Army {
  name: string;
  mode: Mode;
  units: {
    name: string;
    position: number[]; // 0 - x, 1 - y
  }[];
}
