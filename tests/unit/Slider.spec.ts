import { shallowMount } from '@vue/test-utils'

import Slider from '@/components/Slider.vue'

describe('Slider.vue', () => {
    function getMountedComponent(modelValue = 0) {
        return shallowMount(Slider, {
            props: { modelValue },
        })
    }

    it('tapping on the knob does not update position', () => {
        const wrapper = getMountedComponent()
        wrapper.get('.slider-knob').trigger('mousedown')
        wrapper.get('.slider-knob').trigger('mouseup')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    describe('given the minimum value', () => {
        it('emits on mouse down', async () => {
            const wrapper = getMountedComponent()
            wrapper.get('.slider-right').trigger('mousedown')
            // FIXME: result should be a number in the [0..1] interval
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
        })

        it('sliding knob right updates position', () => {
            const wrapper = getMountedComponent()
            wrapper.get('.slider-knob').trigger('mousedown')
            wrapper.get('.slider-knob').trigger('mousemove')
            wrapper.get('.slider-knob').trigger('mouseup')
            // FIXME: result should be a number in the [0..1] interval
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
        })

        it('left arrow key does not update position', async () => {
            const wrapper = getMountedComponent(0)
            wrapper.trigger('keydown', { key: 'ArrowLeft' })
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })

        it('right arrow key updates position', async () => {
            const wrapper = getMountedComponent(0)
            wrapper.trigger('keydown', { key: 'ArrowRight' })
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[0.01]])
        })
    })

    describe('given the maximum value', () => {
        it('emits on mouse down', async () => {
            const wrapper = getMountedComponent()
            wrapper.get('.slider-left').trigger('mousedown')
            // FIXME: result should be a number in the [0..1] interval
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
        })

        it('sliding knob left updates position', () => {
            const wrapper = getMountedComponent()
            wrapper.get('.slider-knob').trigger('mousedown')
            wrapper.get('.slider-knob').trigger('mousemove')
            wrapper.get('.slider-knob').trigger('mouseup')
            // FIXME: result should be a number in the [0..1] interval
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
        })

        it('left arrow key updates position', async () => {
            const wrapper = getMountedComponent(1)
            wrapper.trigger('keydown', { key: 'ArrowLeft' })
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([[0.99]])
        })

        it('right arrow key does not update position', async () => {
            const wrapper = getMountedComponent(1)
            wrapper.trigger('keydown', { key: 'ArrowRight' })
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })
})
