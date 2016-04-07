#pragma glslify: random = require(glsl-random) 
#pragma glslify: innerSegment2 = require(../../shaders/inner-segment2.glsl)

//---------------------------------------------

uniform float dx;
uniform float dy;

uniform sampler2D buffer;
uniform vec2 resolution;
uniform vec2 prevPos;
uniform vec2 curtPos;

uniform float brushSize2;
uniform int 	brushType;
uniform int 	cursorMode;

varying vec2 vUv;

//---------------------------------------------
// consts

struct Cell {
	int type;
	int dir;
	float life;
};

const int BLNK = 0;
const int WALL = 32;
const int FUSE = 64;
const int BOMB = 96;
const int FIRE = 128;
const int XPLD = 160;

//                      			[type][dir][life]
const Cell CELL_BLNK = Cell(BLNK,	0,		0.0);
const Cell CELL_WALL = Cell(WALL,	0,		0.0);
const Cell CELL_FUSE = Cell(FUSE,	0,		0.0);
const Cell CELL_BOMB = Cell(BOMB,	0,		0.0);
const Cell CELL_FIRE = Cell(FIRE,	0,	255.0);
const Cell CELL_XPLD = Cell(XPLD,	0,		0.0);

const float FIRE_FALLOFF = 8.0;

//---------------------------------------------
// functions

Cell decode() {
	vec3 v = texture2D(buffer, vUv).rgb * 255.0;
	return Cell(
		int(v.r + 0.5),
		int(v.g + 0.5),
		v.b
	);
}

Cell get(float ox, float oy) {
	vec3 v = texture2D(buffer, vUv + vec2(ox, oy)).rgb * 255.0;
	return Cell(
		int(v.r + 0.5),
		int(v.g + 0.5),
		v.b
	);
}

vec4 encode(Cell c) {
  return vec4(
  	float(c.type) / 255.0,
  	float(c.dir) / 255.0,
  	c.life / 255.0,
  	1.0);
}


int receiveFire(float ox, float oy, int point) {
	Cell nc = get(ox, oy);

	if (nc.type == XPLD || mod(float(nc.dir / point), 2.0) > 0.0) {
		return point;
	} else {
		return 0;
	}
}

bool willBurned() {
	return get(0.0, -dy).type >= FIRE
		||   get( dx, 0.0).type >= FIRE
		||   get(0.0,  dy).type >= FIRE
		||   get(-dx, 0.0).type >= FIRE;
}

float rand() {
	return random(gl_FragCoord.xy);
}

Cell generateFire(int dir, float minLife, float maxLife) {
	return Cell(FIRE, dir, mix(minLife, maxLife, rand()));
}


//---------------------------------------------


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell c = decode();

	if (cursorMode == 1 && innerSegment2(pos, prevPos, curtPos, brushSize2)) {
		
		// fill brush
		if (brushType == FUSE) 			c = CELL_FUSE;
		else if (brushType == FIRE) c = generateFire(0, 64.0, 128.0);
		else if (brushType == BOMB)	c = CELL_BOMB;
		else if (brushType == BLNK) c = CELL_BLNK;
		else if (brushType == WALL) c = CELL_WALL;

	} else {

		if (c.type == BLNK) {

			int dir = 0;
			dir += receiveFire(0.0, -dy,   1);
			dir += receiveFire(-dx, -dy,   2);
			dir += receiveFire(-dx, 0.0,   4);
			dir += receiveFire(-dx,  dy,   8);
			dir += receiveFire(0.0,  dy,  16);
			dir += receiveFire( dx,  dy,  32);
			dir += receiveFire( dx, 0.0,  64);
			dir += receiveFire( dx, -dy, 128);

			// spark
			if (dir > 0) c = generateFire(dir, 8.0, 16.0);

		} else if (c.type == FUSE) {

			if (willBurned()) c = generateFire(0, 128.0, 256.0);

		} else if (c.type == FIRE) {

			c.life -= FIRE_FALLOFF;
			if (c.life <= 0.0) c = CELL_BLNK;
		
		} else if (c.type == BOMB) {

			if (willBurned()) c = CELL_XPLD;

		} else if ( c.type == XPLD) {

			c = CELL_BLNK;
		
		}
	}

	// gl_FragColor = encode(c);
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);//encode(c);

}
