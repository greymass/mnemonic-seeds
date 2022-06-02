import { Bytes } from "@greymass/eosio";

export type HexSeed = string;
export type MnemonicSeed = string;
export type SeedType = MnemonicSeed | HexSeed | Bytes;
