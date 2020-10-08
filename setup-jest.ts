let consoleFn: jest.Mock

beforeEach(() => {
    consoleFn = console.warn = console.error = jest.fn()
})

afterEach(() => {
    expect(consoleFn).not.toHaveBeenCalled()
})
