import Units from './Units';

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
  'pints',
  'quarts',
];

export class ConversionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConversionError';
  }
}


export default class UnitsHelper {
  static isCompatibleUnit = (unit1, unit2) => Units.isCompatible(unit1, unit2);

  static isLiquid = product => product.liquid !== false && product.density > 0;

  static liquidToSolid = (liquidAmount, liquidUnitName, solidUnitName, density) => {
    const liquidAmountInGallons = new Units(liquidAmount, liquidUnitName).to('gallons');
    return new Units(liquidAmountInGallons.toNumber() * density, 'lbs').to(solidUnitName);
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
    let acresRatio = 1;
    if (item.split) {
      acresRatio = parseFloat(item.applied_acres || 0) / acres;
    }
    if (item.is_total) {
      const total = item.amount * perUnitCost;
      return total / acres;
    }
    return item.amount * perUnitCost * acresRatio;
  }

  static lineItemToProductUnits = (item, product) => {
    const productUnit = UnitsHelper.parseUnit(product.units);
    const lineItemUnit = UnitsHelper.parseUnit(item.units);

    const isProductLiquid = product.liquid && product.density > 0;

    try {
      if (productUnit === 'custom') {
        const amount = lineItemUnit === 'custom' ? product.multiplier : 1;
        const unit = lineItemUnit === 'custom' ? 'seed' : lineItemUnit;
        const lineItemInSeedUnits = new Units(amount, unit).to('seeds').toNumber();
        const lineIteminCustomUnits = lineItemInSeedUnits / product.multiplier;
        return lineIteminCustomUnits;
      } else if (isProductLiquid && !UnitsHelper.isCompatibleUnit(lineItemUnit, productUnit)) {
        const finalCalc = UnitsHelper.liquidToSolid(1, lineItemUnit, productUnit, product.density).toNumber();
        if (finalCalc > 0) {
          return finalCalc;
        }
      } else {
        // If all else fails, try to convert
        const lineItemInProductUnits = new Units(1, lineItemUnit).to(productUnit).toNumber();
        if (lineItemInProductUnits > 0) {
          return lineItemInProductUnits;
        }
      }
    } catch (error) {
      return 1;
    }

    return 0;
  }

  static perUnitCost = (product, item) => {
    return UnitsHelper.lineItemToProductUnits(item, product) * product.price;
  }

  static toProductUnits = (item, product) => {
    return UnitsHelper.lineItemToProductUnits(item, product) * item.amount;
  }

  static parseUnit = unit => unit.replace('per ', '');

  static parseOldUnit = unit => unit;

  static convertToUnit(amount, fromUnit, toUnit) {
    const parsedFromUnit = this.parseUnit(fromUnit);
    const parsedToUnit = this.parseUnit(toUnit);
    if (UnitsHelper.isCompatibleUnit(parsedFromUnit, parsedToUnit)) {
      return new Units(amount, parsedFromUnit).to(parsedToUnit).toNumber();
    }
    throw new ConversionError(`Cannot convert ${parsedFromUnit} to ${parsedToUnit}`);
  }

  static convertToGallons(amount, unit) {
    return this.convertToUnit(amount, unit, 'gallons');
  }

  static convertToPounds(amount, unit) {
    return this.convertToUnit(amount, unit, 'lbs');
  }

  static isLiquidUnit = unit => UnitsHelper.isCompatibleUnit(this.parseUnit(unit), 'gallons')
}
