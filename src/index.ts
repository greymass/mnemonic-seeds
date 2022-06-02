/**
 * Solve for completeness.
 * @param n The number.
 * @param p The problem.
 * @param hard Set to true for super hard problem.
 * @returns The solution.
 */
import bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

import { BIP32Interface } from 'bip32';
import {Bytes, PrivateKey} from '@greymass/eosio';

import { SeedType, HexSeed } from "./types";

export class MnemonicSeed {
    private mnemonicWords: HexSeed;

    constructor(mnemonicWords: string) {
        this.mnemonicWords = mnemonicWords;
    }

    public get words(): string {
        return this.mnemonicWords;
    }

    public get hex(): Promise<string> {
        return new Promise(resolve => {
            bip39.mnemonicToSeed(this.mnemonicWords, "").then(seed => {
                resolve(seed.toString('hex'));
            });
        });
    }

    public static from(mnemonicWords: string): MnemonicSeed {
        return new MnemonicSeed(mnemonicWords);
    }

    public static generate(): MnemonicSeed {
        const mnemonic = bip39.generateMnemonic();

        return this.from(mnemonic);
    }

    public derivePrivateKey(path = 'm/0/0') {
        // You must wrap a tiny-secp256k1 compatible implementation
        const bip32 = BIP32Factory(ecc);

        const node: BIP32Interface = bip32.fromSeed(Buffer.from(this.hexSeed));

        const bip32Interface = node.derivePath(path)

        return PrivateKey.from(bip32Interface.toWIF());
    }
}
