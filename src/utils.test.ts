import { Key } from './key'

import { hashCombo, toCombos } from './utils'

import type { KeyCombo } from './types'

describe('utils', () => {
    describe('hash combo', () => {
        it('long combo 1', () => {
            const combo: KeyCombo = [30, 1, 22]
            const result = hashCombo(combo)

            expect(result).toBe('1,22,30')
        })

        it('long combo 2', () => {
            const combo: KeyCombo = [2, 7, 10]
            const result = hashCombo(combo)

            expect(result).toBe('2,7,10')
        })

        it('short combo', () => {
            const combo: KeyCombo = [1]
            const result = hashCombo(combo)

            expect(result).toBe('1')
        })
    })

    describe('can convert one or multiple combos to a uniform array of combos', () => {
        it('single combo', () => {
            const result = toCombos([Key.A, Key.Space])

            expect(result).toEqual([[Key.A, Key.Space]])
        })

        it('multiple combos', () => {
            const result = toCombos([[Key.A, Key.Space], [Key.B, Key.Space]])

            expect(result).toEqual([[Key.A, Key.Space], [Key.B, Key.Space]])
        })
    })
})
