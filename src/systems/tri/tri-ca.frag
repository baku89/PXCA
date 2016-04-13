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
const Cell CELL_FIRE = Cell(FIRE,	1.0,		0.0);
const Cell CELL_WATR = Cell(WATR,	0.0,		0.0);
const Cell CELL_SOIL = Cell(SOIL,	0.0,	  0.0);

const float SPEED = 0.15;

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

vec4 encode(Cell c) {
  return vec4(
  	float(c.type) / 255.0,
  	c.amp,
  	c.life,
  	1.0);
}

vec3 getTypeCount(float ox, float oy) {
	int type = int(texture2D(buffer, vUv + vec2(ox, oy)).r * 255.0 + 0.5);

	if (type <= SOIL)		 	 return vec3(0.0, 0.0, 0.0);
	else if (type == PLNT) return vec3(1.0, 0.0, 0.0);
	else if (type == FIRE) return vec3(0.0, 1.0, 0.0);
	else if (type == WATR) return vec3(0.0, 0.0, 1.0);
}


//---------------------------------------------


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell c = decode();

	float rand0 = fract(random(gl_FragCoord.xy + vec2(seed)));
	float rand1 = fract(random(gl_FragCoord.xy + vec2(time + seed)));

	if (cursorMode == 1 && innerSegment2(pos, prevPos, curtPos, brushSize2)) {
		
		

		// fill brush
		if (brushType == BLNK) 			c = CELL_BLNK;
		else if (brushType == PLNT) c = CELL_PLNT;
		else if (brushType == FIRE)	c = Cell(FIRE, mix(0.5, 1.0, rand1),	0.0);
		else if (brushType == WATR) c = CELL_WATR;
		else if (brushType == SOIL) c = CELL_SOIL;

	} else {

		
		vec3 neuman = vec3(0.0, 0.0, 0.0);

		neuman += getTypeCount(0.0, -dy);
		neuman += getTypeCount( dx, 0.0);
		neuman += getTypeCount(0.0,  dy);
		neuman += getTypeCount(-dx, 0.0);

		vec3 diag = vec3(0.0, 0.0, 0.0);

		diag += getTypeCount( dx, -dy);
		diag += getTypeCount( dx,  dy);
		diag += getTypeCount(-dx,  dy);
		diag += getTypeCount(-dx, -dy);

		vec3 moore = neuman + diag;
		// vec3 moore = vec3(0.0);

		// moore += getTypeCount(0.0, -dy);
		// moore += getTypeCount( dx, 0.0);
		// moore += getTypeCount(0.0,  dy);
		// moore += getTypeCount(-dx, 0.0);

		// moore += getTypeCount( dx, -dy);
		// moore += getTypeCount( dx,  dy);
		// moore += getTypeCount(-dx,  dy);
		// moore += getTypeCount(-dx, -dy);

		if (c.type == BLNK) {

			if (moore.z > 3.0 && rand0 < 0.05) {
				c = CELL_WATR;
			} else if ((neuman.x > 0.0 && diag.x < 2.0 && rand0 < 0.01) || moore.x > 6.0) {
				c = CELL_PLNT;
			} else if (moore.y > 0.0 && rand0 < 0.005) {
				c = Cell(FIRE, 1.0,	0.0);
			}

		} else if (c.type == PLNT) {

			c.amp -= 0.005;

			if (moore.y * SPEED > rand0) {
				c = Cell(FIRE, mix(0.5, 1.0, rand1),	0.0);
			}

		} else if (c.type == FIRE) {

			c.amp = rand1 * rand1;

			if (moore.z * SPEED > rand0) {
				c = CELL_WATR;
			}
			
		} else if (c.type == WATR) {

			if (moore.x * SPEED > rand0) {
				c = Cell(PLNT, mix(0.5, 1.0, rand1), 0.0);
			}

		}

		c.life = moore.y / 8.0;


	}

	gl_FragColor = encode(c);

}
