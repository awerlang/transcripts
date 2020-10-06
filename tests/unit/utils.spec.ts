import { compareFloat } from '@/utils/common'

describe('utils', () => {
    it('compareFloat', async () => {
        expect(compareFloat(0.00, 0.00)).toBe(true)
        expect(compareFloat(1.00, 1.00)).toBe(true)
        expect(compareFloat(0.01, 0.01)).toBe(true)

        expect(compareFloat(1.00, 0.01 * 100)).toBe(true)
        expect(compareFloat(.011, 0.11 * 0.1)).toBe(true)
        expect(compareFloat(0.11, 11.0 / 100)).toBe(true)
        expect(compareFloat(0.11, 1.10 / 10)).toBe(true)
        expect(compareFloat(.009, 0.90 / 100)).toBe(true)
    })
})
