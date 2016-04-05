#define BLNK 0
#define WALL 1
#define FUSE 2
#define BOMB 3
#define FIRE 4
#define XPLD 5

varying vec2 coord;
uniform sampler2D buffer;

// resolution
uniform vec2 resolution;
uniform vec4 shareRect;
// (x, y, z, w) = (left, top, right, bottom)

// cursor
uniform vec2 cntMouse;
uniform int brushType;
uniform float brushSize;

// theme
uniform vec3 colorBlnk;
uniform vec3 colorWallBg;
uniform vec3 colorWallLn;
uniform vec3 colorFuse;
uniform vec3 colorBomb;
uniform vec3 colorFireFr;
uniform vec3 colorFireBk;
uniform float opacityShare;

void main() {

	vec4 cell = texture2D( buffer, coord );
	int type = int( cell.r * 255.0 + 0.5 );
	vec2 pos = floor( coord * resolution );
	
	if ( type == BLNK ) {
		cell.rgb = colorBlnk;
	
	} else if ( type == WALL ) {
		if ( mod( pos.x + pos.y, 3.0 ) >= 1.0 )
			cell.rgb = colorWallBg;
		else {
			cell.rgb = colorWallLn;
		}
	
	} else if ( type == FUSE ) {
		cell.rgb = colorFuse;
	
	} else if ( type == BOMB ) {
		cell.rgb = colorBomb;
	
	} else {
		// fire
		cell.rgb = mix( colorFireBk, colorFireFr, cell.b );
	}

	// cursor
	if ( cell.a < 1.0 ) {
		cell.rgb += vec3( 0.1, 0.1, 0.1 );
	}

	// range
	if ( !( shareRect.x <= pos.x && pos.x <= shareRect.z &&
			shareRect.y <= pos.y && pos.y <= shareRect.w ) ) {
		cell.rgb *= opacityShare;
	}
	
	gl_FragColor = vec4( cell.rgb, 1.0 );
}