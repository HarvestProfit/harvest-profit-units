/*
  key = common name/short name
  name = full name of unit. A plural version of this is also added
  aliases = other names for unit (tonnes and metric tons for example). Plural versions of these are also added
  value = conversion number. If liters have a value of 1, then milliliters have a value of 0.001 (there is 0.001 liters in 1 milliliter)
  selectableAs = the name that shows up in the list of units that we want to be able to select from. Not every unit should go on here, just the common ones
*/

export default {
  g: {
    name: 'gram',
    value: 1,
    selectableAs: 'grams',
  },
  mg: {
    name: 'milligram',
    value: 0.001,
  },
  kg: {
    name: 'kilogram',
    value: 1000,
    selectableAs: 'kilograms',
  },
  t: {
    name: 'metric ton',
    aliases: ['tonne'],
    value: 1000000,
    selectableAs: 'metric tons',
  },
  ton: {
    name: 'ton',
    value: 907184.74,
    selectableAs: 'tons',
  },
  oz: {
    name: 'ounce',
    value: 28.349523125,
    selectableAs: 'oz',
  },
  lbs: {
    name: 'pound',
    aliases: ['lb'],
    value: 453.592375,
    selectableAs: 'lbs',
  },
}
