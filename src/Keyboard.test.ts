import { Key } from 'ts-keycode-enum'
import { Keyboard } from './Keyboard'

const triggerKeyDown = (key: Key) => {
    const keydownEvent = new KeyboardEvent('keydown', { keyCode: key })

    // @ts-ignore
    document.dispatchEvent(keydownEvent)
}

const triggerKeyUp = (key: Key) => {
    const keyupEvent = new KeyboardEvent('keyup', { keyCode: key })

    // @ts-ignore
    document.dispatchEvent(keyupEvent)
}

describe('keyboard', () => {
    describe('single keys', () => {
        it('can listen to single-key key press', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()
            const callbackB = jest.fn()

            keyboard.on([Key.A], callback)
            keyboard.on([Key.B], callbackB)

            expect(callbackB).not.toBeCalled()
            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(1)

            triggerKeyUp(Key.A)

            expect(callback).toBeCalledTimes(1)

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(2)

            triggerKeyUp(Key.A)

            expect(callback).toBeCalledTimes(2)
            expect(callbackB).not.toBeCalled()

            keyboard.clear()
        })
    })

    describe('key combo', () => {
        it('can listen to a combo - multiple keys are pressed down', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([Key.A, Key.Space], callback)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.Space)

            expect(callback).toBeCalledTimes(1)

            triggerKeyUp(Key.Space)
            triggerKeyUp(Key.A)

            keyboard.clear()
        })

        it('should not trigger combo press when not all keys are pressed', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([Key.A, Key.Space], callback)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callback).not.toBeCalled()

            triggerKeyUp(Key.A)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.Space)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(1)

            keyboard.clear()
        })

        it('should work if user holds one key and presses the other repeatedly', () => {
            const keyboard = new Keyboard(document)
            const callback = jest.fn()

            keyboard.on([Key.A, Key.Space], callback)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.Space)

            expect(callback).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(1)

            triggerKeyUp(Key.A)

            expect(callback).toBeCalledTimes(1)

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(2)

            triggerKeyUp(Key.A)

            expect(callback).toBeCalledTimes(2)

            triggerKeyDown(Key.A)

            expect(callback).toBeCalledTimes(3)

            keyboard.clear()
        })

        it('can listen to different combos', () => {
            const keyboard = new Keyboard(document)
            const callbackA = jest.fn()
            const callbackB = jest.fn()

            keyboard.on([Key.A, Key.Space], callbackA)
            keyboard.on([Key.B, Key.Space], callbackB)

            triggerKeyDown(Key.Space)

            expect(callbackA).not.toBeCalled()

            triggerKeyDown(Key.A)

            expect(callbackA).toBeCalledTimes(1)
            expect(callbackB).toBeCalledTimes(0)

            triggerKeyUp(Key.A)

            expect(callbackA).toBeCalledTimes(1)
            expect(callbackB).toBeCalledTimes(0)

            triggerKeyDown(Key.B)

            expect(callbackA).toBeCalledTimes(1)
            expect(callbackB).toBeCalledTimes(1)

            triggerKeyUp(Key.B)

            expect(callbackA).toBeCalledTimes(1)
            expect(callbackB).toBeCalledTimes(1)

            triggerKeyDown(Key.A)

            expect(callbackA).toBeCalledTimes(2)
            expect(callbackB).toBeCalledTimes(1)

            keyboard.clear()
        })

        it('should not trigger when extra keys are pressed, not just the combo', () => {
            const keyboard = new Keyboard(document)
            const callbackA = jest.fn()

            keyboard.on([Key.A, Key.Space], callbackA)

            triggerKeyDown(Key.Space)
            triggerKeyDown(Key.B)
            triggerKeyDown(Key.A)

            expect(callbackA).not.toBeCalled()

            triggerKeyUp(Key.B)

            expect(callbackA).not.toBeCalled()

            triggerKeyUp(Key.A)
            triggerKeyDown(Key.A)

            expect(callbackA).toBeCalledTimes(1)

            keyboard.clear()
        })
    })


    // describe('handler gets keydown event', () => {
    //     it('gets keydown event', () => {
    //         const keyboard = new Keyboard(document)
    //         const callback = jest.fn()

    //         keyboard.on([Key.A], callback)

    //         expect(callback).not.toBeCalled()

    //         const { keydownEvent } = triggerKeyPress(Key.A)

    //         expect(callback).toBeCalledTimes(1)
    //         expect(callback).toBeCalledWith(keydownEvent)

    //         keyboard.clear()
    //     })
    // })
})


// TODO multiple listeners
