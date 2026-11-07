// Browser-only feedback helpers for the student mode. Only call from event handlers/effects.

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.9;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

let ctx: AudioContext | null = null;
function audio() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.18) {
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, a.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.05);
}

export function chimeSuccess() {
  tone(659, 0, 0.18, "triangle");
  tone(880, 0.1, 0.22, "triangle");
  tone(1175, 0.2, 0.32, "triangle");
}

export function chimeTry() {
  tone(330, 0, 0.18, "sine", 0.12);
  tone(262, 0.12, 0.25, "sine", 0.12);
}

export function fanfare() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.35, "triangle", 0.16));
}

export async function confettiBurst() {
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#e07a3f", "#f2c94c", "#7fb04a", "#5aa6d6", "#e0607e"];
  confetti({ particleCount: 140, spread: 90, origin: { y: 0.65 }, colors, scalar: 1.3 });
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400);
}

export async function confettiSmall() {
  const { default: confetti } = await import("canvas-confetti");
  confetti({ particleCount: 40, spread: 55, startVelocity: 30, origin: { y: 0.7 }, scalar: 1.1, colors: ["#f2c94c", "#7fb04a", "#e07a3f"] });
}
