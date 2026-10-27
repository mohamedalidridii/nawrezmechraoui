// DOM-synced image planes: a perspective bend driven by scroll velocity.
uniform float uVelocity;
uniform float uHover;

varying vec2 vUv;

const float PI = 3.141592653589793;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  float bulge = sin(uv.y * PI) * sin(uv.x * PI);
  world.z += bulge * (uVelocity * 4.0 + uHover * 18.0);
  world.y += sin(uv.x * PI) * uVelocity * 1.1;
  gl_Position = projectionMatrix * viewMatrix * world;
}
