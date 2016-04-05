#pragma glslify: innerSegment = require(./ca-functions.glsl)

uniform sampler2D buffer;
uniform vec2 resolution;
uniform vec2 prevPos;
uniform vec2 curtPos;

uniform float brushSize;
uniform int 	brushType;

varying vec2 vUv;

void main() {

	vec2 pos = vUv * resolution;

	vec4 color = texture2D(buffer, vUv);

	if (innerSegment(pos, prevPos, curtPos, brushSize)) {

		color.r = 1.0;

	}

	gl_FragColor = color;

}