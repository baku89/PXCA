<?
require_once "./api/config.php";

//------------------------------------------------------------
// check specified post exists in DB

$attrs = [
    'id' => null,
    'map' => null,
    'thumb' => 'default_thumb.png'
];

if ( isset($_GET['n']) ) {

    $id = $_GET['n'];

    $sql = new mysqli( HOST, USER, PASSWORD, DATABASE ) or gotoBlankPage();

    $result = $sql->query( "SELECT * FROM gallery WHERE id=${id}") or gotoBlankPage();

    if ( !( !empty( $result ) && $result->num_rows > 0 ) ) {
        gotoBlankPage();
    }

    $attrs= $result->fetch_assoc();
}

function gotoBlankPage() {
    header('Location: .');
    exit;
}

//------------------------------------------------------------
// Display part
?>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no">

    <title>Fuse</title>

    <!-- Facebook OGP -->
    <meta property="og:site_name" content="Fuse">
    <meta property="og:title" content="Fuse<?= is_null($attrs['id']) ? '' : ' #' . $attrs['id'] ?>">
    <meta property="og:description" content="WebGL cellular automaton">
    <meta property="og:image" content="http://s.baku89.com/fuse/<?= is_null($attrs['id']) ? 'img/ogp.jpg' : 'data/'. $attrs['thumb'] ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="http://s.baku89.com/fuse/<?= is_null($attrs['id']) ? '' : '?n=' . $attrs['id'] ?>">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="photo">
    <meta name="twitter:site" content="@_baku89">
    <meta name="twitter:title" content="Fuse<?= is_null($attrs['id']) ? '' : ' #' . $attrs['id'] ?>">
    <meta name="twitter:description" content="WebGL cellular automaton">
    <meta name="twitter:image" content="http://s.baku89.com/fuse/<?= is_null($attrs['id']) ? 'img/ogp.jpg' : 'data/'. $attrs['thumb'] ?>">
    <meta name="twitter:url" content="http://s.baku89.com/fuse/<?= is_null($attrs['id']) ? '' : '?n=' . $attrs['id'] ?>" />

    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="./css/custom-style.css">

    <!-- Hosted JS -->
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/EaselJS/0.7.1/easeljs.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>

    <!-- GoogleFonts -->
    <link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>

    <!-- My JS -->
    <script type="text/javascript" src="./js/detectmobilebrowser.js"></script>
    <script type="text/javascript" src="./js/Detector.js"></script>
    <script type="text/javascript" src="./js/ShaderCanvas.js"></script>
    <script type="text/javascript" src="./js/CellularAutomaton.js"></script>
    <script type="text/javascript" src="./js/main.js"></script>

    <!-- shader -->
    <script id="vs__passthru" type="x-shader/x-vertex">

        varying vec2 coord;

        void main() {

            coord = uv;

            gl_Position = vec4( position, 1.0 );
        }

    </script>

    <script id="fs__passthru" type="x-shader/x-fragment">

        varying vec2 coord;
        uniform sampler2D buffer;

        void main() {

            gl_FragColor = texture2D( buffer, coord );
        }

    </script>

    <script id="fs__coloring" type="x-shader/x-fragment">

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
        uniform vec4 shareRect; // (x, y, z, w) = (left, top, right, bottom)

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

    </script>

    <script id="fs__automaton" type="x-shader/x-fragment">

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
    </script>

