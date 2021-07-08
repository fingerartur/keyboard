import { Key } from 'ts-keycode-enum'
import { Keyboard } from './Keyboard'

const triggerKeyPress = (key: Key) => {
    // @ts-ignore
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: key }))
    // @ts-ignore
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: key }))
}

describe('keyboard', () => {
    describe('can listen to', () => {
        it('a key', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([ Key.A ], callback)

            expect(callback).not.toBeCalled()

            triggerKeyPress(Key.A)
            triggerKeyPress(Key.A)

            expect(callback).toBeCalledTimes(2)

            triggerKeyPress(Key.B)

            expect(callback).toBeCalledTimes(2)

            keyboard.clear()
        })

        it('multiple keys', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([ Key.A, Key.Space ], callback)

            expect(callback).not.toBeCalled()

            triggerKeyPress(Key.A)
            triggerKeyPress(Key.Space)

            expect(callback).toBeCalledTimes(2)

            triggerKeyPress(Key.B)

            expect(callback).toBeCalledTimes(2)
            keyboard.clear()
        })
    })
})
