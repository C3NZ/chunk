const PIXEL_RATIO = window.devicePixelRatio || 1;
const canvasPlaceholder = document.querySelector('.canvas-placeholder');
const canvas = document.querySelector('.canvas');
const script = document.querySelector('.script');
const context = canvas.getContext('2d');

// --------------------------------- MATH API ----------------------------------

const {
  cos, sin, sqrt, PI,
} = Math;
const DEGREE = PI / 180;

let TURTLE_WIDTH;
let TURLE_HEIGHT;
let TURTLE_POSITION;
let TURTLE_DIRECTION;
let TURTLE_VISIBLE;
let TURTLE_PEN;
let TURTLE_COLOR;
const DegreesToRadians = (degrees) => DEGREE * degrees;

function ResetTurtle() {
  Recenter();
  direction = deg2;
}

function DrawTurtle() {}
