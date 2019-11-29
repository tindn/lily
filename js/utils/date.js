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

export function toWeekDayDateStringFromTimestamp(timestamp) {
  return toWeekDayDateString(new Date(timestamp));
}

export function getMonthStartEndFor(date) {
  var startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var endOfMonth = nextMonth(startOfMonth);
  return [startOfMonth, endOfMonth];
}

export function nextMonth(date) {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  const currentYear = newDate.getFullYear();
  switch (currentMonth) {
    case 11:
      newDate.setMonth(0);
      newDate.setFullYear(currentYear + 1);
      break;
    default:
      newDate.setMonth(currentMonth + 1);
      break;
  }
  return newDate;
}
