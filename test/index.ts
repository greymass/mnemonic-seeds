import {assert} from 'chai'

import * as lib from '$lib'

suite('MnemonicSeed', function () {
    test('generateWords', function () {
        const mnemonicSeed = lib.MnemonicSeed.generate();

        console.log({mnemonicSeed})
        assert.equal(mnemonicSeed.mnemonic, 'test, dog, cat, tree, sun, moon, star, star, sun, tree, cat, dog, test')
    })
})
