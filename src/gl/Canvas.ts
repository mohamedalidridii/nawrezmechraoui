import { ColorManagement, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Media } from './Media';
import { Signal } from './Signal';

// Shaders here work in plain sRGB values end to end; skip three's linear conversions.
ColorManagement.enabled = false;

/** One fixed renderer: the fullscreen hero signal plus a pixel-mapped scene for DOM images. */
export class GL {
  renderer: WebGLRenderer;
  signal: Signal;
  media: Media;
  private signalScene = new Scene();
  private mediaScene = new Scene();
  private camera = new PerspectiveCamera(45, 1, 10, 4000);

  constructor(canvas: HTMLCanvasElement, mobile: boolean) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
    // The scanline shader is per-pixel heavy; 1.5x is visually indistinguishable from 2x for thin lines.
    const dpr = Math.min(devicePixelRatio, 1.5);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = false;

    this.signal = new Signal(dpr, mobile);
    this.signalScene.add(this.signal.mesh);

    this.media = new Media(this.renderer);
    this.mediaScene.add(this.media.group);

    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = innerWidth;
    const h = innerHeight;
    this.renderer.setSize(w, h, false);

    // Place the camera so one world unit equals one CSS pixel at z = 0.
    const dist = 1200;
    this.camera.position.z = dist;
    this.camera.fov = (2 * Math.atan(h / 2 / dist) * 180) / Math.PI;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.signal.resize(w, h);
    this.media.resize(w, h);
  }

  render(time: number, velocity: number) {
    this.signal.update(time);
    this.media.update(time, velocity);
    this.renderer.clear();
    if (this.signal.mesh.visible) this.renderer.render(this.signalScene, this.camera);
    this.renderer.render(this.mediaScene, this.camera);
  }
}
