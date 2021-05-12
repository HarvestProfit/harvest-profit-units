// Thrown when defining duplicate units in the definitions
export class UnitRedefinitionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnitRedefinitionError';
  }
}

// Thrown when providing unknown units to the Units object
export class UndefinedUnitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UndefinedUnitError';
  }
}

// Thrown when providing incompatible units to the Units object
export class UnitCompatibilityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnitCompatibilityError';
  }
}
