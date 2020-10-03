import { shallowMount, flushPromises } from '@vue/test-utils'
import { enableFetchMocks } from 'jest-fetch-mock'

import { CallData, TranscriptData } from '@/utils/types'
import Cockpit from '@/components/Cockpit.vue'

describe('Cockpit.vue', () => {
  const agents = [{ id: '123', full_name: 'Inigo Montoya' }]
  const calls: CallData[] = [{
    "id": "abc",
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    "call_start_time": "2020-07-20 01:00:45",
  }]
  const transcript: TranscriptData = {
    "agent": [{ "agent_id": "123", "channel_no": 1 }],
    "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
    script: [{ order: 0, sentence: "Hello", matching_sentence: "Hi" }],
    transcript: [],
  }

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

  it('shows informational message', async () => {
    const wrapper = await getMountedComponent()

    const el = wrapper.find('business-people-logo-stub')
    expect(el.exists()).toBe(true)
  })

  it('when agent is selected the calls are filtered by agent', async () => {
    const wrapper = await getMountedComponent()

    const vm: any = wrapper.vm.$data
    vm.selected_agent_id = '123'
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).calls).toStrictEqual(calls)
  })

  function mockTranscript() {
    return fetchMock.doMockOnceIf('/calls/abc/transcript')
      .mockResponseOnce(JSON.stringify(transcript))
  }

  it('when agent is selected then the current call is unset', async () => {
    mockTranscript()
    const wrapper = await getMountedComponent()
    const vm: any = wrapper.vm.$data
    vm.selected_call_id = 'abc'

    vm.selected_agent_id = '123'
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).selected_call_id).toBeNull()
  })

  describe('when call is selected', () => {
    async function getComponent() {
      const wrapper = await getMountedComponent()

      const vm: any = wrapper.vm.$data
      vm.selected_agent_id = '123'
      await wrapper.vm.$nextTick()

      vm.selected_call_id = 'abc'
      fetchMock.resetMocks()
      mockTranscript()
      await wrapper.vm.$nextTick()

      await flushPromises()

      return wrapper
    }

    it('then informational message is hidden', async () => {
      const wrapper = await getComponent()

      const el = wrapper.find('business-people-logo-stub')
      expect(el.exists()).toBe(false)
    })

    it('then transcript is parsed', async () => {
      const wrapper = await getComponent()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect((wrapper.vm.$data as any).script).toStrictEqual([{
        line: 1,
        speaker: 'Rep.',
        sentence: 'Hello',
        matchingSentence: 'Hi',
      }])
    })

    it('then script table is shown', async () => {
      const wrapper = await getComponent()

      const el = wrapper.find('table-stub')
      expect(el.exists()).toBe(true)
    })
  })
})
