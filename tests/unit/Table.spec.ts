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

    it('shows transcript', () => {
        const wrapper = shallowMount(Table, {
            props: {
                title: 'Real',
                type: 'transcript',
                script: [{
                    line: 1,
                    time: '0:05',
                    speaker: 'Inigo',
                    sentence: 'Hello',
                    matchingSentence: 'Hi',
                }, {
                    line: 2,
                    time: '0:15',
                    speaker: 'Rugen',
                    sentence: 'Good afternoon',
                    matchingSentence: 'Good',
                }, {
                    line: 3,
                    time: '1:17',
                    speaker: 'Inigo',
                    sentence: 'Good morning',
                    matchingSentence: '',
                }],
            },
        })

        expect(wrapper.find('.header > div:nth-child(1)').text()).toStrictEqual('Real')
        expect(wrapper.find('.header > div:nth-child(2)').text()).toStrictEqual('67%')
        expect(wrapper.findAll('li > div').map(it => it.text())).toStrictEqual([
            'Time', 'Speaker', 'Sentence',
            '0:05', 'Inigo', 'Hello',
            '0:15', 'Rugen', 'Good afternoon',
            '1:17', 'Inigo', 'Good morning',
        ])
    })
})
