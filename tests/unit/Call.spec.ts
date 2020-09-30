import { shallowMount } from '@vue/test-utils'
import { CallData } from '@/utils/types'
import Call from '@/components/Call.vue'

describe('Call.vue', () => {
  const calls: CallData[] = [{
    "id": "abc",
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    "call_start_time": "2020-07-20 01:00:45",
  }]

  function getMountedComponent() {
    return shallowMount(Call, {
      props: { calls },
    })
  }

  it('displays Call placeholder', () => {
    const wrapper = getMountedComponent()
    const selected = wrapper.get('select').element.selectedOptions[0]
    expect(selected.text).toBe('Call')
    expect(selected.value).toBe('null')
  })

  it('renders props.calls', () => {
    const wrapper = getMountedComponent()
    expect(wrapper.get('option[value="abc"]').text()).toBe('7/20/2020 - Count Rugen')
  })
})
