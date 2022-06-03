import {assert} from 'chai'

import sinon from 'sinon'

import * as lib from '$lib'

suite('MnemonicSeed', function () {
    const words = 'east member flee syrup naive uncover feature aim pitch sight awful weather';

    suiteSetup(function () {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        sinon.stub(require('bip39'), 'generateMnemonic').returns(words)
    })

    test('generate', function () {
        const mnemonicSeed = lib.MnemonicSeed.generate();

        assert.equal(mnemonicSeed.words, words)
    })

    suite('derivePrivateKey', function () {
        test('without path param', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const pk = await mnemonicSeed.derivePrivateKey()

            assert.equal(pk.toString(), 'PVT_K1_4MwSem1F7gB7srwdJEZRsyDC5NzvSrcWqbkKFpHBaEQMHLMADbe')
        })

        test('with path param arguments', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const pk = await mnemonicSeed.derivePrivateKey('m/0/1/1')

            assert.equal(pk.toWif(), 'L3Lno4hwJJGkB9gtPyaNpbinNFbwSTch78ZBEfkaFhewzGXQEEjK')
        })
    })
})
