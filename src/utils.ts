import type { KeyCombo } from './types'

const toCombos = (keys: KeyCombo | KeyCombo[]): KeyCombo[] => {
    if (keys.length === 0) {
        return []
    }

    const isSingleCombo = !Array.isArray(keys[0])

    if (isSingleCombo) {
        return [keys as KeyCombo]
    }

    return keys as KeyCombo[]
}

const comparerAcsNumber = (a, b) => {
    return a - b
}

const hashCombo = (combo: KeyCombo) => {
    return combo.sort(comparerAcsNumber).join(',')
}

export { hashCombo, toCombos }
