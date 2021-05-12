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

More commonly, you will use the line item/product functions or to generate units for select boxes

```js
UnitsHelper.perAcreCost(product, item, acres) // 3.50
UnitsHelper.listAvailableUnits(product) // ['gallons', 'floz', 'milliliters', ...]
```

All of this is build off of the `Units` object and a set of definitions declared in this repo.
You can use this object to handle any conversions or any other interaction with those units.

```js
import { Units } from '@harvest-profit/units';

const amount = new Units(1, 'gallon');
amount.to('pints').toNumber() // 8 pints

amount.isCompatible('lbs') // false


// Can use any different name. If a name is missing, just add it to the aliases in the definition in a PR
const gal = new Units(1, 'gal');
const gallon = new Units(1, 'gallon');
const gallons = new Units(1, 'gallons');

Units.selectableUnits('liquid') // ['gallons', 'floz', 'milliliters', ...]

Units.isCompatible('g', 'lb') // true
Units.isCompatible(gallon, 'lb') // false
Units.isCompatible(gal, gallon) // true
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
