import {generateMnemonic, mnemonicToSeed, validateMnemonic} from 'bip39'
import {HDKey} from '@scure/bip32'

import {Bytes, KeyType, PrivateKey, PublicKey} from '@wharfkit/antelope'

import {MasterExtendedKeys, MnemonicWords} from './types'

// Antelope derivation path for BIP44 (coin type 194)
const ANTELOPE_COIN_TYPE = 194

export class MnemonicSeed {
    private mnemonicWords: MnemonicWords
    private coinType: number

    constructor(mnemonicWords: string, coinType: number = ANTELOPE_COIN_TYPE) {
        if (!validateMnemonic(mnemonicWords)) {
            throw new Error('Invalid mnemonic phrase')
        }
        this.mnemonicWords = mnemonicWords
        this.coinType = coinType
    }

    public get words(): string {
        return this.mnemonicWords
    }

    public async hex(): Promise<string> {
        const seed = await mnemonicToSeed(this.mnemonicWords)

        return seed.toString('hex')
    }

    public static from(mnemonicWords: string, coinType?: number): MnemonicSeed {
        return new MnemonicSeed(mnemonicWords, coinType)
    }

    /**
     * Generates a new 12-word BIP39 mnemonic (128 bits)
     * Compatible with MetaMask and other standard wallet implementations
     */
    public static generate(coinType?: number): MnemonicSeed {
        const mnemonic = generateMnemonic(128) // 128 bits = 12 words

        return this.from(mnemonic, coinType)
    }

    /**
     * Derives a private key from the mnemonic using BIP44 derivation path
     * Path format: m/44'/{coinType}'/0'/0/{pathIndex}
     *
     * @param pathIndex The index in the derivation path (default: 0)
     * @returns The derived PrivateKey
     */
    private async deriveRootKey(): Promise<HDKey> {
        const seed = await mnemonicToSeed(this.mnemonicWords)
        const hdKey = HDKey.fromMasterSeed(Uint8Array.from(seed))
        return hdKey
    }

    private getDerivationPath(change: number): string {
        return `m/44'/${this.coinType}'/0'/${change}`
    }

    private getKeyDerivationPath(pathIndex: number, change: number): string {
        return `${this.getDerivationPath(change)}/${pathIndex}`
    }

    private async derivePathKey(change = 0): Promise<HDKey> {
        const accountKey = (await this.deriveRootKey()).derive(this.getDerivationPath(change))
        if (!accountKey.privateExtendedKey || !accountKey.publicExtendedKey) {
            throw new Error('Failed to derive account key')
        }
        return accountKey
    }

    public async deriveMasterKeys(change = 0): Promise<MasterExtendedKeys> {
        const pathKey = await this.derivePathKey(change)

        if (!pathKey.privateExtendedKey || !pathKey.publicExtendedKey) {
            throw new Error('Failed to derive master key')
        }

        return {
            privateExtendedKey: pathKey.privateExtendedKey,
            publicExtendedKey: pathKey.publicExtendedKey,
        }
    }

    public async deriveMasterPublicKey(change = 0): Promise<string> {
        const keys = await this.deriveMasterKeys(change)
        return keys.publicExtendedKey
    }

    public async derivePrivateKey(pathIndex = 0, change = 0): Promise<PrivateKey> {
        const path = this.getKeyDerivationPath(pathIndex, change)

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
        pathIndex = 0,
        change = 0
    ): Promise<{privateKey: PrivateKey; publicKey: PublicKey}> {
        const privateKey = await this.derivePrivateKey(pathIndex, change)
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

    public static deriveFromMasterPublicKey(masterExtendedKey: string, index: number): PublicKey {
        const masterHDKey = HDKey.fromExtendedKey(masterExtendedKey)
        const childKey = masterHDKey.deriveChild(index)

        if (!childKey.publicKey) {
            throw new Error('Failed to derive public key from master extended key')
        }

        return new PublicKey(KeyType.K1, Bytes.from(childKey.publicKey))
    }
}
