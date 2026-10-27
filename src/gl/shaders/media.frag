// Image planes: a soft row-staggered wipe on reveal, optional duotone (uTint),
// and a light RGB split from scroll velocity and hover.
uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;
uniform vec2 uMouse;
uniform float uHover;
uniform float uVelocity;
uniform float uReveal;
uniform float uTime;
uniform float uTint;
uniform vec3 uInk;
uniform vec3 uBlue;
uniform vec3 uHot;

varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453); }

vec2 cover(vec2 uv) {
  float ra = uPlane.x / uPlane.y;
  float ri = uImage.x / uImage.y;
  vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float row = floor(vUv.y * 16.0);
  float p = clamp((uReveal - hash(row + 1.0) * 0.18) / 0.82, 0.0, 1.0);
  float pe = 1.0 - pow(1.0 - p, 3.0);
  if (pe <= 0.0 || vUv.x > pe) discard;

  vec2 uv = vUv;
  vec2 c = cover(uv);
  c = (c - 0.5) * (1.0 - 0.07 * uHover - 0.18 * (1.0 - pe)) + 0.5;

  vec2 toMouse = (vUv - uMouse) * uPlane / max(uPlane.x, uPlane.y);
  float d = length(toMouse);
  c += normalize(toMouse + 0.0001) * sin(d * 38.0 - uTime * 5.0) * exp(-d * 5.0) * uHover * 0.005;

  float split = min(abs(uVelocity) * 0.0005, 0.006) + uHover * 0.002 + (1.0 - pe) * 0.01;
  vec2 dir = normalize(vec2(uHover + (1.0 - pe) + 0.001, uVelocity * 0.12));
  vec3 col = vec3(
    texture2D(uTexture, c + dir * split).r,
    texture2D(uTexture, c).g,
    texture2D(uTexture, c - dir * split).b
  );

  float l = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(uInk, uBlue, smoothstep(0.05, 0.95, l));
  col = mix(col, duo, uTint * (1.0 - uHover));
  col *= 0.95 + 0.05 * sin(vUv.y * uPlane.y * 1.4);

  // Hot leading edge on each row while it wipes in.
  float front = 1.0 - smoothstep(0.0, 0.012, pe - vUv.x);
  col = mix(col, uHot, front * (1.0 - p));

  gl_FragColor = vec4(col, 1.0);
}
