import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Category, Language, Provider, Role } from "./enums";

export type file = {
    id: Generated<number>;
    title: string;
    description: string;
    category: Category;
    language: Language;
    provider: Provider;
    role: Role;
    file_reference: string;
};
export type DB = {
    file: file;
};
