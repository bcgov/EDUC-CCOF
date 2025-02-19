/**
 * Formats the DD/MM/YY HH:mm format from dynamics into an ISO
 * friendly string of YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function mdyToIso(dateTimeString) {
  const [date, time] = dateTimeString.split(' ');
  const [month, day, year] = date.split('/');
  return `${year}-${month}-${day}T${time}.000Z`;
}

export default function formatTime(v) {
  let hour = v.split(':')[0];
  hour = parseInt(hour);

  let minute = v.split(':')[1];
  if (hour === 0) {
    return `12:${minute} AM`;
  } else if (hour < 12) {
    return `${hour}:${minute} AM`;
  } else if (hour === 12) {
    return `${hour}:${minute} PM`;
  } else {
    return `${hour - 12}:${minute} PM`;
  }
}
