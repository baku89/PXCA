varying vec2 vUv;

void main(void) {
	vUv = vec2(uv.x, uv.y);
	gl_Position = vec4(position, 1.0);
}