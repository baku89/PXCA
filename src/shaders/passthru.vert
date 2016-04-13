precision mediump float;
precision mediump int;

attribute vec3 position;
attribute vec2 uv;

varying vec2 coord;

void main() {
	coord = uv;
	gl_Position = vec4( position, 1.0 );
}