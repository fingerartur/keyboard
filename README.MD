# Keyboard

A library for listening to keyboard shortcuts and combos, such as `Ctrl + Z`, `Ctrl + Shift + Z`

## Install

```bash
npm i keyboard-ts

# or
yarn add keyboard-ts
```

## Use

```ts
import { Key, Keyboard } from 'keyboard-ts'

const target = document.getElementById('target')
const keyboard = new Keyboard(target)

// listen to Del + Esc
keyboard.on([ Key.Escape, Key.Delete ], () => {
    /* do something ... */
})

// listen to Space
keyboard.on([ Key.Space ], event => {
    // event is classic HTML event
    event.preventDefault()

    /* do something ... */
})

// listen to Ctrl+Z
keyboard.on([[ Key.Ctrl, Key.Z ]], () => {
    /* do something ... */
})

// listen to Ctrl+Shift+Z
keyboard.on([[ Key.Ctrl, Key.Shift, Key.Z ]], () => {
    /* do something ... */
})

// listen to Ctrl+Z or Ctrl+Y
keyboard.on([[ Key.Ctrl, Key.Z ], [ Key.Ctrl, Key.Y ]], () => {
    /* do something ... */
})

// listen to Ctrl+Z+X
keyboard.on([[ Key.Ctrl, Key.Z, Key.X ]], () => {
    /* do something ... */
})

// remove all listeners
keyboard.clear()
```

## API doc

```ts
new Keyboard(target: HTMLElement)
```

Instantiate new keyboard shortcut manager. This manager will listen to key combos pressed on the `target` HTML element.

<br/>

```ts
keyboard.on(combo: Key[], (event: KeyboardEvent) => void)
keyboard.on(combos: Key[][], (event: KeyboardEvent) => void)
```

Start listening to when a `combo` (combination of keyboard keys) is pressed at the same time.

The callback receives the keyboard event triggered by the last pressed key of the combo. (e.g. If Ctrl + Z, triggers
Ctrl press event and then Z press event, the callback will receive the Z press event.)

Instead of one `combo`, and array of `combos` can be passed in. In that case the callback is triggered if any of the
combos is pressed.

<br/>

```ts
keyboard.pause()
```

Temporarily pause listening to any keyboard combos. Can be reversed by calling `keyboard.unpause()`.

<br/>

```ts
keyboard.unpause()
```

Start listening again to keyboard combos again after `keyboard.pause()` was called.

<br/>

```ts
keyboard.clear()
```

Remove all listeners.

<br/>

## Limitations

1. It is not possible to use `window.alert()` inside the callback.
```ts
import { Key, Keyboard } from 'keyboard-ts'

const target = document.getElementById('target')
const keyboard = new Keyboard(target)

// Do NOT use alert() as a callback!
keyboard.on([ Key.Ctrl, Key.A ], () => {
    ❌ alert('stuff')

    // alert() erases the subsequent 'mouseup' event and this breaks the functionality
    // of the Keyboard class, because it has no way of knowing whether a key was released or not.
})
```
2. Windows key and select key are not supported

## Changelog

- Unreleased
    - Removed support for Windows key and select key
    - Added support for Macbook CMD key
- v1.2.5
    - Added Limitations to readme
- v1.2.4
    - Fix combos during pause. User can now press part of the combo before or during pause, and the rest after pause.
    - Fix no longer triggering combos when some extra keys are pressed, now combos get triggered only when exactly the combo keys are pressed and nothing else. (e.g. Ctrl + Z combo does not get triggered anymore when user presses Ctrl + Shift + Z)
    - Fixed listening to single combos `keyboard.on([ Key.Ctrl, Key.A ], () => {})` where callback was getting triggered when any of the keys from the combo was pressed
- v1.2.3
    - Added methods to listen to keyboard combos
