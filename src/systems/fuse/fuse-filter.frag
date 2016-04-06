uniform sampler2D buffer;
uniform vec2 resolution;

uniform vec4 shareRect;
// (x, y, z, w) = (left, top, right, bottom)

uniform vec2 curtPos;
uniform int brushType;
uniform float brushSize2;

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

const vec3 COLOR_BLNK		= vec3(0.278, 0.302, 0.322);
const vec3 COLOR_WALL1	= vec3(0.153, 0.18, 0.22);
const vec3 COLOR_WALL2	= vec3(0.196, 0.224, 0.259);
const vec3 COLOR_FUSE		= vec3(0.835, 0.843, 0.749);
const vec3 COLOR_BOMB		= vec3(0.855, 0.851, 0.361);
const vec3 COLOR_FIRE_BIRTH = vec3(0.933, 0.568, 0.129);
const vec3 COLOR_FIRE_DEATH	= vec3(0.960, 0.149, 0.380);

const float OPACITY_SHARE = 0.96;

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


void main() {

	vec2 pos = gl_FragCoord.xy;

	Cell cell = decode();
	vec3 color = vec3(0.0);
	
	if (cell.type == BLNK) {
		color = COLOR_BLNK;

	} else if ( cell.type == WALL ) {
		if (mod(pos.x + pos.y, 3.0) >= 1.0)
			color = COLOR_WALL1;
		else
			color = COLOR_WALL2;
	
	} else if (cell.type == FUSE) {
		color = COLOR_FUSE;
	
	} else if (cell.type == BOMB) {
		color = COLOR_BOMB;
	
	} else {
		// fire
		color = mix(COLOR_FIRE_DEATH, COLOR_FIRE_BIRTH, cell.life / 255.0);
	}

	// cursor
	// if ( cell.a < 1.0 ) {
	// 	cell.rgb += vec3( 0.1, 0.1, 0.1 );
	// }

	// range
	// if ( !( shareRect.x <= pos.x && pos.x <= shareRect.z &&
	// 		shareRect.y <= pos.y && pos.y <= shareRect.w ) ) {
	// 	cell.rgb *= OPACITY_SHARE;
	// }
	
	gl_FragColor = vec4( color, 1.0 );
}