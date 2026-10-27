// Shared pointer state, in pixels and normalised device coordinates.
export const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, active: false };

addEventListener(
  'pointermove',
  (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ny = -(e.clientY / innerHeight) * 2 + 1;
    pointer.active = true;
  },
  { passive: true },
);
