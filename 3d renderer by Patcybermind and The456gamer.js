/*
@title: 3d_wire_frame_renderer
@author: Patcybermind, The456gamer
*/
/* HOW TO USE :
  w = forward
  s = backward

  d = left
  a = right

  i = move down
  k = move up

  j = turn left
  l = turn right

*/

// initial translation values
let camx = 0;
let camy = 0; // vertical
let camz = 50;

// focal length
let focal_length = 50;

// near plane
let near_plane = 5;

// percentage
let percent = 0;

// cam speed
let cam_speed_x = 5;
let cam_speed_y = cam_speed_x;
let rotation_speed = Math.PI / 16

function render() {
    calculate_trigger_values();
    // code goes here

    /*
      Notes
      the top is +y
      bottom is -y

      left is -x
      right is +x

      further is +z
      closer is -z
    */

    // Cube

    // front
    // front top
    draw_wire_frame(-10, 10, 0, 10, 10, 0);
    // front bottom
    draw_wire_frame(-10, -10, 0, 10, -10, 0);
    // front right
    draw_wire_frame(10, -10, 0, 10, 10, 0);
    // front left
    draw_wire_frame(-10, -10, 0, -10, 10, 0);

    // back, same as front but with z = 20
    // back top
    draw_wire_frame(-10, 10, 20, 10, 10, 20);
    // back bottom
    draw_wire_frame(-10, -10, 20, 10, -10, 20);
    // back right
    draw_wire_frame(10, -10, 20, 10, 10, 20);
    // back left
    draw_wire_frame(-10, -10, 20, -10, 10, 20);

    // links
    // top right
    draw_wire_frame(10, 10, 0, 10, 10, 20);
    // top left
    draw_wire_frame(-10, 10, 0, -10, 10, 20);
    // bottom right
    draw_wire_frame(-10, -10, 0, -10, -10, 20);
    // bottom left
    draw_wire_frame(10, -10, 0, 10, -10, 20);


    // Pyramid

    // front
    draw_wire_frame(-60, -10, 0, -40, -10, 0, colours.red);
    // back
    draw_wire_frame(-60, -10, 20, -40, -10, 20, colours.red);
    // right union
    draw_wire_frame(-40, -10, 0, -40, -10, 20, colours.red);
    // left union
    draw_wire_frame(-60, -10, 0, -60, -10, 20, colours.red);

    // center unions

    // front right
    draw_wire_frame(-50, 10, 10, -40, -10, 0, colours.red);
    // front left
    draw_wire_frame(-50, 10, 10, -60, -10, 0, colours.red);

    // back right
    draw_wire_frame(-50, 10, 10, -40, -10, 20, colours.red);
    // back left
    draw_wire_frame(-50, 10, 10, -60, -10, 20, colours.red);

    // tests with colours
    
}


// set up everything

const colours = {
    black: "0",
    light_grey: "1",
    white: "2",
    red: "3",
    light_green: "4",
    dark_blue: "5",
    yellow: "6",
    light_blue: "7",
    pink: "8",
    orange: "9",
    brown: "C",
    dark_green: "D",
    gold: "F",
    purple: "H",
    dark_grey: "L",
};
const colours_listed = [
  "0,0,0,0",
  "1,145,151,156",
  "2,255,255,255",
  "3,235,44,71",
  "4,45,225,62",
  "5,19,21,224",
  "6,254,230,16",
  "7,25,177,248",
  "8,245,109,187",
  "9,245,113,23",
  "C,139,65,46",
  "D,29, 148, 16",
  "F,149,140,50",
  "H,170,58,197",
  "L,73,80,87",
]
let sprites = []
// not sure of compatability, but this works
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!£$%^&*()_+-=[]{}#~'@;:/?>,<|`¬"
let idState = 0

function getNextId() {
    let id = alphabet[idState]
    idState++;
    return id
}

const background = getNextId()

// initialize sprites
for (let x = 0; x < 10; x++) {
    sprites.push([])
    for (let y = 0; y < 8; y++) {
        sprites[x].push({
            id: getNextId(), tile: `0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
`
        })
    }
}

function clear() {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 8; y++) {
            sprites[x][y].tile = `0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
`
        }
    }
}


function getTilemap() {
    const output = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 8; y++) {
            output.push([sprites[x][y].id, sprites[x][y].tile])
        }
    }
    return output
}


function flushScreen() {
    let tilemap = getTilemap()
    setLegend(
        ...tilemap,
        [background, bitmap`0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
`]
    )
}

let tileMap = ""
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 10; x++) {
        tileMap += sprites[x][y].id
    }
    tileMap += `
`
}


function strReplaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}


function setPixel(x, y, colour = "5") {
    if ((0 <= x) && (x < 160) && (0 <= y) && (y < 128)) {
        if (("0L123C756F4D8H9".indexOf(colour) === -1)) {
            colour = "5"
        }
        const tileX = Math.floor(x / 16)
        const tileY = Math.floor(y / 16)
        const subTileX = x % 16
        const subTileY = y % 16
        const strIndex = (subTileY * 17) + subTileX;
        let before = sprites[tileX][tileY].tile
        sprites[tileX][tileY].tile = strReplaceAt(sprites[tileX][tileY].tile, strIndex, colour);
        if (before.length !== sprites[tileX][tileY].tile.length) {
            console.log(before)
            console.log(sprites[tileX][tileY].tile)
            debugger;
        }
    }
}

flushScreen();
setMap(tileMap)
setBackground(background);


