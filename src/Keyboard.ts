import { Key } from 'ts-keycode-enum'

type KeyCombo = Array<Key>

export class Keyboard {
  private mapCombosToHandlers = new Map<number[], Function[]>();
  private pressedKeys = new Set<Key>();

  constructor(
      private domNode: Element | Document
  ) {
      this.startListening()
  }

  on(keys: Key[] | KeyCombo[], callback: Function) {
      const combos = this.toCombos(keys)

      combos.forEach(combo => {
          this.registerComboCallback(combo, callback)
      })
  }

  startListening() {
      this.domNode.addEventListener('keydown', this.handleKeyDown)
      this.domNode.addEventListener('keyup', this.handleKeyUp)
  }

  stopListening() {
      this.domNode.removeEventListener('keydown', this.handleKeyDown)
      this.domNode.removeEventListener('keyup', this.handleKeyUp)
  }

  clear() {
      this.stopListening()
      this.mapCombosToHandlers.clear()
      this.pressedKeys.clear()
  }

  private handleKeyDown = (event: any) => {
      this.pressedKeys.add(event.keyCode)

      this.mapCombosToHandlers.forEach((handlers, combo) => {
          if (this.isComboPressed(combo)) {
              handlers.forEach(handler => handler())
          }
      })
  }

  private handleKeyUp = (event: any) => {
      this.pressedKeys.delete(event.keyCode)
  }

  private isComboPressed(combo: number[]) {
      let result = true

      combo.forEach(key => {
          if (!this.pressedKeys.has(key)) {
              result = false
          }
      })

      return result
  }

  private registerComboCallback(combo: Array<Key>, callback: Function) {
      if (!this.mapCombosToHandlers.has(combo)) {
          this.mapCombosToHandlers.set(combo, [])
      }

      const handlers = this.mapCombosToHandlers.get(combo)

      handlers!.push(callback)
  }

  private toCombos(keys: KeyCombo[] | Key[]) {
      if (keys.length === 0) {
          return []
      }

      const isKeys = !Array.isArray(keys[0])
      let combos: KeyCombo[] = []

      if (isKeys) {
          combos = (keys as Key[]).map(key => [key])
      } else {
          combos = keys as KeyCombo[]
          combos = combos.filter(combo => combo.length > 0)
      }

      return combos
  }
}
