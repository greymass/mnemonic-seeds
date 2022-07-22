/**
 * Solve for completeness.
 * @param n The number.
 * @param p The problem.
 * @param hard Set to true for super hard problem.
 * @returns The solution.
 */
import {generateMnemonic, mnemonicToSeed} from 'bip39'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'

import {BIP32Interface} from 'bip32'
import {Base58, Bytes, Checksum256, PrivateKey} from '@greymass/eosio'

import {MnemonicWords} from './types'

export class MnemonicSeed {
    private mnemonicWords: MnemonicWords

    constructor(mnemonicWords: string) {
        this.mnemonicWords = mnemonicWords
    }

    public get words(): string {
        return this.mnemonicWords
    }

    public async hex(): Promise<string> {
        const seed = await mnemonicToSeed(this.mnemonicWords)

        return seed.toString()
    }

    public static from(mnemonicWords: string): MnemonicSeed {
        return new MnemonicSeed(mnemonicWords)
    }

    public static generate(): MnemonicSeed {
        const mnemonic = generateMnemonic(256)

        return this.from(mnemonic)
    }

    public async derivePrivateKey(pathIndex = 0): Promise<PrivateKey> {
        const path = `m/44'/194'/0'/0/${pathIndex}`

        const bip32 = BIP32Factory(ecc)
        const hexSeed = await mnemonicToSeed(this.mnemonicWords)
        const node: BIP32Interface = bip32.fromSeed(hexSeed)
        const bip32Interface = node.derivePath(path)

        if (!bip32Interface?.privateKey) {
            throw new Error('Failed to derive private key')
        }

        const privateKeyBuffer = Bytes.from([0x80]).appending(
            Bytes.from(bip32Interface.privateKey!)
        )

        const checksum = dsha256Checksum(privateKeyBuffer.array)

        const eosioPrivateKey = privateKeyBuffer.appending(Bytes.from(checksum))

        return PrivateKey.from(Base58.encode(eosioPrivateKey))
    }
}

function dsha256Checksum(data: Uint8Array) {
    const round1 = Checksum256.hash(data).array
    const round2 = Checksum256.hash(round1).array
    return new Uint8Array(round2.slice(0, 4))
}
