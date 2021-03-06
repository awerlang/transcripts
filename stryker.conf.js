/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  _comment:
    "This config was generated using a preset. Please see the handbook for more information: https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/vuejs.md#vuejs",
  testRunner: "jest",
  mutator: {
    plugins: []
  },
  jest: {},
  reporters: ["progress", "clear-text", "html"],
  coverageAnalysis: "off"
};
