<div style="text-align: center">
  <img src="https://www.harvestprofit.com/logo.png" alt="Harvest Profit"></img>
</div>

[![npm](https://img.shields.io/npm/v/@harvest-profit/units.svg)](https://www.npmjs.com/package/harvest-profit-units) [![Build Status](https://travis-ci.org/HarvestProfit/harvest-profit-units.svg?branch=master)](https://travis-ci.org/HarvestProfit/harvest-profit-units) [![codecov](https://codecov.io/gh/HarvestProfit/harvest-profit-units/branch/master/graph/badge.svg)](https://codecov.io/gh/HarvestProfit/harvest-profit-units) [![npm](https://img.shields.io/npm/l/@harvest-profit/units.svg)](https://github.com/HarvestProfit/harvest-profit-units/blob/master/LICENSE)

## Installation

To add this package to your project
```bash
yarn add @harvest-profit/units
```

To use, try the following:
```js
import UnitsHelper from '@harvest-profit/units'

const isCompatibleUnit = UnitsHelper.isCompatibleUnit('lbs', 'tons');
console.log(isCompatibleUnit); // true
```

Other useful functions...

```js
UnitsHelper.isLiquidUnit('floz') // true
UnitsHelper.convertToGallons(8, 'pints') // 1
```

## Development
To deploy a new version to NPM, bump the version number, commit/merge to `master`, and run the following:
```bash
yarn run clean
yarn run build

# Either NPM
npm publish --access public
# Or Yarn, they do the same thing
yarn publish --access public
```

## License
This project is [MIT licensed](./LICENSE)
