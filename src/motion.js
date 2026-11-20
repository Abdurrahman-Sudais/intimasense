import {startFx} from './fx.js';
// Site-specific interaction settings; the visual treatment lives in styles.css.
export function startMotion() { startFx({cursor: 'aura', prefix: 'is', tilt: 4, magnet: 0.3}); }
