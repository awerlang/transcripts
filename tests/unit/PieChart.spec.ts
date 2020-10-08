import { shallowMount } from '@vue/test-utils'

import PieChart from '@/components/PieChart.vue'

describe('PieChart.vue', () => {
    function getMountedComponent(value?: number) {
        return shallowMount(PieChart, {
            props: { value },
        })
    }

    it('requires a "value" prop', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockReturnValue()
        getMountedComponent()
        expect(warnSpy).toBeCalledTimes(1)
    })

    it('accepts values in the [0..1] inverval', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockReturnValue()
        getMountedComponent(0)
        getMountedComponent(1)
        expect(warnSpy).not.toBeCalled()
    })

    it('renders one pie slice', async () => {
        const wrapper = getMountedComponent(0.75)
        expect(wrapper.findAll('circle').map(it => it.attributes('stroke-dasharray'))).toStrictEqual(['75 100'])
    })

    it('does not accept values outside the [0..1] inverval', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockReturnValue()
        getMountedComponent(-1)
        getMountedComponent(2)
        expect(warnSpy).toBeCalledTimes(2)
    })

    afterEach(() => {
        jest.resetAllMocks()
    })
})
