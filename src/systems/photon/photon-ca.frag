precision mediump float;
precision mediump int;

#pragma glslify: random = require(glsl-random) 
#pragma glslify: innerSegment2 = require(../../shaders/inner-segment2.glsl)

//---------------------------------------------

uniform float dx;
uniform float dy;

uniform sampler2D buffer;
uniform float time;
uniform float seed;
uniform vec2 resolution;
uniform vec2 prevPos;
uniform vec2 curtPos;

uniform float brushSize2;
uniform int 	brushType;
uniform int 	cursorMode;
uniform int 	isUpdateCA;

varying vec2 vUv;

//---------------------------------------------
// consts

struct Cell {
	int type;
	int dir;
	float hue;
};

const int BLNK = 0;
const int MIRR = 32;
const int WALL = 64;
const int LGHT = 96;
const int PHOT = 128;

const int DIR_TR 			= 4;
const int DIR_BR 			= 8;
const int DIR_BL 			= 16;
const int DIR_TL			= 32;
const int DIR_UNI				= 60;

//                      		[type][dir]			[hue]
const Cell CELL_BLNK = Cell(BLNK,	0,				0.0);
const Cell CELL_MIRR = Cell(MIRR,	0,				0.0);
const Cell CELL_WALL = Cell(WALL,	0,				0.0);
const Cell CELL_LGHT = Cell(LGHT,	DIR_UNI,	0.0);
const Cell CELL_PHOT = Cell(PHOT,	0,	  		0.0);

//---------------------------------------------
// functions

Cell decode() {
	vec3 v = texture2D(buffer, vUv).rgb;
	return Cell(
		int(v.r * 255.0 + 0.5),
		int(v.g * 255.0 + 0.5),
		v.b
	);
}

Cell get(float ox, float oy) {
	vec3 v = texture2D(buffer, vUv + vec2(ox, oy)).rgb;
	return Cell(
		int(v.r * 255.0 + 0.5),
		int(v.g * 255.0 + 0.5),
		v.b
	);
}

int getType(float ox, float oy) {
	return int(texture2D(buffer, vUv + vec2(ox, oy)).r * 255.0 + 0.5);
}

vec4 encode(Cell c) {
  return vec4(
  	float(c.type) / 255.0,
  	float(c.dir) / 255.0,
  	c.hue,
  	1.0);
}

bool movePhoton(Cell c, int dir) {
	return (c.type == PHOT || (c.type == LGHT && mod(time, 16.0) < 1.0))
		&& mod(float(c.dir / dir), 2.0) > 0.0;
	// return c.type >= LGHT && mod(float(c.dir / dir), 2.0) > 0.0;

}

bool comeFrom(int target, int dir) {
	return mod(float(target / dir), 2.0) > 0.0;
}



//---------------------------------------------


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell c = decode();

	float rand0 = fract(random(gl_FragCoord.xy + vec2(seed)));
	float rand1 = fract(random(gl_FragCoord.xy + vec2(time * 1000.0 + seed)));

	if (cursorMode == 1 && innerSegment2(pos, prevPos, curtPos, brushSize2)) {

		// fill brush
		if (brushType == BLNK) 			c = CELL_BLNK;
		else if (brushType == WALL) c = CELL_WALL;
		else if (brushType == MIRR) c = CELL_MIRR;
		else if (brushType == LGHT)	c = CELL_LGHT;

	} else if (isUpdateCA == 1) {

		// propagate photon
		if (c.type == BLNK || c.type == PHOT) {

			int dir = 0;
			float hue = 0.0;
			float hueDivide = 0.0;

			Cell nc = get(dx, -dy);
			if (movePhoton(nc, DIR_TR)) {dir += DIR_TR; hue += nc.hue; hueDivide += 1.0;}

			nc = get(dx, dy);
			if (movePhoton(nc, DIR_BR)) {dir += DIR_BR; hue += nc.hue; hueDivide += 1.0;}

			nc = get(-dx, dy);
			if (movePhoton(nc, DIR_BL)) {dir += DIR_BL; hue += nc.hue; hueDivide += 1.0;}

			nc = get(-dx, -dy);
			if (movePhoton(nc, DIR_TL)) {dir += DIR_TL; hue += nc.hue; hueDivide += 1.0;}

			if (dir > 0) {
				c = Cell(PHOT, dir, fract(hue / hueDivide));
			} else {
				c = CELL_BLNK;
			}
		}

		Cell tc = get(0.0, -dy);
		Cell rc = get(dx, 0.0);
		Cell bc = get(0.0, dy);
		Cell lc = get(-dx, 0.0);

		if (c.type == LGHT) {

			c.hue = fract(c.hue + 0.01);

		} else if (c.type == PHOT) {

			// reflect
			if (tc.type == MIRR) {
				if (comeFrom(c.dir, DIR_BR)) c.dir += DIR_TR;
				if (comeFrom(c.dir, DIR_BL)) c.dir += DIR_TL;
			}

			if (rc.type == MIRR) {
				if (comeFrom(c.dir, DIR_BL)) c.dir += DIR_BR;
				if (comeFrom(c.dir, DIR_TL)) c.dir += DIR_TR;
			}

			if (bc.type == MIRR) {
				if (comeFrom(c.dir, DIR_TR)) c.dir += DIR_BR;
				if (comeFrom(c.dir, DIR_TL)) c.dir += DIR_BL;
			}

			if (lc.type == MIRR) {
				if (comeFrom(c.dir, DIR_TR)) c.dir += DIR_TL;
				if (comeFrom(c.dir, DIR_BR)) c.dir += DIR_BL;
			}

		} else if (c.type == WALL) {

			float energy = float(c.dir) / 255.0;
			float hue = 0.0;
			float hueDivide = 0.0;

			if (tc.type >= LGHT) {hue += tc.hue; energy = 1.0; hueDivide += 1.0;}
			if (rc.type >= LGHT) {hue += rc.hue; energy = 1.0; hueDivide += 1.0;}
			if (bc.type >= LGHT) {hue += bc.hue; energy = 1.0; hueDivide += 1.0;}
			if (lc.type >= LGHT) {hue += lc.hue; energy = 1.0; hueDivide += 1.0;}


			if (hueDivide > 0.0) {
				c.hue = fract(hue / hueDivide);
			}
			
			energy = max(0.0, energy - 0.1);
			c.dir = int(energy * 255.0 + 0.5);

		}
	}

	gl_FragColor = encode(c);

}
