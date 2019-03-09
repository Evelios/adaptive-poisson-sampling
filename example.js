"use strict";

// Colors
var bgColor = tinycolor("#303030");
var bgAccent = tinycolor("#393939");
var primaryColor = tinycolor("#AA7539");
var secondaryColor = tinycolor("#A23645");
var tertiaryColor = tinycolor("#27566B");
var quaternaryColor = tinycolor("#479030");

// Globals
var width;
var height;
var bbox;
var points;
var rng;

var params = {
    // Parameters
    density: 25,
    jitter: 0,
    seed: 1,
    distribution: 'Gradient',

    // Options
    distributions: [
        'Uniform',
        'Gradient',
        'Noise',
        'Checkerboard'
    ]
};

function setup() {
    width = document.body.clientWidth || window.innerWidth;
    height = document.body.clientHeight || window.innerHeight;
    bbox = [width, height];

    createCanvas(width, height);

    setUpGui();
    createAndRender();
}

function setUpGui() {
    var gui = new dat.GUI();

    gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(createAndRender);
    gui.add(params, "density", 15, 50, 1).name("Point Density").onChange(createAndRender);
    gui.add(params, "jitter", 0, 2, 0.1).name("Point Jitter").onChange(createAndRender);
    gui.add(params, "distribution", params.distributions).name("Distribution").onChange(createAndRender);
}

function createAndRender() {
    rng = Alea(params.seed);
    create();
    render();
}

function create() {
    const densityFunction = {
        Uniform : () => {
            return params.density;
        },
        Gradient : (vec) => {
            return params.density / 3 + params.density * Math.pow(vec[0] / bbox[0], 2);
        },
        Noise : (vec) => {
            const min_density = 1;
            const noise_scale = 100;
            return min_density + params.density * noise(vec[0] / noise_scale, vec[1] / noise_scale);
        },
        Checkerboard : (vec) => {
            const grid_size = 100;
            const vec_tile = Math.floor(vec[0] / grid_size) + Math.floor(vec[1] / grid_size);
            return vec_tile % 2 == 0 ? params.density / 2 : params.density;
        }
    };

    points = poisson(bbox, densityFunction[params.distribution], rng);
    points = points.map(vec => {
        const jitter = params.jitter * densityFunction[params.distribution](vec);
        const angle = 2*Math.PI * rng();
        return [
            vec[0] + Math.cos(angle) * jitter,
            vec[1] + Math.sin(angle) * jitter
        ];
    });
}

function render() {
    background(bgColor.toHexString());

    noStroke();
    fill(primaryColor.toHexString());
    for (var point of points) {
        const ellipse_size = 5;
        ellipse(point[0], point[1], ellipse_size);
    }
}
