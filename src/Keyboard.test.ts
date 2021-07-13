import { Key } from 'ts-keycode-enum'
import { Keyboard } from './Keyboard'

const triggerKeyPress = (key: Key) => {
    const keydownEvent = new KeyboardEvent('keydown', { keyCode: key })
    const keyupEvent = new KeyboardEvent('keyup', { keyCode: key })

    // @ts-ignore
    document.dispatchEvent(keydownEvent)
    // @ts-ignore
    document.dispatchEvent(keyupEvent)

    return {
        keydownEvent,
        keyupEvent,
    }
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

    describe('handler gets keydown event', () => {
        it('gets keydown event', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([ Key.A ], callback)

            expect(callback).not.toBeCalled()

            const { keydownEvent } = triggerKeyPress(Key.A)

            expect(callback).toBeCalledTimes(1)
            expect(callback).toBeCalledWith(keydownEvent)

            keyboard.clear()
        })
    })
})
