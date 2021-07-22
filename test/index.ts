import {strict as assert} from 'assert'
import 'mocha'

import * as lib from '$lib'

suite('index', function () {
    test('maths', function () {
        assert.equal(lib.maths(1, 2), 3)
    })
})
