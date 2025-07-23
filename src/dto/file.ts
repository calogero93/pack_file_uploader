import { Insertable, Selectable } from "kysely";
import { file } from "../db/schema";

export type NewFile = Insertable<Omit<file, "id">>;
export type File = Selectable<file>;
