const sampler = require('./adaptive-poisson-sampling');

const points = sampler([200, 400], 3, 0.01);
console.log(`Output Points Length: ${points.length}`);