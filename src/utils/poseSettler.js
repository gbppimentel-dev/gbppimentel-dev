// Constraint solvers can retain velocity at an apparently stationary pose.
// Sleep only after every projected point stays inside a subpixel window;
// checking the whole window also catches slow drift that tiny frame deltas miss.
export function createPoseSettler({ stillSeconds = .8, maxStepPixels = .6, maxTravelPixels = .6 } = {}) {
  let previous, anchor, calm = 0, step = 0, travel = 0, reason = 'initial';
  const reset = () => { previous = anchor = undefined; calm = 0; step = travel = 0; reason = 'reset'; };
  const distance = (a, b) => {
    let maximum = 0;
    for (let i = 0; i < a.length; i += 2) maximum = Math.max(maximum, Math.hypot(a[i] - b[i], a[i + 1] - b[i + 1]));
    return maximum;
  };
  return {
    reset,
    sample(pose, dt, enabled = true) {
      if (!enabled || !pose.length || pose.length % 2 || !pose.every(Number.isFinite)) { reset(); reason = !enabled ? 'input' : 'invalid'; return false; }
      if (!previous || previous.length !== pose.length) {
        previous = Float64Array.from(pose); anchor = Float64Array.from(pose); calm = 0; reason = 'initial';
        return false;
      }
      step = distance(pose, previous); travel = distance(pose, anchor);
      if (step > maxStepPixels || travel > maxTravelPixels) {
        anchor.set(pose); calm = 0; reason = step > maxStepPixels ? 'step' : 'travel';
      } else { calm += Math.min(1 / 30, Math.max(0, Number.isFinite(dt) ? dt : 0)); reason = 'still'; }
      previous.set(pose);
      return calm >= stillSeconds;
    },
    get calm() { return calm; },
    get step() { return step; },
    get travel() { return travel; },
    get reason() { return reason; },
  };
}
