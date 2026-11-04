// Client clocks can be wrong (e.g. manually adjusted after a missed time zone change). Token and session expiry
// must be evaluated against server time, so track the offset between the client clock and the server clock.
const OFFSET_KEY = 'serverClockOffset';

export function updateServerClock(serverTime) {
  const serverMs = Number(serverTime);
  if (serverMs > 0) {
    localStorage.setItem(OFFSET_KEY, String(serverMs - Date.now()));
  }
}

export function serverNow() {
  return Date.now() + (Number(localStorage.getItem(OFFSET_KEY)) || 0);
}
