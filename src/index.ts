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
import {PrivateKey, Bytes, Checksum256, Base58} from '@greymass/eosio'
import hash, {sha256} from 'hash.js'

import {MnemonicWords} from './types'

export class MnemonicSeed {
    private mnemonicWords: MnemonicWords

    constructor(mnemonicWords: string) {
        this.mnemonicWords = mnemonicWords
    }

    public get words(): string {
        return this.mnemonicWords
    }

    public get hex(): Promise<string> {
        return new Promise((resolve, reject) => {
            mnemonicToSeed(this.mnemonicWords).then((seed) => {
                resolve(seed.toString('hex'))
            }).catch((err) => {
                reject(err)
            })
        })
    }

    public static from(mnemonicWords: string): MnemonicSeed {
        return new MnemonicSeed(mnemonicWords)
    }

    public static generate(): MnemonicSeed {
        const mnemonic = generateMnemonic(256)

        return this.from(mnemonic)
    }

    public async derivePrivateKey(pathIndex = 0): Promise<PrivateKey> {
        const path = `m/44/194/0/${pathIndex}/0`

        const bip32 = BIP32Factory(ecc)
        const hexSeed = await mnemonicToSeed(this.mnemonicWords)
        const node: BIP32Interface = bip32.fromSeed(hexSeed)
        const bip32Interface = node.derivePath(path)

        // @ts-ignore
        const privateKeyBuffer = Bytes.from([0x80]).appending(bip32Interface.privateKey)

        const checksum = dsha256Checksum(privateKeyBuffer.array)

        const eosioPrivateKey = privateKeyBuffer.appending(Bytes.from(checksum))

        return PrivateKey.from(Base58.encode(eosioPrivateKey))
    }
}

function dsha256Checksum(data: Uint8Array) {
    const round1 = sha256().update(data).digest()
    const round2 = sha256().update(round1).digest()
    return new Uint8Array(round2.slice(0, 4))
}
