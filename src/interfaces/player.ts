import Unit from "./unit";

export default interface Player {
  name: string;
  rating: number;
  units: Map<number, Unit>;
}
