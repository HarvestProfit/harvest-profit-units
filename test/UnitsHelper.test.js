import UnitsHelper, {
  availableSeedUnits,
  availableSolidUnits,
  availableLiquidUnits,
} from '../src/UnitsHelper';

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
    });

    it('should list available bushel units when unit is "bushel"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'bushel' });
      expect(units).toEqual(['bushels']);
    });

    it('should list available liquid units when unit is "liter"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'liter' });
      expect(units).toEqual(availableLiquidUnits);
    });

    it('should list available seed units when unit is "seed"', () => {
      const units = UnitsHelper.listAvailableUnits({ units: 'seed' });
      expect(units).toEqual(availableSeedUnits);
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
      const lineItem = lineIteminCustomUnits;
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

  describe('parse old units', () => {
    it('should parse "litres" correctly', () => {
      const unit = UnitsHelper.parseOldUnit('litres');
      expect(unit).toEqual('liters');
    });

    it('should parse "fl oz" correctly', () => {
      const unit = UnitsHelper.parseOldUnit('fl oz');
      expect(unit).toEqual('floz');
    });

    it('should leave new units alone', () => {
      const unit = UnitsHelper.parseOldUnit('milliliters');
      expect(unit).toEqual('milliliters');
    });

    it('should leave units like "units - 140k" alone', () => {
      const unit = UnitsHelper.parseOldUnit('units - 140k');
      expect(unit).toEqual('units - 140k');
    });

    it('should leave units like "metric tons" alone', () => {
      const unit = UnitsHelper.parseOldUnit('metric tons');
      expect(unit).toEqual('metric tons');
    });
  });
});
