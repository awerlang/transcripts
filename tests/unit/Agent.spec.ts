import { shallowMount, DOMWrapper } from '@vue/test-utils'
import { AgentData } from '@/utils/types'
import Agent from '@/components/Agent.vue'

describe('Agent.vue', () => {
  const agents: AgentData[] = [{ id: '123', full_name: 'Inigo Montoya', email: 'inigo@montoya.com' }]

  function getMountedComponent() {
    return shallowMount(Agent, {
      props: { agents, modelValue: null },
    })
  }

  function setSelected(select: DOMWrapper<HTMLSelectElement>, index: number, selected = true) {
    select.findAll('option')[index].element.selected = selected
    return select.trigger('change')
  }

  it('displays Agent placeholder', () => {
    const wrapper = getMountedComponent()
    const selected = wrapper.get('select').element.selectedOptions[0]
    expect(selected.text).toBe('Agent')
    expect(selected.value).toBe('null')
  })

  it('renders props.agents', () => {
    const wrapper = getMountedComponent()
    expect(wrapper.get('option[value="123"]').text()).toBe('Inigo Montoya')
  })

  it('emits on selection change', async () => {
    const wrapper = getMountedComponent()
    const select = wrapper.find('select')

    await setSelected(select, 1)

    expect(wrapper.get('select').element.value).toBe('123')
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['123']])
  })
})
