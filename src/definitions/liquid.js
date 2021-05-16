/*
  key = common name/short name
  name = full name of unit. A plural version of this is also added
  aliases = other names for unit (tonnes and metric tons for example). Plural versions of these are also added
  value = conversion number. If liters have a value of 1, then milliliters have a value of 0.001 (there is 0.001 liters in 1 milliliter)
  selectableAs = the name that shows up in the list of units that we want to be able to select from. Not every unit should go on here, just the common ones
*/

export default {
  l: {
    name: 'liter',
    aliases: ['litre'],
    value: 1,
    selectableAs: 'liters',
  },
  ml: {
    name: 'milliliter',
    value: 0.001,
    selectableAs: 'milliliters',
  },
  pt: {
    name: 'pint',
    value: 0.473176473,
    selectableAs: 'pints',
  },
  qt: {
    name: 'quart',
    value: 0.946352946,
    selectableAs: 'quarts',
  },
  gal: {
    name: 'gallon',
    value: 3.785411784,
    selectableAs: 'gallons',
    default: true,
  },
  floz: {
    name: 'fluid ounce',
    aliases: ['fl oz'],
    value: 0.02957353,
    selectableAs: 'floz',
  }
}
