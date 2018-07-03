# Keyboard

A library for listening to keyboard shortcuts or combos. Can be used in JS or TS. Can be used with Webpack (React, Angular, etc).

# Example

```js
import { Keyboard } from 'keyboard-ts';
import { Key } from 'keyboard-ts';

const target = document.getElementById('target') as HTMLElement;
const keyboard = new Keyboard(target);
// listens to keyboard shortcuts when "target" element is focused

keyboard.on([ Key.Ctrl, Key.Z ], () => { console.log('undo at Ctrl+Z'); });
keyboard.on([ Key.Ctrl, Key.Shift, Key.Z ], () => { console.log('redo at Ctrl+Shift+Z'); });

keyboard.on([[ Key.Escape ], [ Key.Delete ]], () => { console.log('delete at Del or Esc'); });

keyboard.stopListening();
// removes all listeners from the target element

keyboard.startListening();
// adds all listeners back to the target element

```

# Caution

```js
// Do not use alert() as a callback!
keyboard.on([ Key.Ctrl, Key.A ], () => {
    alert('stuff');
    
    // alert() erases the subsequent 'mouseup' event and this breaks the functionality
    // of the Keyboard class, because it has no way of knowing whether a key was released or not.
    // Sadly, this is how browsers work. It is not a bug in this library.
});
```

# Install

```npm i keyboard```

# Credit

Leverages the ts-keycode-enum library under MIT

# Licence

Feel free to use in any way. (MIT)


## Footnotes: How to publish typescript to npm

It's a bit tricky. Pure typescript cannot be published, because webpack, etc. do not compile the code of libraries.
*(After install this results in the cryptic error: package not found; no idea why)*
It's even more tricky, because webpack cannot work with ES6 either, so the no only the code cannot be TS, it has to be transplied to ES5 as well.

```
// index.ts exports all exports
npm i typescript --save-dev
package.json > scripts: build: "tsc"
npm run build
package.json > main: dist/index.js; types: dist/index.d.ts
npm adduser // or npm whoami
npm publish
```

```
tsconfig.json

"lib": ["es5", "es6", "dom"], // allows usage of Set, Map, etc.
```