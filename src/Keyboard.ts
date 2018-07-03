import { Key } from 'ts-keycode-enum';

export class Keyboard {
  private mapCombosToHandlers = new Map<number[], Function[]>();
  private pressedKeys = new Set<Key>();

  constructor(
    private domNode: Element
  ) {
    this.startListening();
  }

  on(keys: Array<Key> | Array<Array<Key>>, callback: Function, preventDefault: boolean = true): void {
    if (keys.length === 0) {
      throw new Error('bad usage: keys cannot be empty');
    }

    if (keys.length > 0) {
      if (typeof keys[0] === 'number') {
        keys = [keys as Array<Key>];
      } else {
        keys = keys as Array<Array<Key>>;
        keys.forEach(combo => {
          if (combo.length === 0) {
            throw new Error('bad usage: combo cannot be empty');
          }
        });
      }
    }

    keys = keys as Array<Array<Key>>;
    keys.forEach((keyCombo: Array<Key>) => {
      this.onCombo(keyCombo, callback, preventDefault);
    });
  }

  startListening(): void {
    this.domNode.addEventListener('keydown', this.handleKeyDown);
    this.domNode.addEventListener('keyup', this.handleKeyUp);
  }

  stopListening(): void {
    this.domNode.removeEventListener('keydown', this.handleKeyDown);
    this.domNode.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: any) => {
    this.pressedKeys.add(event.keyCode);

    this.mapCombosToHandlers.forEach((handlers, combo) => {
      if (this.isComboPressed(combo)) {
        handlers.forEach(handler => handler());
      }
    });
  }

  private handleKeyUp = (event: any) => {
    this.pressedKeys.delete(event.keyCode);
  }

  private isComboPressed(combo: number[]): boolean {
    let result = true;
    combo.forEach(key => {
      if (!this.pressedKeys.has(key)) {
        result = false;
      }
    });
    return result;
  }

  private onCombo(combo: Array<Key>, callback: Function, preventDefault: boolean): void {
    if (!this.mapCombosToHandlers.has(combo)) {
      this.mapCombosToHandlers.set(combo, []);
    }
    const handlers = this.mapCombosToHandlers.get(combo);
    if (!handlers) {
      throw new Error('fatal bug');
    }
    handlers.push(callback);
  }

  private getShortcutName(keys: Key[]): string {
    return 'S-' + keys.join('-');
  }
}
