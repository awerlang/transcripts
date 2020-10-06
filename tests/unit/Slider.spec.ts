import { shallowMount } from '@vue/test-utils'

import Slider from '@/components/Slider.vue'

describe('Slider.vue', () => {
    function getMountedComponent(modelValue = 0) {
        return shallowMount(Slider, {
            props: { modelValue },
        })
    }

    it('emits on mouse down', async () => {
        const wrapper = getMountedComponent()
        wrapper.trigger('mousedown')
        // FIXME: result should be a number in the [0..1] interval
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
    })

    describe('given the minimum value', () => {
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
