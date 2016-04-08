#pragma glslify: distanceSquared = require(../../shaders/distance-squared.glsl)

//---------------------------------------------

uniform sampler2D buffer;
uniform vec2 resolution;
uniform vec4 shareRect; // (left, top, right, bottom)
uniform vec2 curtPos;
uniform float brushSize2;
uniform float outerOpacity;

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

const vec3 COLOR_BLNK		= vec3(0.0, 0.0, 0.0);
const vec3 COLOR_SOIL		= vec3(0.5, 0.5, 0.5);
const vec3 COLOR_PLNT		= vec3(0.0, 0.843, 0.0);
const vec3 COLOR_FIRE_BIRTH = vec3(0.933, 0.568, 0.129);
const vec3 COLOR_FIRE_DEATH	= vec3(0.960, 0.149, 0.380);
const vec3 COLOR_WATR		= vec3(0.0, 0.0, 0.8);

const vec3 BRUSH_HIGHLIHGT = vec3(0.1);
const vec3 OUTER_COLOR = vec3(0.0, 0.0, 0.0);

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


void main() {

	

	vec2 pos = gl_FragCoord.xy;

	Cell cell = decode();
	vec3 color = vec3(0.0);
	
	if (cell.type == BLNK) {
		color = COLOR_BLNK;

	} else if (cell.type == SOIL) {
		color = COLOR_SOIL;
	
	} else if (cell.type == PLNT) {
		color = COLOR_PLNT;

	} else if (cell.type == FIRE) {
		color = mix(COLOR_FIRE_BIRTH, COLOR_FIRE_DEATH, cell.amp);
	
	} else if (cell.type == WATR) {
		color = COLOR_WATR;

	}

	// } else if ( cell.type == WALL ) {
	// 	if (mod(pos.x + pos.y, 3.0) >= 1.0)
	// 		color = COLOR_WALL1;
	// 	else
	// 		color = COLOR_WALL2;
	
	// } else if (cell.type == FUSE) {
	// 	color = COLOR_FUSE;
	
	// } else if (cell.type == BOMB) {
	// 	color = COLOR_BOMB;
	
	// } else {
	// 	// fire
	// 	color = mix(COLOR_FIRE_DEATH, COLOR_FIRE_BIRTH, cell.life / 255.0);
	// }

	// cursor
	if (distanceSquared(pos, curtPos) < brushSize2) {
		color += BRUSH_HIGHLIHGT;
	}

	// range
	if ( !(shareRect.x <= pos.x && pos.x <= shareRect.z &&
			shareRect.y <= pos.y && pos.y <= shareRect.w) ) {
		color = mix(OUTER_COLOR, color, outerOpacity);
	}

	
	gl_FragColor = vec4(color, 1.0);

}