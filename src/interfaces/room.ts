import Mode from "./mode";
import User from "./user";

export default interface Room {
  id: number;
  name: string;
  mode: Mode;
  host: User;
  room_hash: string;
}
