import {assert} from 'chai'

import sinon from 'sinon'

import * as lib from '$lib'

suite('MnemonicSeed', function () {
    const words =
        'enrich cycle essay coast asthma shadow heavy business inject volcano era bamboo grid avoid magic fortune first toilet various grit river cash luggage fan'
    const ledgerWords =
        'choice defense mushroom pioneer crime kite flock rebel point submit treat earn play excess fence depth whip unveil easily pluck will talk brand grain'

    suiteSetup(function () {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        sinon.stub(require('bip39'), 'generateMnemonic').returns(words)
    })

    suite('generate', function () {
        test('creates a new MnemonicSeed with default coin type', function () {
            const mnemonicSeed = lib.MnemonicSeed.generate()

            assert.equal(mnemonicSeed.words, words)
        })

        test('creates a new MnemonicSeed with custom coin type', function () {
            const mnemonicSeed = lib.MnemonicSeed.generate(60)

            assert.equal(mnemonicSeed.words, words)
        })
    })

    suite('from', function () {
        test('creates a MnemonicSeed from words', function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)

            assert.equal(mnemonicSeed.words, words)
        })

        test('creates a MnemonicSeed from words with custom coin type', function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words, 60)

            assert.equal(mnemonicSeed.words, words)
        })

        test('throws error for invalid mnemonic', function () {
            assert.throws(() => {
                lib.MnemonicSeed.from('invalid mnemonic phrase')
            }, 'Invalid mnemonic phrase')
        })
    })

    suite('words', function () {
        test('returns the mnemonic words', function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)

            assert.equal(mnemonicSeed.words, words)
        })
    })

    suite('hex', function () {
        test('converts mnemonic to hex seed', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const hexSeed = await mnemonicSeed.hex()

            assert.isString(hexSeed)
            assert.match(hexSeed, /^[a-f0-9]{128}$/)
        })

        test('produces consistent hex seed for same mnemonic', async function () {
            const mnemonicSeed1 = lib.MnemonicSeed.from(words)
            const mnemonicSeed2 = lib.MnemonicSeed.from(words)
            const hex1 = await mnemonicSeed1.hex()
            const hex2 = await mnemonicSeed2.hex()

            assert.equal(hex1, hex2)
        })
    })

    suite('derivePrivateKey', function () {
        test('without path param', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const pk = await mnemonicSeed.derivePrivateKey()

            assert.equal(String(pk), 'PVT_K1_RTdDFmwdRAUNaBhhRENMeiD2PNbMtGFoVQqPd1onjNLh4xpfj')
        })

        test('with path param arguments', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const pk = await mnemonicSeed.derivePrivateKey(1)

            assert.equal(String(pk), 'PVT_K1_2a7pdvwzJF9QB6zM2siZuVT99Q4JHZVPCCSKiCpt2j4Y3AyuzD')
        })

        test('with ledger generated words', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(ledgerWords)
            const pk = await mnemonicSeed.derivePrivateKey(0)

            assert.equal(String(pk), 'PVT_K1_yLErr9adK7NzHFhcahvsZdJDVCsA3tF6iThH3s1xoy3AkSSP3')
        })
    })

    suite('deriveKeys', function () {
        test('derives both private and public keys at index 0', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const keys = await mnemonicSeed.deriveKeys(0)

            assert.isDefined(keys.privateKey)
            assert.isDefined(keys.publicKey)
            assert.equal(
                String(keys.privateKey),
                'PVT_K1_RTdDFmwdRAUNaBhhRENMeiD2PNbMtGFoVQqPd1onjNLh4xpfj'
            )
            assert.equal(
                String(keys.publicKey),
                'PUB_K1_5Dcdx1x4b4k45dMarigpDxKa6H7DixaFAt9Bf1gWkifreKEsSi'
            )
        })

        test('derives both private and public keys at index 1', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const keys = await mnemonicSeed.deriveKeys(1)

            assert.isDefined(keys.privateKey)
            assert.isDefined(keys.publicKey)
            assert.equal(
                String(keys.privateKey),
                'PVT_K1_2a7pdvwzJF9QB6zM2siZuVT99Q4JHZVPCCSKiCpt2j4Y3AyuzD'
            )
            assert.equal(
                String(keys.publicKey),
                'PUB_K1_52eMHTrVoyc5fnLHwaZZy9ewSoJUCKYgDkxhWrsTMShk6ZFydN'
            )
        })
    })

    suite('deriveOwnerKey', function () {
        test('derives owner key at index 0', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const ownerKey = await mnemonicSeed.deriveOwnerKey()

            assert.isDefined(ownerKey.privateKey)
            assert.isDefined(ownerKey.publicKey)
            assert.equal(
                String(ownerKey.privateKey),
                'PVT_K1_RTdDFmwdRAUNaBhhRENMeiD2PNbMtGFoVQqPd1onjNLh4xpfj'
            )
            assert.equal(
                String(ownerKey.publicKey),
                'PUB_K1_5Dcdx1x4b4k45dMarigpDxKa6H7DixaFAt9Bf1gWkifreKEsSi'
            )
        })
    })

    suite('deriveActiveKey', function () {
        test('derives active key at index 1', async function () {
            const mnemonicSeed = lib.MnemonicSeed.from(words)
            const activeKey = await mnemonicSeed.deriveActiveKey()

            assert.isDefined(activeKey.privateKey)
            assert.isDefined(activeKey.publicKey)
            assert.equal(
                String(activeKey.privateKey),
                'PVT_K1_2a7pdvwzJF9QB6zM2siZuVT99Q4JHZVPCCSKiCpt2j4Y3AyuzD'
            )
            assert.equal(
                String(activeKey.publicKey),
                'PUB_K1_52eMHTrVoyc5fnLHwaZZy9ewSoJUCKYgDkxhWrsTMShk6ZFydN'
            )
        })
    })
})
