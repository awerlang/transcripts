import { shallowMount } from '@vue/test-utils'

import Table from '@/components/Table.vue'

describe('Table.vue', () => {
    it('shows script', () => {
        const wrapper = shallowMount(Table, {
            props: {
                title: 'Expected',
                type: 'script',
                script: [{
                    line: 1,
                    speaker: 'Rep.',
                    sentence: 'Hello',
                    matchingSentence: 'Hi',
                }, {
                    line: 2,
                    speaker: 'Rep.',
                    sentence: 'Good afternoon',
                    matchingSentence: '',
                }, {
                    line: 3,
                    speaker: 'Rep.',
                    sentence: 'Good morning',
                    matchingSentence: '',
                }],
            },
        })

        expect(wrapper.find('.header > div:nth-child(1)').text()).toStrictEqual('Expected')
        expect(wrapper.find('.header > div:nth-child(2)').text()).toStrictEqual('33%')
        expect(wrapper.findAll('li > div').map(it => it.text())).toStrictEqual([
            'Line', 'Speaker', 'Sentence',
            '1', 'Rep.', 'Hello',
            '2', 'Rep.', 'Good afternoon',
            '3', 'Rep.', 'Good morning',
        ])
    })
})
