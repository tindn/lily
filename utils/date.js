export function toSimpleDateString(date) {
  if (!date) {
    return '';
  }
  if (!(date instanceof Date)) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function toWeekDayDateString(date) {
  if (!date) {
    return '';
  }
  if (!(date instanceof Date)) {
    return '';
  }
  if (date)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
}
