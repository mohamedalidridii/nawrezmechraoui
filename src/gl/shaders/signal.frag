// Hero "signal": the colour portrait as a broadcast picture. It tunes in from static,
// carries fine scanlines at rest, wobbles softly under the pointer and tears away on scroll.
uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec4 uBox;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform float uTime;
uniform float uTune;
uniform float uOut;
uniform float uDpr;
uniform float uSplit;

varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  float stat = 1.0 - uTune;

  // Horizontal sync tearing in 18px bands: strong while tuning or leaving, gone at rest.
  float tear = hash(vec2(floor(p.y / 18.0), floor(uTime * 12.0))) - 0.5;
  float md = distance(p, uMouse);
  float m = exp(-md * md / 32000.0) * uMouseForce;
  float off = tear * (stat * stat * 180.0 + uOut * uOut * 260.0) + sin(p.y * 0.05 - uTime * 7.0) * m * 10.0;

  vec2 q = p - uBox.xy + vec2(off, 0.0);
  float inside = 1.0 - smoothstep(-1.0, 1.0, sdBox(q, uBox.zw * 0.5, 4.0));
  if (inside <= 0.0) discard;

  float ra = uBox.z / uBox.w;
  float ri = uImage.x / uImage.y;
  vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0);
  vec2 tuv = (q / uBox.zw) * s + 0.5;
  // A slow push-in as it tunes, so the picture settles rather than snaps.
  tuv = (tuv - 0.5) * (1.0 - 0.06 * uTune) + 0.5;

  vec2 split = vec2((uSplit + m * 5.0) / uBox.z * s.x, 0.0);
  vec3 col = vec3(
    texture2D(uTexture, tuv + split).r,
    texture2D(uTexture, tuv).g,
    texture2D(uTexture, tuv - split).b
  );

  col *= 0.94 + 0.06 * sin(p.y * 2.0944);
  float bar = exp(-pow((vUv.y - fract(1.0 - uTime * 0.045)) * 9.0, 2.0));
  col *= 1.0 + bar * 0.06;

  float snow = hash(floor(p * 0.5) + fract(uTime * 13.0));
  col = mix(col, vec3(snow) * vec3(0.86, 0.9, 1.0), smoothstep(0.0, 1.0, stat) * 0.9);

  gl_FragColor = vec4(col, inside * (1.0 - uOut));
}
