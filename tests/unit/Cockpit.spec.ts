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
    const wrapper = shallowMount(Cockpit, {})
    return flushPromises().then(() => wrapper)
  }

  beforeEach(() => {
    fetchMock.doMockOnceIf('/agents').mockResponseOnce(JSON.stringify(agents))
    fetchMock.doMockOnceIf('/calls').mockResponseOnce(JSON.stringify(calls))
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('fetches data', async () => {
    const wrapper = await getMountedComponent()

    const vm: any = wrapper.vm.$data
    expect(vm.agents).toStrictEqual(agents)
    expect(vm.all_calls).toStrictEqual(calls)
    expect((wrapper.vm as any).calls).toStrictEqual([])
  })

  it('when agent is selected the calls are filtered by agent', async () => {
    const wrapper = await getMountedComponent()

    const vm: any = wrapper.vm.$data
    vm.selected_agent_id = '123'

    expect((wrapper.vm as any).calls).toStrictEqual(calls)
  })

  it('when agent is selected then the current call is unset', async () => {
    const wrapper = await getMountedComponent()
    const vm: any = wrapper.vm.$data
    vm.selected_call_id = 'abc'

    vm.selected_agent_id = '123'
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).selected_call_id).toBeNull()
  })
})
