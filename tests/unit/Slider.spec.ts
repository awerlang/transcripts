import { shallowMount } from '@vue/test-utils'

import Slider from '@/components/Slider.vue'

describe('Slider.vue', () => {
    function getMountedComponent() {
        return shallowMount(Slider, {
            props: { modelValue: 0 },
        })
    }

    it('emits on mouse down', async () => {
        const wrapper = getMountedComponent()
        wrapper.trigger('mousedown')
        // FIXME: result should be a number in the [0..1] interval
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[NaN]])
    })
})
