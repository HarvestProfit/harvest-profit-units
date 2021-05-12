import liquidDefinitions from './definitions/liquid';
import solidDefinitions from './definitions/solid';
import seedDefinitions from './definitions/seed';
import yieldDefinitions from './definitions/yield';

const inflatedUnits = {};

class UnitRedefinitionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnitRedefinitionError';
  }
}

class UndefinedUnitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UndefinedUnitError';
  }
}

class UnitCompatibilityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnitCompatibilityError';
  }
}

function addUnitDefinitionWithoutError(group, name, value, primaryName, fullName) {
  if (!inflatedUnits[name]) {
    inflatedUnits[name] = {
      group,
      value,
      primaryName,
      fullName
    };
  }


}
function addUnitDefinition(group, name, value, primaryName, fullName) {
  if (inflatedUnits[name]) {
    throw new UnitRedefinitionError(`${name} is already a defined unit. Do not redefine units`);
  }

  addUnitDefinitionWithoutError(group, name, value, primaryName, fullName);
}

function inflateUnits(compatibilityGroup, definitions) {
  Object.keys(definitions).forEach((unitName) => {
    const definition = definitions[unitName];
    addUnitDefinition(compatibilityGroup, unitName, definition.value, unitName, definition.name);
    addUnitDefinitionWithoutError(compatibilityGroup, definition.name, definition.value, unitName, definition.name);
    const plural = definition.name + (definition.name[definition.name.length - 1] === 's' ? 'es' : 's');
    addUnitDefinitionWithoutError(compatibilityGroup, plural, definition.value, unitName, definition.name);


    (definition.aliases || []).forEach((aliasName) => {
      addUnitDefinition(compatibilityGroup, aliasName, definition.value, unitName, definition.name);
      const plural = aliasName + (aliasName[aliasName.length - 1] === 's' ? 'es' : 's');
      addUnitDefinitionWithoutError(compatibilityGroup, plural, definition.value, unitName, definition.name);
    });
  });
}

inflateUnits('liquid', liquidDefinitions);
inflateUnits('weight', solidDefinitions);
inflateUnits('seed', seedDefinitions);
inflateUnits('yield', yieldDefinitions);


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


class Units {
  constructor(value, unit) {
    checkUnitValidity(unit);

    this.value = value;
    this.unit = retrieveUnit(unit);
    if (inflatedUnits[this.unit].primaryName !== this.unit) {
      this.unit = inflatedUnits[this.unit].primaryName;
    }
  }

  static isCompatible(unit1, unit2) {
    checkUnitValidity(unit1);
    checkUnitValidity(unit2);

    return inflatedUnits[retrieveUnit(unit1)].group === inflatedUnits[retrieveUnit(unit2)].group;
  }

  equalBase = (unit) => this.isCompatible(unit);
  isCompatible(unit) {
    checkUnitValidity(unit);

    return inflatedUnits[this.unit].group === inflatedUnits[retrieveUnit(unit)].group;
  }

  to(unitArgument, conversionObject = null) {
    const unit = retrieveUnit(unitArgument)
    if (!this.isCompatible(unit)) {
      throw new UnitCompatibilityError(`${unit} is not compatible with ${this.unit}`);
    }

    const convertedValue = this.value * inflatedUnits[this.unit].value / inflatedUnits[unit].value

    return new Units(convertedValue, unit);
  }

  toNumber() {
    return this.value;
  }

  toString() {
    return `${this.value} ${this.unit}`
  }
}

export default Units;
