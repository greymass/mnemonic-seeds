# @greymass/mnemonic-seeds

A TypeScript library for generating BIP39 mnemonic phrases and deriving Antelope (EOSIO) keys using BIP44 derivation paths. Compatible with any JavaScript environment (Node.js, Browser, React Native).

## Installation

The `@greymass/mnemonic-seeds` package is distributed as a module on [npm](https://www.npmjs.com/package/PACKAGE).

```
yarn add @greymass/mnemonic-seeds
# or
npm install --save @greymass/mnemonic-seeds
```

## Usage

```
import {MnemonicSeed} from '@greymass/mnemonic-seeds'

const mnemonicSeed = MnemonicSeed.generate()
const words = mnemonicSeed.words

const mnemonicSeedAtLaterDate = MnemonicSeed.from(words)

// Derive master keys
const {publicKey: masterPublicKey} = await mnemonicSeedAtLaterDate.deriveMasterKeys()

// Convenience helper when you only need the master public key
const masterPublicKeyAlt = await mnemonicSeedAtLaterDate.deriveMasterPublicKey()

// Derive individual public keys from the master public key
const pubKey5 = MnemonicSeed.deriveFromMasterPublicKey(masterPublicKey, 5)

// Derive a full keypair at a specific index
const {privateKey, publicKey: derivedPublicKey} = await mnemonicSeedAtLaterDate.deriveKeys(1)

console.log(String(privateKey))
// 'PVT_K1_RTdDFmwdRAUNaBhhRENMeiD2PNbMtGFoVQqPd1onjNLh4xpfj'

console.log(String(publicKey))
// 'PUB_K1_5Dcdx1x4b4k45dMarigpDxKa6H7DixaFAt9Bf1gWkifreKEsSi'
```

## Developing

You need [Make](https://www.gnu.org/software/make/), [node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Clone the repository and run `make` to checkout all dependencies and build the project. See the [Makefile](./Makefile) for other useful targets. Before submitting a pull request make sure to run `make lint`.

---

Made with ☕️ & ❤️ by [Greymass](https://greymass.com), if you find this useful please consider [supporting us](https://greymass.com/support-us).
