# Keyboard

A library for listening to keyboard shortcuts and combos.

# Example

```ts
import { Keyboard } from 'keyboard-ts'
import { Key } from 'keyboard-ts'

const target = document.getElementById('target')
const keyboard = new Keyboard(target)

// listen to keys
keyboard.on([ Key.Escape, Key.Delete ], () => {  /* on Del or Esc */ })
keyboard.on([ Key.Space ], event => event.preventDefault())

// listen to key combos
keyboard.on([[ Key.Ctrl, Key.Z ]], () => {  /* on Ctrl+Z */ })
keyboard.on([[ Key.Ctrl, Key.Shift, Key.Z ]], () => { /* on Ctrl+Shift+Z */ })
keyboard.on([[ Key.Ctrl, Key.Z ], [ Key.Ctrl, Key.Y ]], () => { /* on Ctrl+Z or Ctrl+Y */ })

// temporarily stop listening
keyboard.stopListening()

// start listening again
keyboard.startListening()

// stop listening forever, release all memory
keyboard.clear()
```

# Caution

```ts
// Do not use alert() as a callback!
keyboard.on([ Key.Ctrl, Key.A ], () => {
    alert('stuff')

    // alert() erases the subsequent 'mouseup' event and this breaks the functionality
    // of the Keyboard class, because it has no way of knowing whether a key was released or not.
    // Sadly, this is how browsers work. It is not a bug in this library.
})
```

# Install

```
    npm i keyboard-ts
    yarn add keyboard-ts
```

# Licence

Feel free to use in any way. (MIT)
