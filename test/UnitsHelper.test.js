import UnitsHelper, {
  availableSeedUnits,
  availableSolidUnits,
  availableLiquidUnits,
} from '../src/UnitsHelper';

import Units from '../src/Units';

/**
 * These are vars for use in calculations
 */
const productInCustomUnits = {
  density: null,
  liquid: false,
  multiplier: 1000,
  price: 4000.00,
  units: 'custom',
};

const productInTons = {
  density: null,
  liquid: false,
  multiplier: 1,
  price: 4000.00,
  units: 'per ton',
};

const liquidProductInTons = {
  density: 10.00,
  liquid: true,
  multiplier: 1,
  price: 4000.00,
  units: 'per ton',
};

const lineIteminCustomUnits = {
  applied_acres: 100,
  amount: 1,
  units: 'custom',
};

const lineItemInLbs = {
  applied_acres: 100,
  amount: 10,
  units: 'lbs',
};

const lineItemInLbsAppliedAsTotal = {
  applied_acres: 100,
  amount: 20,
  is_total: true,
  units: 'lbs',
};

const lineItemInGallons = {
  applied_acres: 100,
  amount: 100,
  units: 'gallons',
};

const lineItemInSeeds = {
  applied_acres: 100,
  amount: 300,
  units: 'seeds',
};

/**
 * Here are the actual tests
 */
