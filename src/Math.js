import math from 'mathjs';

// Seed units
math.createUnit('seed', { aliases: ['seeds'] });
math.createUnit('bag', { definition: '80000 seeds', aliases: ['bags'] });
math.createUnit('units140k', { definition: '140000 seeds', aliases: ['unit140k'] });
math.createUnit('units130k', { definition: '130000 seeds', aliases: ['unit130k'] });

// Bushel units
math.createUnit('bushel', { aliases: ['bushels'] });

export default math;
