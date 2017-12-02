import _ from 'lodash';
import Math from './Math';

export const availableBushelUnits = [
  'bushels',
];

export const availableSeedUnits = [
  'seeds',
  'bags',
  'units - 130k',
  'units - 140k',
];

export const availableSolidUnits = [
  'lbs',
  'oz',
  'tons',
  'grams',
  'kilograms',
  'metric tons',
];

export const availableLiquidUnits = [
  'gallons',
  'floz',
  'liters',
  'milliliters',
];

export default class UnitsHelper {
  static isCompatibleUnit = (unit1, unit2) =>
    Math.unit(1, unit1).equalBase(Math.unit(1, unit2))

  static isLiquid = product => product.liquid !== false && product.density > 0;

  static liquidToSolid = (liquidUnits, liquidUnitName, solidUnitName, density, densityName = 'lbs/gal') => {
    const densityConversion = Math.unit(density, densityName);
    const totalLiquid = Math.unit(liquidUnits, liquidUnitName);
    const totalSolid = Math.multiply(totalLiquid, densityConversion);
    return totalSolid.to(solidUnitName);
  }

  static listAvailableUnits(product) {
    const primaryUnit = UnitsHelper.parseUnit(product.units);
    const unitCheck = UnitsHelper.isCompatibleUnit;
    const isLiquid = UnitsHelper.isLiquid(product);
    if (primaryUnit === 'custom') {
      return [...availableSeedUnits, 'custom'];
    } else if (unitCheck(primaryUnit, 'bushel')) {
      return availableBushelUnits;
    } else if (unitCheck(primaryUnit, 'seed')) {
      return availableSeedUnits;
    } else if ((unitCheck(primaryUnit, 'gallons')) || isLiquid) {
      return availableLiquidUnits;
    }
    return availableSolidUnits;
  }

  static perAcreCost = (product, item, acres) => {
    const perUnitCost = UnitsHelper.perUnitCost(product, item);
    const acresRatio = _.toNumber(item.applied_acres) / acres;
    if (item.is_total) {
      const total = item.amount * perUnitCost;
      return total / acres;
    }
    return item.amount * perUnitCost * acresRatio;
  }

  static perUnitCost = (product, item) => {
    const productUnit = UnitsHelper.parseUnit(product.units);
    const lineItemUnit = UnitsHelper.parseUnit(item.units);

    const isProductLiquid = product.liquid && product.density > 0;

    let totalPerUnit = 0;
    try {
      if (productUnit === 'custom') {
        const amount = lineItemUnit === 'custom' ? product.multiplier : 1;
        const unit = lineItemUnit === 'custom' ? 'seed' : lineItemUnit;
        const lineItemInSeedUnits = Math.unit(amount, unit).to('seeds').toNumber();
        const lineIteminCustomUnits = lineItemInSeedUnits / product.multiplier;
        totalPerUnit = product.price * lineIteminCustomUnits;
      } else if (isProductLiquid && !UnitsHelper.isCompatibleUnit(lineItemUnit, productUnit)) {
        const lbsPerGallon = Math.unit(`${product.density} lbs/gal`);
        const finalUnit = Math.multiply(
          Math.unit(1, lineItemUnit),
          lbsPerGallon,
        );
        const finalCalc = finalUnit.to(productUnit).toNumber();
        if (finalCalc > 0) {
          totalPerUnit = product.price * finalCalc;
        }
      } else {
        // If all else fails, try to convert
        const lineItemInProductUnits = Math
          .unit(1, lineItemUnit)
          .to(productUnit)
          .toNumber();
        if (lineItemInProductUnits > 0) {
          totalPerUnit = product.price * lineItemInProductUnits;
        }
      }
    } catch (error) {
      totalPerUnit = product.price;
    }
    return totalPerUnit;
  }

  static parseUnit = unit =>
    unit
      .replace('per ', '')
      .replace('fl oz', 'floz')
      .replace(' - ', '')
      .replace('metric ton', 'tonne');

  static parseOldUnit = unit =>
    unit
      .replace('fl oz', 'floz')
      .replace('litres', 'liters');
}
