import { shallowMount } from '@vue/test-utils'
import Agent from '@/components/Agent.vue'

describe('Agent.vue', () => {
  const agents = [{ id: '123', full_name: 'Inigo Montoya' }]

  function getMountedComponent() {
    return shallowMount(Agent, {
      props: { agents },
    })
  }

  it('displays Agent placeholder', () => {
    const wrapper = getMountedComponent()
    const selected = wrapper.get('select').element.selectedOptions[0]
    expect(selected.text).toBe('Agent')
    expect(selected.value).toBe('null')
  })

  it('renders props.agents', () => {
    const wrapper = getMountedComponent()
    expect(wrapper.get('option[value="123"]').text()).toMatch('Inigo Montoya')
  })
})
