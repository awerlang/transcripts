import { shallowMount } from '@vue/test-utils'
import Agent from '@/components/Agent.vue'

describe('Agent.vue', () => {
  it('renders props.agents when passed', () => {
    const agents = [{ agent_id: '123', full_name: 'Inigo Montoya' }]
    const wrapper = shallowMount(Agent, {
      props: { agents },
    })
    expect(wrapper.get('option[value="123"]').text()).toMatch('Inigo Montoya')
  })
})
