import { shallowMount, flushPromises } from '@vue/test-utils'
import { enableFetchMocks } from 'jest-fetch-mock'

import Cockpit from '@/components/Cockpit.vue'

describe('Cockpit.vue', () => {
  const agents = [{ id: '123', full_name: 'Inigo Montoya' }]

  beforeAll(() => enableFetchMocks())

  function getMountedComponent() {
    return shallowMount(Cockpit, {})
  }

  it('fetches agents', async () => {
    fetchMock.doMockIf('/agents').mockResponseOnce(JSON.stringify(agents))
    const wrapper = getMountedComponent()
    await flushPromises()
    const vm: any = wrapper.vm.$data
    expect(vm.agents).toStrictEqual(agents)
  })
})
