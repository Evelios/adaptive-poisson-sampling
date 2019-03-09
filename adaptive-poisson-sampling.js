// Algorithm Sources
// https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
// http://devmag.org.za/2009/05/03/poisson-disk-sampling/
import Quadtree from 'rbush';

export default function poisson(dimensions, density, rng=Math.random, min_dist=0.1) {
  const density_fn = density instanceof Function ? density : () => density;
  const [width, height] = dimensions;
  const cellSize = min_dist / Math.SQRT2;
  const point_tree = Quadtree(9, ['[0]', '[1]', '[0]', '[1]']); // accept [x, y] points
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
    rng() * width,
    rng() * height
  ]);

  point_tree.insert(seed_point);
  out_points.push(seed_point);
  active_points.push(seed_point);

  while (active_points.length) {
    const current_point = active_points.splice(Math.floor(rng() * active_points.length), 1)[0];
    const location_density = density_fn(current_point);    // Evaluate the density at the current point

    attempts = 0;
    while (attempts < max_attempts) {
      const range_reduction = attempts / max_attempts; // Reduce range of point choices as the attempts decreases
      const radius = location_density + ( Math.sqrt(rng()) * location_density * range_reduction );
      const angle = 2 * Math.PI * rng();
      const new_point = toGrid([
          current_point[0] + radius * Math.cos(angle),
          current_point[1] + radius * Math.sin(angle)
      ]);

      // Try the new point against the already generated points
      const closestDist = minDist(new_point, point_tree, location_density);
      if (inBox(dimensions, new_point) &&
          closestDist < location_density * 2    &&
          closestDist > location_density ) {

        point_tree.insert(new_point);
        out_points.push(new_point);
        active_points.push(new_point);
      }
      attempts++;
    }
  }

  return out_points;
}

// Get the minimum distance from position to a list of points
// within 2x the location_density. This function specifically
// works on the bounding box in the relevent range of points
function minDist(position, point_tree, location_density) {
  const local_points = point_tree.search({
    minX: position[0] - location_density,
    minY: position[1] - location_density,
    maxX: position[0] + location_density,
    maxY: position[1] + location_density,
  });

  if (local_points.length == 0) {
    return Infinity;
  }

  const min = local_points.reduce((prev, current) => {
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
