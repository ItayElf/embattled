import Unit from "./unit";

export default interface Player {
  name: string;
  rating: number;
  army: { [key: number]: Unit };
  faction: string;
}
