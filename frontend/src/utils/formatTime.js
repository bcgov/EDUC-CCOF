export default function formatTime(v) {
  let hour = v.split(':')[0];
  hour = parseInt(hour);

  let minute = v.split(':')[1];
  if (hour === 0) {
    return `12:${minute} AM`;
  } else if (hour < 12) {
    return `${hour}:${minute} AM`;
  } else {
    return `${hour - 12}:${minute} PM`;
  }
}
