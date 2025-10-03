import {generateMnemonic, mnemonicToSeed, validateMnemonic} from 'bip39'
import {HDKey} from '@scure/bip32'

import {Bytes, KeyType, PrivateKey, PublicKey} from '@wharfkit/antelope'

import {MnemonicWords} from './types'

// Antelope derivation path for BIP44 (coin type 194)
const ANTELOPE_COIN_TYPE = 194

export class MnemonicSeed {
    private mnemonicWords: MnemonicWords

    constructor(mnemonicWords: string) {
        if (!validateMnemonic(mnemonicWords)) {
            throw new Error('Invalid mnemonic phrase')
        }
        this.mnemonicWords = mnemonicWords
    }

    public get words(): string {
        return this.mnemonicWords
    }

    public async hex(): Promise<string> {
        const seed = await mnemonicToSeed(this.mnemonicWords)

        return seed.toString('hex')
    }

    public static from(mnemonicWords: string): MnemonicSeed {
        return new MnemonicSeed(mnemonicWords)
    }

    /**
     * Generates a new 12-word BIP39 mnemonic (128 bits)
     * Compatible with MetaMask and other standard wallet implementations
     */
    public static generate(): MnemonicSeed {
        const mnemonic = generateMnemonic(128) // 128 bits = 12 words

        return this.from(mnemonic)
    }

    /**
     * Derives a private key from the mnemonic using BIP44 derivation path
     * Path format: m/44'/194'/0'/0/{pathIndex}
     *
     * @param pathIndex The index in the derivation path (default: 0)
     * @returns The derived PrivateKey
     */
    public async derivePrivateKey(pathIndex = 0): Promise<PrivateKey> {
        const path = `m/44'/${ANTELOPE_COIN_TYPE}'/0'/0/${pathIndex}`

        const seed = await mnemonicToSeed(this.mnemonicWords)
        const hdKey = HDKey.fromMasterSeed(Uint8Array.from(seed))
        const derivedKey = hdKey.derive(path)

        if (!derivedKey.privateKey) {
            throw new Error('Failed to derive private key')
        }

        return new PrivateKey(KeyType.K1, Bytes.from(derivedKey.privateKey))
    }

    /**
     * Derives both private and public keys from the mnemonic
     *
     * @param pathIndex The index in the derivation path (default: 0)
     * @returns Object containing privateKey and publicKey
     */
    public async deriveKeys(
        pathIndex = 0
    ): Promise<{privateKey: PrivateKey; publicKey: PublicKey}> {
        const privateKey = await this.derivePrivateKey(pathIndex)
        const publicKey = privateKey.toPublic()

        return {
            privateKey,
            publicKey,
        }
    }

    /**
     * Derives the owner key (index 0) from the mnemonic
     * Standard convention: owner key is at index 0
     *
     * @returns Object containing privateKey and publicKey
     */
    public async deriveOwnerKey(): Promise<{privateKey: PrivateKey; publicKey: PublicKey}> {
        return this.deriveKeys(0)
    }

    /**
     * Derives the active key (index 1) from the mnemonic
     * Standard convention: active key is at index 1
     *
     * @returns Object containing privateKey and publicKey
     */
    public async deriveActiveKey(): Promise<{privateKey: PrivateKey; publicKey: PublicKey}> {
        return this.deriveKeys(1)
    }
}
