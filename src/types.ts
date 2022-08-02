import { Key } from 'ts-keycode-enum'

type KeyCombo = Key[]

/**
 * @param {KeyboardEvent} event - pressed key event, in case of multi-key combos
 *  the last pressed key event is passed to this handler
 */
type Handler = (event: KeyboardEvent) => void

export type {
    Key,
    KeyCombo,
    Handler,
}