describe('UnitsHelper', () => {
  it('should test compatible units', () => {
    const compatibleUnit = UnitsHelper.isCompatibleUnit('lb', 'ton');
    expect(compatibleUnit).toEqual(true);
  });

  it('should convert liquids to solids', () => {
    const gallons = 8000;
    const gallonsPerPound = 4;
    const poundsPerGallon = 1 / gallonsPerPound;
    const gallonsToTons = UnitsHelper.liquidToSolid(
      gallons,
      'gallons',
      'tons',
      poundsPerGallon,
      'lbs/gal',
    );
    expect(gallonsToTons.toNumber()).toBeCloseTo(1);
  });

  it('should convert liquids to solids based on the American assumption', () => {
    const gallons = 8000;
    const gallonsPerPound = 4;
    const poundsPerGallon = 1 / gallonsPerPound;
    const gallonsToTons = UnitsHelper.liquidToSolid(
      gallons,
      'gallons',
      'tons',
      poundsPerGallon,
    );
    expect(gallonsToTons.toNumber()).toBeCloseTo(1);
  });

  describe('isLiquid', () => {
    it('should correctly recognize a liquid product', () => {
      const liquidProduct = liquidProductInTons;
      expect(UnitsHelper.isLiquid(liquidProduct)).toEqual(true);
    });

    it('should correctly recognize a non-liquid product', () => {
      const solidProduct = productInTons;
      expect(UnitsHelper.isLiquid(solidProduct)).toEqual(false);
    });
  });

  describe('list available units', () => {
    it('should list available solid units when unit is "lb"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'lb' });
      expect(units).toEqual(availableSolidUnits);
      expect(units).toContain('lbs');
      expect(units).toContain('grams');
      expect(units).toContain('tons');
      expect(units).toContain('metric tons');
    });

    it('should list available bushel units when unit is "bushel"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'bushel' });
      expect(units).toEqual(['bushels']);
    });

    it('should list available liquid units when unit is "liter"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'liter' });
      expect(units).toEqual(availableLiquidUnits);
      expect(units).toContain('milliliters');
      expect(units).toContain('gallons');
      expect(units).toContain('liters');
      expect(units).toContain('floz');
    });

    it('should list available seed units when unit is "seed"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'seed' });
      expect(units).toEqual(availableSeedUnits);
      expect(units).toContain('seeds');
      expect(units).toContain('unit - 130k');
      expect(units).toContain('bags');
      expect(units).toContain('unit - 140k');
    });

    it('should list no available seed units when unit is "custom"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'custom' });
      expect(units).toEqual([...availableSeedUnits, 'custom']);
    });
  });

  describe('per unit costs', () => {
    it('should calculate per unit cost from a given product and input', () => {
      const product = productInTons;
      const lineItem = lineItemInLbs;
      const unitCost = UnitsHelper.perUnitCost(product, lineItem);
      expect(unitCost).toBeCloseTo(2.00);
    });

    it('should calculate per unit costs from a given product and liquid input', () => {
      const product = liquidProductInTons;
      const lineItem = lineItemInGallons;
      const unitCost = UnitsHelper.perUnitCost(product, lineItem);
      expect(unitCost).toBeCloseTo(20.00);
    });

    it('should calculate per unit costs from a given custom product and input', () => {
      const product = productInCustomUnits;
      const lineItem = lineIteminCustomUnits;
      const unitCost = UnitsHelper.perUnitCost(product, lineItem);
      expect(unitCost).toBeCloseTo(4000.00);
    });

    it('should give up and use the product cost if given an invalid unit for an input', () => {
      const product = productInTons;
      const lineItem = lineItemInGallons;
      const unitCost = UnitsHelper.perUnitCost(product, lineItem);
      expect(unitCost).toBeCloseTo(4000.00);
    });
  });

  describe('line item amount per acre in product units', () => {
    it('should convert the line item amount per acre into product units', () => {
      const product = productInTons;
      const lineItem = lineItemInLbs;
      const amountInProductUnits = UnitsHelper.toProductUnits(lineItem, product);
      expect(amountInProductUnits).toBeCloseTo(0.005, 3);
    });

    it('should convert the line item amount per acre into product units given a liquid product', () => {
      const product = liquidProductInTons;
      const lineItem = lineItemInGallons;
      const amountInProductUnits = UnitsHelper.toProductUnits(lineItem, product);
      expect(amountInProductUnits).toBeCloseTo(0.5, 1);
    });

    it('should convert the line item amount per acre into product units given a custom product', () => {
      const product = productInCustomUnits;
      const lineItem = lineItemInSeeds;
      const amountInProductUnits = UnitsHelper.toProductUnits(lineItem, product);
      expect(amountInProductUnits).toBeCloseTo(0.3, 1);
    });

    it('should fall back to product units when converting the line item amount per acre into product units if error', () => {
      const product = productInTons;
      const lineItem = lineItemInSeeds;
      const amountInProductUnits = UnitsHelper.toProductUnits(lineItem, product);
      expect(amountInProductUnits).toBeCloseTo(300);
    });
  });

  describe('per acre costs', () => {
    it('should calculate per acre costs from a given product, input, and acres', () => {
      const product = productInTons;
      const lineItem = lineItemInLbs;
      const perAcreCost = UnitsHelper.perAcreCost(product, lineItem, 100);
      expect(perAcreCost).toBeCloseTo(20.00);
    });

    it('should calculate per acre costs from a given product, liquid input, and acres', () => {
      const product = liquidProductInTons;
      const lineItem = lineItemInGallons;
      const perAcreCost = UnitsHelper.perAcreCost(product, lineItem, 100);
      expect(perAcreCost).toBeCloseTo(2000.00);
    });

    it('should calculate per acre costs from a given custom product, input, and acres', () => {
      const product = productInCustomUnits;
      const lineItem = lineIteminCustomUnits;
      const unitCost = UnitsHelper.perAcreCost(product, lineItem, 100);
      expect(unitCost).toBeCloseTo(4000.00);
    });

    it('should calculate per acre costs from a given product, input applied to half the field', () => {
      const product = productInCustomUnits;
      const lineItem = { ...lineIteminCustomUnits, split: true };
      const unitCost = UnitsHelper.perAcreCost(product, lineItem, 200);
      expect(unitCost).toBeCloseTo(2000.00);
    });

    it('should calculate per acre costs from a given product, input applied as a total', () => {
      const product = productInTons;
      const lineItem = lineItemInLbsAppliedAsTotal;
      const unitCost = UnitsHelper.perAcreCost(product, lineItem, 100);
      expect(unitCost).toBeCloseTo(0.4);
    });

    it('should calculate per acre costs from a given product, input applied as total to half the field', () => {
      const product = productInTons;
      const lineItem = lineItemInLbsAppliedAsTotal;
      const unitCost = UnitsHelper.perAcreCost(product, lineItem, 200);
      expect(unitCost).toBeCloseTo(0.2);
    });
  });

  describe('Units', () => {
    it('should inflate all definitions of grams', () => {
      expect(() => new Units(10, 'g')).not.toThrowError();
      expect(() => new Units(10, 'gram')).not.toThrowError();
      expect(() => new Units(10, 'grams')).not.toThrowError();

      expect(() => new Units(10, 'gs')).toThrowError();
    });

    it('should parse "litres" correctly', () => {
      const unit = new Units(10, 'litres');
      expect(unit.to('liters').toNumber()).toEqual(10);
    });

    it('should convert floz to gallons', () => {
      const unit = new Units(10, 'floz');
      expect(unit.to('gal').toNumber()).toBeCloseTo(0.078, 3);
    });

    it('should convert bags to seeds', () => {
      const unit = new Units(2, 'bags');
      expect(unit.to('seeds').toNumber()).toEqual(160000);
    });

    it('should fail to convert lbs to gallons', () => {
      const unit = new Units(2, 'lbs');
      expect(() => unit.to('gallons')).toThrowError();
    });

    it('should print nicely', () => {
      const unit = new Units(2, 'lbs');
      expect(unit.toString()).toEqual('2 lbs');
    });

    it('should show compatibility', () => {
      const unit = new Units(2, 'lbs');
      expect(unit.isCompatible('grams')).toEqual(true);
      expect(unit.isCompatible('lbs')).toEqual(true);
      expect(unit.isCompatible('tons')).toEqual(true);
      expect(unit.isCompatible('seeds')).toEqual(false);
      expect(unit.isCompatible('gallons')).toEqual(false);
      expect(unit.isCompatible(new Units(2, 'gallons'))).toEqual(false);
      expect(unit.isCompatible(new Units(2, 'lbs'))).toEqual(true);
    });

    it('should have the details accessible', () => {
      const unit = new Units(2, 'lbs');
      expect(unit.unit).toEqual('lbs');
      expect(unit.toNumber()).toEqual(2);
    });
  });

  describe('#convertToUnit', () => {
    it('should convert milliliters to gallons', () => {
      expect(UnitsHelper.convertToUnit(100, 'milliliters', 'gallons')).toBeCloseTo(0.026, 3);
      expect(UnitsHelper.convertToGallons(100, 'milliliters')).toBeCloseTo(0.026, 3);
      // should work with short name
      expect(UnitsHelper.convertToGallons(100, 'ml')).toBeCloseTo(0.026, 3);
    });

    it('should convert fl oz to gallons', () => {
      expect(UnitsHelper.convertToGallons(100, 'fl oz')).toBeCloseTo(0.78, 2);
      // should work with both forms of the unit
      expect(UnitsHelper.convertToGallons(100, 'floz')).toBeCloseTo(0.78, 2);
    });

    it('should convert gallons to gallons', () => {
      expect(UnitsHelper.convertToGallons(100, 'gallons')).toBeCloseTo(100);
      // should work with short name
      expect(UnitsHelper.convertToGallons(100, 'gal')).toBeCloseTo(100);
    });

    it('should convert pints to gallons', () => {
      expect(UnitsHelper.convertToGallons(100, 'pints')).toBeCloseTo(12.5, 1);
      // should work with short name
      expect(UnitsHelper.convertToGallons(100, 'pt')).toBeCloseTo(12.5, 1);
    });

    it('should fail to convert lbs to gallons', () => {
      expect(() => UnitsHelper.convertToUnit(100, 'lbs', 'gallons')).toThrowError();
      expect(() => UnitsHelper.convertToGallons(100, 'lbs')).toThrowError();
      expect(() => UnitsHelper.convertToGallons(100, 'pounds')).toThrowError();
      expect(() => UnitsHelper.convertToPounds(100, 'gallons')).toThrowError();
    });

    it('should fail to convert ounces to gallons', () => {
      expect(() => UnitsHelper.convertToGallons(100, 'oz')).toThrowError();
    });
  });
});
