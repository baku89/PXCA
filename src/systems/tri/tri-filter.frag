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

const vec3 COLOR_BLNK		= vec3(0.196, 0.219, 0.270);
const vec3 COLOR_SOIL		= vec3(0.905, 0.854, 0.635);
const vec3 COLOR_SOIL2	= vec3(0.921, 0.886, 0.788);
const vec3 COLOR_PLNT		= vec3(0.443, 0.890, 0.478);
const vec3 COLOR_PLNT_YOUNG	= vec3(0.709, 0.937, 0.247);
const vec3 COLOR_FIRE_BIRTH = vec3(0.925, 0.176, 0.301);
const vec3 COLOR_FIRE_DEATH	= vec3(0.925, 0.466, 0.392);
const vec3 COLOR_WATR		= vec3(0.086, 0.301, 0.878);

const vec3 BRUSH_HIGHLIHGT = vec3(0.1);
const vec3 OUTER_COLOR = vec3(0.133, 0.133, 0.133);

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

		if (mod(pos.x + 0.5 - (pos.y + 0.5) / 2.0, 3.0) < 0.1) {
			color = COLOR_SOIL2;
		} else {
			color = COLOR_SOIL;
		}
	
	} else if (cell.type == PLNT) {

		color = mix(COLOR_PLNT, COLOR_PLNT_YOUNG, cell.amp);

	} else if (cell.type == FIRE) {
		color = mix(COLOR_FIRE_BIRTH, COLOR_FIRE_DEATH, cell.amp);
	
	} else if (cell.type == WATR) {
		color = COLOR_WATR;
	}

	// cursor
	if (distanceSquared(pos, curtPos) < brushSize2) {
		color += BRUSH_HIGHLIHGT;
	}

	// range
	if ( !(shareRect.x <= pos.x && pos.x <= shareRect.z &&
			shareRect.y <= pos.y && pos.y <= shareRect.w) ) {
		color = mix(OUTER_COLOR, color, outerOpacity);
	}

	// color.b = cell.life;

	
	gl_FragColor = vec4(color, 1.0);

}