import Attribute from "./attribute";
import Keyword from "./keyword";

export default interface UnitData {
  id: number;
  name: string;
  description: string;
  faction: string | null;
  clas: string;
  cost: number;
  unit_size: number;
  hitpoints: number;
  armor: number;
  morale: number;
  speed: number;
  defense: number;
  melee_attack: number;
  melee_damage: number;
  charge_bonus: number;
  ammunition: number | null;
  range: number | null;
  ranged_attack: number | null;
  ranged_damage: number | null;
  attributes: Attribute[];
  keywords: Keyword[];
}
