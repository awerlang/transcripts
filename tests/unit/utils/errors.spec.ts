import { BusinessError } from '@/utils/errors'

describe('utils', () => {
    it('BusinessError', async () => {
        const error = new BusinessError('some message')

        expect(error).toBeInstanceOf(BusinessError)
        expect(error.message).toBe('some message')
    })
})
