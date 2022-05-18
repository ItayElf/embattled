import Attribute from "./attribute";

export default interface Unit {
  name: string;
  clas: string;
  cost: number;
  unit_size_max: number;
  unit_size: number;
  hitpoints: number;
  armor: number;
  morale_max: number;
  morale: number;
  speed: number;
  defense: number;
  melee_attack: number;
  melee_damage: number;
  charge_bonus: number;
  ammunition_max: number | null;
  ammunition: number | null;
  range: number | null;
  ranged_attack: number | null;
  ranged_damage: number | null;
  attributes: Attribute[];
  keywords: string[];
  position: number[];
  activated: boolean;
}
