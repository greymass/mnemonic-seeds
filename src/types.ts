import {Bytes} from '@wharfkit/antelope'

export type HexSeed = string
export type MnemonicWords = string
export type SeedType = MnemonicWords | HexSeed | Bytes

export interface MasterExtendedKeys {
    privateExtendedKey: string
    publicExtendedKey: string
}
