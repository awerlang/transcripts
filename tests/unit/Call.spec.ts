import { shallowMount, DOMWrapper } from '@vue/test-utils'
import { CallData } from '@/utils/types'
import Call from '@/components/Call.vue'

describe('Call.vue', () => {
  const calls: CallData[] = [{
    "id": "abc",
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    "call_start_time": "2020-07-20 01:00:45",
  }, {
    "id": "def",
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    "call_start_time": "2020-06-26 01:00:45",
  }]

  function getMountedComponent() {
    return shallowMount(Call, {
      props: { calls },
    })
  }

  function setSelected(select: DOMWrapper<HTMLSelectElement>, index: number, selected = true) {
    select.findAll('option')[index].element.selected = selected
    return select.trigger('change')
  }

  it('displays Call placeholder', () => {
    const wrapper = getMountedComponent()
    const selected = wrapper.get('select').element.selectedOptions[0]
    expect(selected.text).toBe('Call')
    expect(selected.value).toBe('null')
  })

  it('renders props.calls', () => {
    const wrapper = getMountedComponent()
    expect(wrapper.findAll('option').map(it => [it.attributes('value'), it.text()])).toStrictEqual([
      ['null', 'Call'],
      ['abc', '7/20/2020 - Count Rugen'],
      ['def', '6/26/2020 - Count Rugen']
    ])
  })

  it('emits on selection change', async () => {
    const wrapper = getMountedComponent()
    const select = wrapper.find('select')

    await setSelected(select, 1)

    expect(wrapper.get('select').element.value).toBe('abc')
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['abc']])
  })
})
