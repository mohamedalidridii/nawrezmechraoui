import { LinearFilter, Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector2, Vector4 } from 'three';
import vertexShader from './shaders/fullscreen.vert';
import fragmentShader from './shaders/signal.frag';
import { pointer } from '../pointer';

/** Fullscreen hero pass: the colour portrait as a broadcast picture. */
export class Signal {
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  uniforms;
  private force = 0;
  private last = new Vector2(pointer.x, pointer.y);
  private target = new Vector2();
  private baseY = 0;

  constructor(
    private dpr: number,
    private mobile: boolean,
  ) {
    this.uniforms = {
      uTexture: { value: null },
      uImage: { value: new Vector2(4, 5) },
      uBox: { value: new Vector4() },
      uMouse: { value: new Vector2(-9999, -9999) },
      uMouseForce: { value: 0 },
      uTime: { value: 0 },
      uTune: { value: 0 },
      uOut: { value: 0 },
      uDpr: { value: dpr },
      uSplit: { value: 6 },
    };
    this.mesh = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms, transparent: true, depthTest: false, depthWrite: false }),
    );
    this.mesh.frustumCulled = false;
  }

  load(src: string) {
    return new Promise<void>((resolve) => {
      new TextureLoader().load(
        src,
        (texture) => {
          texture.minFilter = LinearFilter;
          texture.generateMipmaps = false;
          this.uniforms.uTexture.value = texture as never;
          this.uniforms.uImage.value.set(texture.image.width, texture.image.height);
          resolve();
        },
        undefined,
        () => resolve(),
      );
    });
  }

  resize(w: number, h: number) {
    this.uniforms.uDpr.value = this.dpr;
    // Box is in CSS pixels with a bottom-left origin, matching gl_FragCoord / dpr.
    if (this.mobile || w < h) {
      const bw = Math.min(w * 0.78, h * 0.5);
      this.baseY = h * 0.6;
      this.uniforms.uBox.value.set(w * 0.5, this.baseY, bw, bw * 1.25);
    } else {
      const bh = h * 0.8;
      this.baseY = h * 0.48;
      this.uniforms.uBox.value.set(w * 0.7, this.baseY, bh * 0.8, bh);
    }
  }

  update(time: number) {
    const u = this.uniforms;
    u.uTime.value = time;
    // Ride up with the page, a touch slower than the text, while it tears away.
    u.uBox.value.y = this.baseY + scrollY * 0.75;
    const moved = Math.hypot(pointer.x - this.last.x, pointer.y - this.last.y);
    this.last.set(pointer.x, pointer.y);
    this.force += (Math.min(moved / 18, 1) - this.force) * (moved > 0.5 ? 0.12 : 0.025);
    u.uMouseForce.value = pointer.active ? 0.25 + this.force * 0.75 : 0;
    this.target.set(pointer.x, innerHeight - pointer.y);
    u.uMouse.value.lerp(this.target, u.uMouse.value.x < -999 ? 1 : 0.14);
    u.uSplit.value = 0.6 + (1 - u.uTune.value) * 9 + u.uOut.value * 14 + this.force * 1.5;
    this.mesh.visible = u.uOut.value < 0.995;
  }
}
