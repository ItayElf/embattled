import Mode from "./mode";
import Player from "./player";

export default interface Game {
  host: Player;
  joiner: Player;
  mode: Mode;
  map: string;
  is_host_turn: boolean;
  moved_unit: number | null;
  last_move: number[][] | null;
  turn_counter: number;
  ended: boolean;
  host_visible: number[][];
  joiner_visible: number[][];
}
