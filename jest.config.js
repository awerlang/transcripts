module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  setupFilesAfterEnv: ['./setup-jest.ts'],
}
