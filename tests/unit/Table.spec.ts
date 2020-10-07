import { shallowMount } from '@vue/test-utils'

import Table from '@/components/Table.vue'

describe('Table.vue', () => {
    it('shows message when no data is available', () => {
        const wrapper = shallowMount(Table, {
            props: {
                title: 'Real',
                type: 'transcript',
                script: [],
            },
        })

        expect(wrapper.find('.header > div:nth-child(1)').text()).toStrictEqual('Real')
        expect(wrapper.find('.header > div:nth-child(2)').text()).toStrictEqual('-%')
        expect(wrapper.findAll('.list-header > div').map(it => it.text())).toStrictEqual([
            'Time', 'Speaker', 'Sentence',
        ])
        expect(wrapper.find('.scrollable-area > div').text()).toStrictEqual('Real data is not available yet.')
        expect(wrapper.findAll('li > div').map(it => it.text())).toStrictEqual([])
    })

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
                    similarity: 0.5,
                }, {
                    line: 2,
                    speaker: 'Rep.',
                    sentence: 'Good afternoon',
                    matchingSentence: '',
                    similarity: 0.5,
                }, {
                    line: 3,
                    speaker: 'Rep.',
                    sentence: 'Good morning',
                    matchingSentence: '',
                    similarity: 0.5,
                }],
            },
        })

        expect(wrapper.find('.header > div:nth-child(1)').text()).toStrictEqual('Expected')
        expect(wrapper.find('.header > div:nth-child(2)').text()).toStrictEqual('33%')
        expect(wrapper.findAll('.list-header > div').map(it => it.text())).toStrictEqual([
            'Line', 'Speaker', 'Sentence',
        ])
        expect(wrapper.findAll('li > div').map(it => it.text())).toStrictEqual([
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
                    similarity: 0.5,
                }, {
                    line: 2,
                    time: '0:15',
                    speaker: 'Rugen',
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
                }],
            },
        })

        expect(wrapper.find('.header > div:nth-child(1)').text()).toStrictEqual('Real')
        expect(wrapper.find('.header > div:nth-child(2)').text()).toStrictEqual('67%')
        expect(wrapper.findAll('.list-header > div').map(it => it.text())).toStrictEqual([
            'Time', 'Speaker', 'Sentence',
        ])
        expect(wrapper.findAll('li > div').map(it => it.text())).toStrictEqual([
            '0:05', 'Inigo', 'Hello',
            '0:15', 'Rugen', 'Good afternoon',
            '1:17', 'Inigo', 'Good morning',
        ])
    })

    function getMountedComponent() {
        return shallowMount(Table, {
            props: {
                title: 'Real',
                type: 'transcript',
                script: [{
                    line: 1,
                    time: '0:05',
                    speaker: 'Inigo',
                    sentence: 'Hello',
                    matchingSentence: 'Hi',
                    similarity: 0.2,
                }, {
                    line: 2,
                    time: '0:15',
                    speaker: 'Rugen',
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
                }],
            },
        })
    }

    it('highlights similar sentences', () => {
        const wrapper = getMountedComponent()
        expect(wrapper.findAll('.item-container:not(.list-header) > .sentence-column').map(it => it.classes('sentence-highlight'))).toStrictEqual([
            false,
            true,
            false,
        ])
    })

    it('matching sentences are displayed in a tooltip', () => {
        const wrapper = getMountedComponent()
        expect(wrapper.findAll('.item-container:not(.list-header) > .sentence-column').map(it => it.attributes('title'))).toStrictEqual([
            '',
            '50% matching with line "Good"',
            '',
        ])
    })
})
