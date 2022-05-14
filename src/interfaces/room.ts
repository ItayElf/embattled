import { Mode } from "fs";
import User from "./user";

export default interface Room {
  id: number;
  name: string;
  mode: Mode;
  host: User;
  room_hash: string;
}
