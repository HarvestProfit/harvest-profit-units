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
    selectableAs: 'seeds'
  },
  bag: {
    name: 'bag',
    value: 80000,
    selectableAs: 'bags'
  },
  'units - 130k': {
    name: 'units - 130k',
    aliases: ['units130k'],
    value: 130000,
    selectableAs: 'units - 130k'
  },
  'units - 140k': {
    name: 'units - 140k',
    aliases: ['units140k'],
    value: 140000,
    selectableAs: 'units - 140k',
  },
}
