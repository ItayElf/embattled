import Mode from "./mode";
import Player from "./player";

export default interface Game {
  host: Player;
  joiner: Player;
  mode: Mode;
}
