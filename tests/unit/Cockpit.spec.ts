import { shallowMount, flushPromises } from '@vue/test-utils'
import { enableFetchMocks } from 'jest-fetch-mock'

import { CallData } from '@/utils/types'
import Cockpit from '@/components/Cockpit.vue'

describe('Cockpit.vue', () => {
  const agents = [{ id: '123', full_name: 'Inigo Montoya' }]
  const calls: CallData[] = [{
    "id": "abc",
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    "call_start_time": "2020-07-20 01:00:45",
  }]

  beforeAll(() => enableFetchMocks())

  function getMountedComponent() {
    return shallowMount(Cockpit, {})
  }

  it('fetches data', async () => {
    fetchMock.doMockOnceIf('/agents').mockResponseOnce(JSON.stringify(agents))
    fetchMock.doMockOnceIf('/calls').mockResponseOnce(JSON.stringify(calls))

    const wrapper = getMountedComponent()
    await flushPromises()

    const vm: any = wrapper.vm.$data
    expect(vm.agents).toStrictEqual(agents)
    expect(vm.all_calls).toStrictEqual(calls)
  })
})
