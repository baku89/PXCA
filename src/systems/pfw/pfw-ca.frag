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

varying vec2 vUv;

//---------------------------------------------
// consts

struct Cell {
	int type;
	float amp;
	float life;
};

const int BLNK = 0;
const int SOIL = 32;
const int PLNT = 64;
const int FIRE = 96;
const int WATR = 128;

//                      			[type][amp][life]
const Cell CELL_BLNK = Cell(BLNK,	0.0,		0.0);
const Cell CELL_PLNT = Cell(PLNT,	0.0,		0.0);
const Cell CELL_FIRE = Cell(FIRE,	0.0,		0.0);
const Cell CELL_WATR = Cell(WATR,	0.0,		0.0);
const Cell CELL_SOIL = Cell(SOIL,	0.0,	  0.0);

// const float FIRE_FALLOFF = 8.0;

//---------------------------------------------
// functions

Cell decode() {
	vec3 v = texture2D(buffer, vUv).rgb;
	return Cell(
		int(v.r * 255.0 + 0.5),
		v.g,
		v.b
	);
}

// Cell get(float ox, float oy) {
// 	vec3 v = texture2D(buffer, vUv + vec2(ox, oy)).rgb;
// 	return Cell(
// 		int(v.r * 255.0 + 0.5),
// 		v.g,
// 		v.b
// 	);
// }

// int getType(float ox, float oy) {
// 	return int(texture2D(buffer, vUv + vec2(ox, oy)).r * 255 + 0.5);
// }

vec4 encode(Cell c) {
  return vec4(
  	float(c.type) / 255.0,
  	c.amp,
  	c.life,
  	1.0);
}

vec3 getTypeCount(float ox, float oy) {
	int type = int(texture2D(buffer, vUv + vec2(ox, oy)).r * 255.0 + 0.5);

	if (type == SOIL)		 	 return vec3(0.0, 0.0, 0.0);
	else if (type == PLNT) return vec3(1.0, 0.0, 0.0);
	else if (type == FIRE) return vec3(0.0, 1.0, 0.0);
	else if (type == WATR) return vec3(0.0, 0.0, 1.0);
}


// int receiveFire(float ox, float oy, int point) {
// 	Cell nc = get(ox, oy);

// 	if (nc.type == XPLD || mod(float(nc.dir / point), 2.0) > 0.0) {
// 		return point;
// 	} else {
// 		return 0;
// 	}
// }

// bool willBurned() {
// 	return get(0.0, -dy).type >= FIRE
// 		||   get( dx, 0.0).type >= FIRE
// 		||   get(0.0,  dy).type >= FIRE
// 		||   get(-dx, 0.0).type >= FIRE;
// }

float rand() {
	return random(gl_FragCoord.xy + vec2(time));
}

float rand(float seed) {
	return random(gl_FragCoord.xy + vec2(time + seed));
}

// Cell generateFire(int dir, float minLife, float maxLife) {
// 	return Cell(FIRE, dir, mix(minLife, maxLife, rand()));
// }


//---------------------------------------------


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell c = decode();

	if (cursorMode == 1 && innerSegment2(pos, prevPos, curtPos, brushSize2)) {
		
		// fill brush
		if (brushType == BLNK) 			c = CELL_BLNK;
		else if (brushType == PLNT) c = CELL_PLNT;
		else if (brushType == FIRE)	c = CELL_FIRE;
		else if (brushType == WATR) c = CELL_WATR;
		else if (brushType == SOIL) c = CELL_SOIL;

	} else {

		vec3 num = vec3(0.0, 0.0, 0.0);

		num += getTypeCount(0.0, -dy);
		num += getTypeCount(-dx, -dy);
		num += getTypeCount(-dx, 0.0);
		num += getTypeCount(-dx,  dy);
		num += getTypeCount(0.0,  dy);
		num += getTypeCount( dx,  dy);
		num += getTypeCount( dx, 0.0);
		num += getTypeCount( dx, -dy);


		// if (rand() < 0.05) {

		// }

		float rand0 = rand();
		float rand1 = rand(seed);
		float rand2 = rand(seed * time);

		if (c.type == BLNK) {

			if (num.z > 0.0 && rand0 < 0.01) {
				c = CELL_WATR;
			}

		} else if (c.type == PLNT) {

			if (num.y * SPEED > rand0) {
				c = CELL_FIRE;
			}

		} else if (c.type == FIRE) {

			c.amp = rand0;

			if (num.z * SPEED > rand1) {

				c = CELL_WATR;

			} else if (8.0 - num.y > rand2 * 800.0 ) {

				c = CELL_BLNK;

			}

			
		} else if (c.type == WATR) {

			if (num.x * SPEED > rand0) {
				c = CELL_PLNT;	

			}

		}

		// if (c.type == BLNK) {

		// 	int dir = 0;
		// 	dir += receiveFire(0.0, -dy,   1);
		// 	dir += receiveFire(-dx, -dy,   2);
		// 	dir += receiveFire(-dx, 0.0,   4);
		// 	dir += receiveFire(-dx,  dy,   8);
		// 	dir += receiveFire(0.0,  dy,  16);
		// 	dir += receiveFire( dx,  dy,  32);
		// 	dir += receiveFire( dx, 0.0,  64);
		// 	dir += receiveFire( dx, -dy, 128);

		// 	// spark
		// 	if (dir > 0) c = generateFire(dir, 8.0, 16.0);

		// } else if (c.type == FUSE) {

		// 	if (willBurned()) c = generateFire(0, 128.0, 256.0);

		// } else if (c.type == FIRE) {

		// 	c.life -= FIRE_FALLOFF;
		// 	if (c.life <= 0.0) c = CELL_BLNK;
		
		// } else if (c.type == BOMB) {

		// 	if (willBurned()) c = CELL_XPLD;

		// } else if ( c.type == XPLD) {

		// 	c = CELL_BLNK;
		
		// }

	}

	gl_FragColor = encode(c);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);//encode(c);

}
