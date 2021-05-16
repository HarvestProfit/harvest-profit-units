/*
  key = common name/short name
  name = full name of unit. A plural version of this is also added
  aliases = other names for unit (tonnes and metric tons for example). Plural versions of these are also added
  value = conversion number. If liters have a value of 1, then milliliters have a value of 0.001 (there is 0.001 liters in 1 milliliter)
  selectableAs = the name that shows up in the list of units that we want to be able to select from. Not every unit should go on here, just the common ones
*/

export default {
  seed: {
    name: 'seed',
    value: 1,
    selectableAs: 'seeds',
    default: true,
  },
  bag: {
    name: 'bag',
    value: 80000,
    selectableAs: 'bags'
  },
  'unit - 130k': {
    name: 'unit - 130k',
    aliases: ['unit130k', 'units - 130k', 'units130k'],
    value: 130000,
    selectableAs: 'unit - 130k'
  },
  'unit - 140k': {
    name: 'unit - 140k',
    aliases: ['unit140k', 'units - 140k', 'units140k'],
    value: 140000,
    selectableAs: 'unit - 140k',
  },
}
