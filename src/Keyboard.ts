import { hashCombo, toCombos } from './utils'
import { Key } from './key'

import type { Handler, KeyCombo } from './types'

/**
 * Converts CMD keys to a special key code, otherwise returns unchanged key code
 */
const convertKeyCode = (keyCode: number) => {
    const isCmdKey = keyCode === 91 || keyCode === 93

    if (isCmdKey) {
        return Key.Cmd
    } else {
        return keyCode
    }
}

/**
 * Keyboard shortcut manager for listening to key combos, such as ```Ctrl + Z```.
 */
export class Keyboard {
    private mapComboToHandlers = new Map<string, Handler[]>()
    private pressedKeys = new Set<Key>()
    private isPaused = false

    constructor(
        private domNode: Element | Document
    ) {
        this.startListening()
    }

    /**
     * Add a listener to one keyboard combo or multiple combos
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
     * Unpause listening to key combos after `this.pause()`
     */
    unpause() {
        this.isPaused = false
    }

    /**
     * Temporarily pause listening to key combos
     */
    pause() {
        this.isPaused = true
    }

    /**
     * Remove all listeners
     */
    clear() {
        this.stopListening()
        this.mapComboToHandlers.clear()
        this.pressedKeys.clear()
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.pressedKeys.add(convertKeyCode(event.keyCode))

        if (!this.isPaused) {
            this.triggerCombo(event)
        }
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.pressedKeys.delete(convertKeyCode(event.keyCode))
    }

    private getPressedCombo(): KeyCombo {
        return Array.from(this.pressedKeys.values())
    }

    private registerComboCallback(combo: KeyCombo, callback: Handler) {
        const hash = hashCombo(combo)

        if (!this.mapComboToHandlers.has(hash)) {
            this.mapComboToHandlers.set(hash, [])
        }

        const handlers = this.mapComboToHandlers.get(hash)

        handlers!.push(callback)
    }

    private triggerCombo(event: KeyboardEvent) {
        const combo = this.getPressedCombo()
        const hash = hashCombo(combo)

        const handlers = this.mapComboToHandlers.get(hash) ?? []
        handlers.forEach(handler => handler(event))
    }

    private startListening() {
        this.domNode.addEventListener('keydown', this.handleKeyDown)
        this.domNode.addEventListener('keyup', this.handleKeyUp)
    }

    private stopListening() {
        this.domNode.removeEventListener('keydown', this.handleKeyDown)
        this.domNode.removeEventListener('keyup', this.handleKeyUp)
    }
}