</head>
<body <?= is_null($attrs['id']) ? '' : ' data-id="' .$attrs['id']. '"" data-map="./data/'  .$attrs['map']. '"' ?>>

    <div class="page-wrapper">

        <canvas id="canvas"></canvas>

        <div class="loading canvas--loading"><!-- ----></div>

        <div class="tools">
            <button class="tools__btn tools__btn--fuse is-active" data-kind="Fuse">Fuse</button>
            <button class="tools__btn tools__btn--bomb" data-kind="Bomb">Bomb</button>
            <button class="tools__btn tools__btn--fire" data-kind="Fire">Fire</button>
            <button class="tools__btn tools__btn--wall" data-kind="Wall">Wall</button>
            <button class="tools__btn tools__btn--ersr" data-kind="Ersr">Eraser</button>
        </div>

        <nav class="menu">

            <a class="menu__btn">
                <div class="menu__bl1"><!-- --></div>
                <div class="menu__bl2"><!-- --></div>
                <div class="menu__bl3"><!-- --></div>
            </a>

            <ul class="menu__lists">
                <li><a class="menu__help">?</a></li>
                <li><a class="menu__gallery">Gallery</a></li>
                <li><a class="menu__share">Share</a></li>
                <li><a class="menu__clear">Clear</a></li>
            </ul>
        </nav>
        <div class="layer layer--menu-darken"><!-- --></div>

        <div class="layer layer--help">
            <div class="layer--help__container">
                <h2>Fuse</h2>
                <p>
                    This demo simulates burning fuses and exploding bombs using a method of a sort of cellular automaton(CA). Click and drag to draw a line. Select parettes on top to change brush type(<span class="fuse">fuse</span>, <span class="bomb">bomb</span>, <span class="fire">fire</span>, <span class="wall">wall</span>, <span class="ersr">eraser</span> respectively from left to right). The CA program is mainly written in GLSL.
                </p>
                <h3 class="layer--help__shortcut">Shortcuts</h3> 
                <p class="layer--help__shortcut layer--help__shortcut--left">
                    [1]: <span class="fuse">Fuse</span><br>
                    [2]: <span class="bomb">Bomb</span><br>
                    [3]: <span class="fire">Fire</span><br>
                    [4]: <span class="wall">Wall</span><br>
                    [5]: <span class="ersr">Eraser</span>
                </p>
                <p class="layer--help__shortcut layer--help__shortcut--right">
                    [s]: Share<br>
                    [↑]: Increasing brush size<br>
                    [↓]: Decreasing brush size<br>
                    [space]: Toggle play/pause
                </p>
                <p class="layer--help__credit">
                    created by <a href="http://baku89.com" target="_blank">baku</a>
                </p>
            </div>
        </div>

        <div class="layer layer--pause">
            <div class="layer--pause__message"> &gt; Click to Resume &lt;</div>
        </div>

        <div class="layer layer--share">

            <div class="is-passthru share-frame share-frame--top"><!-- --></div>
            <div class="is-passthru share-frame share-frame--right"><!-- --></div>
            <div class="is-passthru share-frame share-frame--bottom"><!-- --></div>
            <div class="is-passthru share-frame share-frame--left"><!-- --></div>

            <div class="loading layer--share__loading"><!-- --></div>

            <div class="alert">
                <div class="alert__wrapper alert__wrapper--complete">
                    <div class="alert__content">
                        <div class="alert--complete__url-wrapper">
                            <input class="alert--complete__url" type="text" value="">
                        </div>
                        <a class="alert--complete__tweet">Tweet</a>
                    </div>
                    <div class="alert__choises">
                        <button class="alert__btn alert--url__btn--gallery">See Others..</button>
                        <button class="alert__btn alert--url__btn--resume">Resume</button>
                    </div>
                </div>
                <div class="alert__wrapper alert__wrapper--failed">
                    <div class="alert__content alert--failed__content">
                        Failed to send data..
                    </div>
                    <div class="alert__choises">
                        <button class="alert__btn alert--url__btn--resume">Resume</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="layer layer--gallery">
                <ul class="layer--gallery__list is-passthru"></ul>
                <div class="loading layer--gallery__loading"><!-- --></div>
        </div>
    </div>

    <div class="unsupported">
        <img src="./img/unsupported.gif">
        <h3>Not Supported on Your Browser</h3>
        <p>
            Please visit from your pc<br>with a latest browser supporting WebGL.
        </p>
        <p class="unsupported__credit">
            created by <a href="http://baku89.com/" target="_blank">baku</a>
        </p>
    </div>

</body>
</html>