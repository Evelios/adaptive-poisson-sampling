// http://devmag.org.za/2009/05/03/poisson-disk-sampling/

// N-Dimensional Sampling
// https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf

// module.exports = function sample(dimensions, density, variance, maxTries=8) {
//   density = density instanceof Function ? density : () => density;

// };

(function() {

function poisson(dimensions, density, min_dist=0.1) {
  const cellSize = min_dist / Math.SQRT2;
  const max_attempts = 30;
  let out_points = [];
  let active_points = [];
  let attempts;

  function toGrid (point) {
    return [
      Math.ceil(point[0] / cellSize) * cellSize,
      Math.ceil(point[1] / cellSize) * cellSize
    ];
  }

  const seed_point = toGrid([
    Math.random() * dimensions[0],
    Math.random() * dimensions[1]
  ]);

  out_points.push(seed_point);
  active_points.push(seed_point);

  while (active_points.length) {
    const current_point = active_points.splice(Math.floor(Math.random() * active_points.length), 1)[0];

    attempts = 0;
    while (attempts < max_attempts) {
      const radius = density + Math.sqrt(Math.random()) * density * attempts / max_attempts;
      const angle = 2 * Math.PI * Math.random();
      const new_point = toGrid([
          current_point[0] + radius * Math.cos(angle),
          current_point[1] + radius * Math.sin(angle)
      ]);

      // Try the new point against the already generated points
      const closestDist = minDist(new_point, out_points);
      if (inBox(dimensions, new_point) && 
          closestDist < density * 2    &&
          closestDist > density ) {

        out_points.push(new_point);
        active_points.push(new_point);
      }
      attempts++;
    }
  }

  return out_points;
};

// Get the minimum distance from position to a list of points
function minDist(position, points) {
  const min = points.reduce((prev, current) => {
    return Math.min(prev, pointDist2(position, current));
  }, Infinity);

  return Math.sqrt(min);
}

// Return the distance squared between two points
function pointDist2(v1, v2) {
  return Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2);
}

function inBox(bbox, point) {
  return point[0] > 0 && point[0] < bbox[0] &&
         point[1] > 0 && point[1] < bbox[1];
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = poisson;
}
else {
  window.poisson = poisson;
}

})();