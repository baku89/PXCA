precision mediump float;
precision mediump int;

uniform sampler2D buffer;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(buffer, vUv);
}