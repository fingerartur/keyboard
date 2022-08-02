import { Key } from 'ts-keycode-enum'

type KeyCombo = Key[]

/**
 * @param {KeyboardEvent} event - pressed key event, in case of multi-key combos
 *  the last pressed key event is passed to this handler
 */
type Handler = (event: KeyboardEvent) => void

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

/**
 * Keyboard shortcut manager capable of listening to key combos
 */
export class Keyboard {
    private mapCombosToHandlers = new Map<number[], Handler[]>()
    private pressedKeys = new Set<Key>()

    constructor(
        private domNode: Element | Document
    ) {
        this.startListening()
    }

    /**
     * Add a listener to keyboard combo or multiple combos
     *
     * @param keys keyboard combo or multiple combos
     * @param callback callback triggered when the combo, or one of the combos if more are specified is pressed. This callback
     *   receives the KeyBoard event triggered by the last key of the combo (the one which was pressed last)
     */
    on(keys: KeyCombo | KeyCombo[], callback: Handler) {
        const combos = toCombos(keys)

        combos.forEach(combo => {
            this.registerComboCallback(combo, callback)
        })
    }

    /**
     * Start listening to key events again after `this.stopListening()`
     */
    startListening() {
        this.domNode.addEventListener('keydown', this.handleKeyDown)
        this.domNode.addEventListener('keyup', this.handleKeyUp)
    }

    /**
     * Temporarily stop listening to any key events
     */
    stopListening() {
        this.domNode.removeEventListener('keydown', this.handleKeyDown)
        this.domNode.removeEventListener('keyup', this.handleKeyUp)
    }

    /**
     * Remove all listeners
     */
    clear() {
        this.stopListening()
        this.mapCombosToHandlers.clear()
        this.pressedKeys.clear()
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.pressedKeys.add(event.keyCode)

        this.mapCombosToHandlers.forEach((handlers, combo) => {
            if (this.isComboPressed(combo)) {
                handlers.forEach(handler => handler(event))
            }
        })
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.pressedKeys.delete(event.keyCode)
    }

    private isComboPressed(combo: KeyCombo) {
        return combo.every(key => this.isKeyPressed(key))
    }

    private isKeyPressed(key: Key) {
        return this.pressedKeys.has(key)
    }

    private registerComboCallback(combo: KeyCombo, callback: Handler) {
        if (!this.mapCombosToHandlers.has(combo)) {
            this.mapCombosToHandlers.set(combo, [])
        }

        const handlers = this.mapCombosToHandlers.get(combo)

        handlers!.push(callback)
    }
}
