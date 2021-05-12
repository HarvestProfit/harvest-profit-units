import { inflatedUnits, selectableUnitsByGroup } from './definitions';
import { UndefinedUnitError, UnitCompatibilityError } from './errors';

function retrieveUnit(unit) {
  if (typeof unit === 'string') return unit;
  if (typeof unit === 'object') return unit.unit;

  throw new UndefinedUnitError(`${unit} is not defined`);
}

function checkUnitValidity(unitArgument) {
  const unit = retrieveUnit(unitArgument);
  if (!inflatedUnits[unit]) {
    throw new UndefinedUnitError(`${unit} is not defined`);
  }
}


// This class is used to operate with units. Providing invalid units to its functions will result in
//  it throwing a UndefinedUnitError
class Units {
  constructor(value, unit) {
    checkUnitValidity(unit);

    this.value = value;
    this.unit = retrieveUnit(unit);
    if (inflatedUnits[this.unit].primaryName !== this.unit) {
      this.unit = inflatedUnits[this.unit].primaryName;
    }
  }

  // Given a compatibility group name, it will return the common units in that group.
  // group names include: weight, liquid, seed, and yield
  static selectableUnits(group) {
    return selectableUnitsByGroup[group];
  }

  // Checks if 2 units are compatible. Units may be a Units object.
  static isCompatible(unit1, unit2) {
    checkUnitValidity(unit1);
    checkUnitValidity(unit2);

    return inflatedUnits[retrieveUnit(unit1)].group === inflatedUnits[retrieveUnit(unit2)].group;
  }

  // Checks if a unit is compatible with the object's unit.
  isCompatible(unit) {
    checkUnitValidity(unit);

    return inflatedUnits[this.unit].group === inflatedUnits[retrieveUnit(unit)].group;
  }

  // Converts the object's value into the provided unit. The provided unit may be a Units object.
  //  This will throw a UnitCompatibilityError when a unit is not compatible.
  // returns a Units object (so you can chain)
  to(unitArgument) {
    const unit = retrieveUnit(unitArgument)
    if (!this.isCompatible(unit)) {
      throw new UnitCompatibilityError(`${unit} is not compatible with ${this.unit}`);
    }

    const convertedValue = this.value * inflatedUnits[this.unit].value / inflatedUnits[unit].value

    return new Units(convertedValue, unit);
  }

  // Returns the numeric value of the unit.
  toNumber() {
    return this.value;
  }

  // Prints out the unit as "value unit"
  toString() {
    return `${this.value} ${this.unit}`
  }
}

export default Units;
