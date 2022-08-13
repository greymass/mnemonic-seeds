PACKAGE
=======

Greymass TypeScript library template, intended for libraries that work in any JavaScript context (node.js, Browser, React native), `@types/node` are installed only for tests, don't rely on any node.js types or imports inside `src/` (no `buffer`, `crypto` imports etc, they can be filled for browser but will bloat the bundle 100x)

## Installation

The `@greymass/mnemonic-seeds` package is distributed as a module on [npm](https://www.npmjs.com/package/PACKAGE).

```
yarn add @greymass/mnemonic-seeds
# or
npm install --save @greymass/mnemonic-seeds
```

## Usage

```
 import { MnemonicSeeds } from '@greymass/mnemonic-seeds';
 
 const mnemonicSeed = MnemonicSeed.generate();
 const words = mnemonicSeed.words;
 
 const mnemonicSeedAtLaterDate = mnemonicSeed.from(words);
 const derivedPk = await mnemonicSeedAtLaterDate.derivePrivateKey('m/0/1/1');
 
 console.log(derivedPk.toString());
 // 'PVT_K1_4MwSem1F7gB7srwdJEZRsyDC5NzvSrcWqbkKFpHBaEQMHLMADbe'
```
## Developing

You need [Make](https://www.gnu.org/software/make/), [node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Clone the repository and run `make` to checkout all dependencies and build the project. See the [Makefile](./Makefile) for other useful targets. Before submitting a pull request make sure to run `make lint`.

---

Made with ☕️ & ❤️ by [Greymass](https://greymass.com), if you find this useful please consider [supporting us](https://greymass.com/support-us).