// points
let x1 = 0;
let y1 = 0;
let z1 = 0;

let x2 = 0;
let y2 = 0;
let z2 = 0;


// cos and sin variables
let cosx = 1;
let sinx = 1;

let cosy = 1;
let siny = 1;

// rotation
let rotx = 0;
let roty = 0;

// listeners

// turn right
onInput("l", () => {
    roty += -rotation_speed;
    console.log("roty: ", roty);
    main();
})
// turn left
onInput("j", () => {
    roty += rotation_speed;
    console.log("roty: ", roty);
    main();
})
// i
onInput("i", () => {
    camy += cam_speed_y;
    console.log("camy: ", camy);
    main();
})
// k
onInput("k", () => {
    camy += -cam_speed_y;
    console.log("camy: ", camy);
    main();
})
// a
onInput("a", () => {
    camz += (cam_speed_x * siny);
    camx += -(cam_speed_x * cosy);
    console.log("camz: ", camz);
    console.log("camx: ", camx);
    main();
})
// d
onInput("d", () => {
    camz += -(cam_speed_x * siny);
    camx += (cam_speed_x * cosy);
    console.log("camz: ", camz);
    console.log("camx: ", camx);
    main();
})
// s backwards
onInput("s", () => {
    camz += (cam_speed_x * cosy);
    camx += (cam_speed_x * siny);
    console.log("camz: ", camz);
    console.log("camx: ", camx);
    main();
})
// w forward
onInput("w", () => {
    camz += -(cam_speed_x * cosy);
    camx += -(cam_speed_x * siny);
    console.log("camz: ", camz);
    console.log("camx: ", camx);
    main();
})

main();
// functions
function getClosestSprigColor(colour) {
  for
}

function draw_line(x1, y1, x2, y2, colour = [255, 255, 255]) {
    let colour = getClosestSprigColor(colour);
    var dlt, mul, yl = false, i,
        sl = y2 - y1,
        ll = x2 - x1,
        lls = ll >> 31,
        sls = sl >> 31;

    if ((sl ^ sls) - sls > (ll ^ lls) - lls) {
        sl ^= ll;
        ll ^= sl;
        sl ^= ll;
        yl = true;
    }

    dlt = ll < 0 ? -1 : 1;
    mul = (ll === 0) ? sl : sl / ll;

    if (yl) {
        x1 += 0.5;  // preset for rounding
        for (i = 0; i !== ll; i += dlt) setPixel((x1 + i * mul) | 0, y1 + i, colour);
    } else {
        y1 += 0.5;
        for (i = 0; i !== ll; i += dlt) setPixel(x1 + i, (y1 + i * mul) | 0, colour);
    }
    setPixel(x2, y2, colour);   // sets last pixel

    // function setPixel(x, y) {
    //     if (((x < 160) && (y < 128)) && ((x > 0) && (y > 0))) {
    //         addSprite(x, y, blue_pixel)
    //     }
    // }
}

function draw_wire_frame(fx1, fy1, fz1, fx2, fy2, fz2, colour = "5") { // f stands for function

    // set initial points
    set_point1((fx1 - camx), -(fy1 - camy), -(fz1 - camz));
    set_point2((fx2 - camx), -(fy2 - camy), -(fz2 - camz));

    // rotation

    set_point1((z1 * siny) + (x1 * cosy), y1, (z1 * cosy) - (x1 * siny));
    set_point2((z2 * siny) + (x2 * cosy), y2, (z2 * cosy) - (x2 * siny));

    set_point1(x1, (y1 * cosx) - (z1 * sinx), (y1 * sinx) + (z1 * cosx));
    set_point2(x2, (y2 * cosx) - (z2 * sinx), (y2 * sinx) + (z2 * cosx));

    // rendering something the camera won't see is pointless

    if (!((z1 < near_plane) && (z2 < near_plane))) {

        zclipping();

        set_screen_point1(focal_length * (x1 / z1), focal_length * (y1 / z1));
        set_screen_point2(focal_length * (x2 / z2), focal_length * (y2 / z2));

        draw_line(80 + Math.round(x1), 64 + Math.round(y1), 80 + Math.round(x2), 64 + Math.round(y2), colour);

    }
}


// zclipping, xy clipping is taken care of when lines are drawn
function zclipping() {
    if ((z1 < near_plane) || (z2 < near_plane)) {

        percent = (near_plane - z1) / (z2 - z1);

        if (z1 < near_plane) {

            set_point1(x1 + (x2 - x1) * percent, y1 + (y2 - y1) * percent, near_plane);

        } else if (z2 < near_plane) {
            set_point2(x1 + (x2 - x1) * percent, y1 + (y2 - y1) * percent, near_plane);
        }
    }
}

function calculate_trigger_values() {
    // calculates cos and sin values so that the computer only calculates them once per frame
    cosx = Math.cos(rotx);
    sinx = Math.sin(rotx);

    cosy = Math.cos(roty);
    siny = Math.sin(roty);
}

// set screen points
function set_screen_point1(x, y) {
    x1 = Math.round(x);
    y1 = Math.round(y);
}

function set_screen_point2(x, y) {
    x2 = Math.round(x);
    y2 = Math.round(y);
}

// set points
function set_point1(x, y, z) {
    x1 = Math.round(x);
    y1 = Math.round(y);
    z1 = Math.round(z);
}

function set_point2(x, y, z) {
    x2 = Math.round(x);
    y2 = Math.round(y);
    z2 = Math.round(z);
}

// main function
function main() {
    clear();
    render();
    flushScreen()
}