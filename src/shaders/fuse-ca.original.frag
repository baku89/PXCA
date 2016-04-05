#define SCALE 4.0

#define BLNK 0
#define WALL 1
#define FUSE 2
#define BOMB 3
#define FIRE 4
#define XPLD 5

#define FIRE_LIFE 8

//                      [type][dir][life]
#define CELL_BLNK ivec4( BLNK,    0,    0, 255 )
#define CELL_WALL ivec4( WALL,    0,    0, 255 )
#define CELL_FUSE ivec4( FUSE,    0,    0, 255 )
#define CELL_BOMB ivec4( BOMB,    0,    0, 255 )
#define CELL_FIRE ivec4( FIRE,    0,  255, 255 )
#define CELL_XPLD ivec4( XPLD,    0,    0, 255 )

uniform vec2 resolution;
uniform vec2 cntMouse;
uniform vec2 prevMouse;

uniform int isMouseDown;

uniform float brushSize;
uniform int brushType;

uniform int  isPause;

float rand() {

    return fract( sin(dot(coord ,vec2(12.9898,78.233))) * 43758.5453 );
}

int receiveFire( float offsetX, float offsetY, int point ) {

    ivec4 neighborCell = neighbor( offsetX, offsetY );

    if ( neighborCell.r == XPLD || mod( float( neighborCell.g / point ), 2.0 ) > 0.0 ) {

        return point;

    } else {

        return 0;
    }
}

float segmentDistance( vec2 p, vec2 l1, vec2 l2) {

    float a2 = pow( distance(l1, p), 2.0 );
    float b2 = pow( distance(l2, p), 2.0 );
    float c  = abs( distance(l1, l2) );
    float c2 = c * c;

    if ( a2 + c2 < b2 || b2 + c2 < a2 ) {
        return 10000000.0;
    }

    float x = ( a2 - b2 + c2) / ( 2.0 * c );

    return sqrt( a2 - x*x );
}

void main() {

    ivec4 cell = decode();

    vec2 pixelPosition = coord * resolution;

    if ( isMouseDown != 0 &&
         ( segmentDistance( pixelPosition, cntMouse, prevMouse ) <= brushSize ||
           distance( pixelPosition, cntMouse ) <= brushSize ||
           distance( pixelPosition, prevMouse ) <= brushSize ) )  {

        if ( brushType == FUSE ) {

            cell = CELL_FUSE;

        } else if ( brushType == FIRE ) {

            cell = ivec4( FIRE, 0, int( (rand()+1.0) * 64.0 ), 255 );

        } else if ( brushType == BOMB ) {

            cell = CELL_BOMB;

        } else if ( brushType == BLNK ) {

            cell = CELL_BLNK;

        } else if ( brushType == WALL ) {

            cell = CELL_WALL;
        }

    } else if ( isPause == 1 ) {

    } else if ( cell.r < WALL ) {

        int fire = 0;

        // from XPLD cell
        fire += receiveFire( 0.0, -dy,   1 );
        fire += receiveFire( -dx, -dy,   2 );
        fire += receiveFire( -dx, 0.0,   4 );
        fire += receiveFire( -dx,  dy,   8 );
        fire += receiveFire( 0.0,  dy,  16 );
        fire += receiveFire(  dx,  dy,  32 );
        fire += receiveFire(  dx, 0.0,  64 );
        fire += receiveFire(  dx, -dy, 128 );

        if ( fire > 0 ) {
            cell = ivec4( FIRE, fire, int(rand()+1.5) * FIRE_LIFE, 255 );
        }

    } else if ( cell.r == FUSE ) {

        if ( neighbor( 0.0, -dy ).r >= FIRE ||
             neighbor(  dx, 0.0 ).r >= FIRE ||
             neighbor( 0.0,  dy ).r >= FIRE ||
             neighbor( -dx, 0.0 ).r >= FIRE ) {

            cell = ivec4( FIRE, 0, int( (rand()+1.0) * 128.0 ), 255 );
        }

    } else if ( cell.r == FIRE ) {

        cell.b -= FIRE_LIFE;

        if ( cell.b <= 0 ) {
            cell = CELL_BLNK;
        }

    } else if ( cell.r == BOMB ) {

        if ( neighbor( 0.0, -dy ).r >= FIRE ||
             neighbor(  dx, 0.0 ).r >= FIRE ||
             neighbor( 0.0,  dy ).r >= FIRE ||
             neighbor( -dx, 0.0 ).r >= FIRE ) {

            cell = CELL_XPLD;
        }

    } else if ( cell.r == XPLD ) {

        cell = CELL_BLNK;
    }


    if ( distance( pixelPosition, cntMouse ) <= brushSize ) {

       cell.a = 254;

    } else {

       cell.a = 255;

    }

    gl_FragColor = encode( cell );
}