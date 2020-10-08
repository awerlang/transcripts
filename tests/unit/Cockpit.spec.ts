import { shallowMount, flushPromises } from '@vue/test-utils'
import { enableFetchMocks } from 'jest-fetch-mock'

import { AgentData, CallData, TranscriptData } from '@/utils/types'
import Cockpit from '@/components/Cockpit.vue'

// FIXME: currently cannot import types from *.vue modules
type ScriptLine = {
  line: number;
  time?: string;
  speaker: string;
  sentence: string;
  matchingSentence: string;
  similarity: number;
}

type Data = {
  agents: AgentData[];
  all_calls: CallData[];
  selected_agent_id: string | null;
  selected_call_id: string | null;
  script: ScriptLine[] | null;
  transcript: ScriptLine[] | null;
  sensitivity: number;
}

type Computed = {
  calls: CallData[];
}

describe('Cockpit.vue', () => {
  beforeAll(() => enableFetchMocks())

  function getMountedComponent() {
    const wrapper = shallowMount(Cockpit, {})
    return flushPromises().then(() => wrapper)
  }

  beforeEach(() => {
    const agents = [{ id: '000' }, { id: '123', full_name: 'Inigo Montoya' }]
    const calls: CallData[] = [{
      "id": "def",
      "agent": [{ "agent_id": "123", "channel_no": 1 }],
      "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
      "call_start_time": "2020-06-26 01:00:45",
    }, {
      "id": "abc",
      "agent": [{ "agent_id": "123", "channel_no": 1 }],
      "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
      "call_start_time": "2020-07-20 01:00:45",
    }]

    fetchMock.doMockOnceIf('/agents').mockResponseOnce(JSON.stringify(agents))
    fetchMock.doMockOnceIf('/calls').mockResponseOnce(JSON.stringify(calls))
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('fetches data', async () => {
    const wrapper = await getMountedComponent()

    const vm = wrapper.vm.$data as Data
    expect(vm.agents.map((it: AgentData) => it.id)).toStrictEqual(['000', '123'])
    expect(vm.all_calls.map((it: CallData) => it.id)).toStrictEqual(['def', 'abc'])
    expect((wrapper.vm as unknown as Computed).calls).toStrictEqual([])
  })

  it('shows informational message', async () => {
    const wrapper = await getMountedComponent()

    const el = wrapper.find('business-people-logo-stub')
    expect(el.exists()).toBe(true)
  })

  it('when agent is selected the calls are filtered by agent', async () => {
    const wrapper = await getMountedComponent()

    const vm = wrapper.vm.$data as Data
    vm.selected_agent_id = '123'
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as unknown as Computed).calls.map((it: CallData) => it.id)).toStrictEqual(['abc', 'def'])
  })

  function mockTranscript(error = false) {
    if (error) {
      return fetchMock.doMockOnceIf('/calls/abc/transcript')
        .mockResponseOnce(JSON.stringify({}), {
          status: 404,
        })
    }

    const transcript: TranscriptData = {
      "agent": [{ "agent_id": "123", "channel_no": 1 }],
      "customer": [{ "full_name": "Count Rugen", "channel_no": 2 }],
      script: [{ order: 0, sentence: "Hello", matching_sentence: "Hi", similarity: 0.5 }],
      transcript: [{
        order: 0,
        timeFrom: 5,
        timeTo: 5,
        channel: 1,
        sentence: 'Hello',
        matching_sentence: 'Hi',
        similarity: 0.5,
      }, {
        order: 1,
        timeFrom: 10,
        timeTo: 10,
        channel: 2,
        sentence: 'Good afternoon',
        matching_sentence: 'Good',
        similarity: 0.5,
      }, {
        order: 2,
        timeFrom: 77,
        timeTo: 77,
        channel: 1,
        sentence: 'Good morning',
        matching_sentence: '',
        similarity: 0.5,
      }, {
        order: 3,
        timeFrom: 160,
        timeTo: 160,
        channel: 3,
        sentence: 'Good night',
        matching_sentence: '',
        similarity: 0.5,
      }],
    }

    return fetchMock.doMockOnceIf('/calls/abc/transcript')
      .mockResponseOnce(JSON.stringify(transcript))
  }

  it('when agent is selected then the current call is unset', async () => {
    mockTranscript()
    const wrapper = await getMountedComponent()
    const vm = wrapper.vm.$data as Data
    vm.selected_call_id = 'abc'

    vm.selected_agent_id = '123'
    await wrapper.vm.$nextTick()

    expect(vm.selected_call_id).toBeNull()
  })

  describe('when call is selected', () => {
    async function getComponent(transcriptFails = false) {
      const wrapper = await getMountedComponent()

      const vm = wrapper.vm.$data as Data
      vm.selected_agent_id = '123'
      await wrapper.vm.$nextTick()

      vm.selected_call_id = 'abc'
      fetchMock.resetMocks()
      mockTranscript(transcriptFails)
      await wrapper.vm.$nextTick()

      await flushPromises()

      return wrapper
    }

    it('then informational message is hidden', async () => {
      const wrapper = await getComponent()

      const el = wrapper.find('business-people-logo-stub')
      expect(el.exists()).toBe(false)
    })

    it('then script is parsed', async () => {
      const wrapper = await getComponent()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect((wrapper.vm.$data as Data).script).toStrictEqual([{
        line: 1,
        speaker: 'Rep.',
        sentence: 'Hello',
        matchingSentence: 'Hi',
        similarity: 0.5,
      }])
    })

    it('then transcript is parsed', async () => {
      const wrapper = await getComponent()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect((wrapper.vm.$data as Data).transcript).toStrictEqual([{
        line: 1,
        time: '0:05',
        speaker: 'Inigo',
        sentence: 'Hello',
        matchingSentence: 'Hi',
        similarity: 0.5,
      }, {
        line: 2,
        time: '0:10',
        speaker: 'Count',
        sentence: 'Good afternoon',
        matchingSentence: 'Good',
        similarity: 0.5,
      }, {
        line: 3,
        time: '1:17',
        speaker: 'Inigo',
        sentence: 'Good morning',
        matchingSentence: '',
        similarity: 0.5,
      }, {
        line: 4,
        time: '2:40',
        speaker: '',
        sentence: 'Good night',
        matchingSentence: '',
        similarity: 0.5,
      }])
    })

    it('then script table is shown', async () => {
      const wrapper = await getComponent()

      const el = wrapper.findAll('table-stub')
      expect(el.length).toBe(2)
    })

    it('then matching sensitivity slider is reset to default value', async () => {
      const wrapper = await getComponent()

      const el = wrapper.find('slider-stub')
      expect(el.exists()).toBe(true)
      expect((wrapper.vm.$data as Data).sensitivity).toBe(0.38)

      const el2 = wrapper.find('.sensitivity-value')
      expect(el2.text()).toBe('38%')
    })

    it('handle api errors', async () => {
      const wrapper = await getComponent(true)

      const el = wrapper.findAll('table-stub')
      expect(el.length).toBe(0)
    })
  })
})
