import {strict as assert} from 'assert'
import 'mocha'

import * as pkg from '../src'

suite('index', function () {
    test('maths', function () {
        assert.equal(pkg.maths(1, 2), 3)
    })
})
