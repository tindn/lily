export function toSimpleDateString(date) {
  if (!(date instanceof Date) && date.toDate) {
    date = date.toDate();
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function toWeekDayDateString(date) {
  if (!(date instanceof Date) && date.toDate) {
    date = date.toDate();
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
