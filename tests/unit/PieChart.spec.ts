import { shallowMount } from '@vue/test-utils'

import PieChart from '@/components/PieChart.vue'

describe('PieChart.vue', () => {
    function getMountedComponent() {
        return shallowMount(PieChart, {
            props: { value: 0.75 },
        })
    }

    it('renders one pie slice', async () => {
        const wrapper = getMountedComponent()
        expect(wrapper.findAll('circle').map(it => it.attributes('stroke-dasharray'))).toStrictEqual(['75 100'])
    })
})
