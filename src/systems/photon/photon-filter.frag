precision mediump float;
precision mediump int;

#pragma glslify: distanceSquared = require(../../shaders/distance-squared.glsl)

//---------------------------------------------

uniform sampler2D buffer;
uniform vec2 resolution;
uniform vec4 shareRect; // (left, top, right, bottom)
uniform vec2 curtPos;
uniform float brushSize2;
uniform float outerOpacity;

uniform sampler2D rainbow;

varying vec2 vUv;

//---------------------------------------------
// consts

struct Cell {
	int type;
	int dir;
	float hue;
};

const int BLNK = 0;
const int WALL = 32;
const int MIRR = 64;
const int LGHT = 96;
const int PHOT = 128;

const vec3 COLOR_BLNK		= vec3(0.184, 0.152, 0.211);
const vec3 COLOR_WALL		= vec3(0.270, 0.207, 0.356);
const vec3 COLOR_MIRR		= vec3(0.760, 0.878, 0.921);
const vec3 COLOR_LGHT		= vec3(1.0, 1.0, 1.0);

const vec3 BRUSH_HIGHLIHGT = vec3(0.1);
const vec3 OUTER_COLOR = vec3(0.133, 0.133, 0.133);

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


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell c = decode();
	vec3 color = vec3(0.0);

	vec3 lightColor = texture2D(rainbow, vec2(c.hue, 0.0)).rgb;
	
	if (c.type == BLNK) {
		color = COLOR_BLNK;

	} else if (c.type == WALL) {

		color = mix(COLOR_WALL, lightColor, float(c.dir) / 255.0);

	} else if (c.type == MIRR) {

		color = COLOR_MIRR;
	
	} else if (c.type == LGHT) {

		color = COLOR_LGHT;

	} else if (c.type == PHOT) {

		color = lightColor;
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

	
	gl_FragColor = vec4(color, 1.0);

}