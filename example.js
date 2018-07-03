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

var params = {
    // Parameters
    density: 25,
    distribution: 'Uniform',

    // Options
    distributions: [
        'Uniform',
        'Gradient'
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

    gui.add(params, "density", 15, 50, 1).name("Point Density").onChange(createAndRender);
    gui.add(params, "distribution", params.distributions).name("Distribution").onChange(createAndRender);
}

function createAndRender() {
    create();
    render();
}

function create() {
    if (params.distribution === 'Uniform') {
        points = poisson(bbox, params.density);
    }
    else if (params.distribution === 'Gradient') {
        points = poisson(bbox, (vec) => {
            return params.density / 2 + params.density * Math.pow(vec[0] / bbox[0], 2);
        });
    } else {
        throw Error('Incorrect Distribution Param');
    }
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