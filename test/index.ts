import {assert} from 'chai'

import sinon from 'sinon'

import * as lib from '$lib'

suite('MnemonicSeed', function () {
    const words = 'enrich cycle essay coast asthma shadow heavy business inject volcano era bamboo grid avoid magic fortune first toilet various grit river cash luggage fan';

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

            assert.equal(pk.toString(), 'PVT_K1_RTdDFmwdRAUNaBhhRENMeiD2PNbMtGFoVQqPd1onjNLh4xpfj')
        })

        test('with path param arguments', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const pk = await mnemonicSeed.derivePrivateKey(1)

            assert.equal(pk.toWif(), '5KPQQKP34kp8fBVGPEKcexEaMkDyWRRa71GDYtFa7uahhetC8Sc')
        })
    })
})
