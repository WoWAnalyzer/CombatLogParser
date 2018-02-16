const yearDefault = (new Date()).getFullYear();
export default function parseDateTime(dateTime, year = yearDefault) {
  // Example input: 2/13 21:58:49.757
  // https://jsperf.com/2-part-split-vs-indexof/1
  // https://jsperf.com/wow-datetime-parsing/1 - also string-based parsing is unreliable due to differences per locale
  const dateTimeSeparatorIndex = dateTime.indexOf(' ');
  const date = dateTime.substr(0, dateTimeSeparatorIndex);
  const time = dateTime.substr(dateTimeSeparatorIndex + 1);

  const dateSeparatorIndex = date.indexOf('/');
  const month = date.substr(0, dateSeparatorIndex);
  const day = date.substr(dateSeparatorIndex + 1);

  // const minuteSeparatorIndex = time.indexOf(':');
  // const hour = time.substr(0, minuteSeparatorIndex);
  // const minutesAndSeconds = time.substr(minuteSeparatorIndex + 1);
  // const secondSeparatorIndex = minutesAndSeconds.indexOf(':');
  // const minute = minutesAndSeconds.substr(0, secondSeparatorIndex);
  // const secondsAndMilliseconds = minutesAndSeconds.substr(secondSeparatorIndex + 1);
  // const millisecondSeparatorIndex = secondsAndMilliseconds.indexOf('.');
  // const second = secondsAndMilliseconds.substr(0, millisecondSeparatorIndex);
  // const millisecond = secondsAndMilliseconds.substr(millisecondSeparatorIndex + 1);
  // Time actually has static positions
  const hour = time.substr(0, 2);
  const minute = time.substr(3, 2);
  const second = time.substr(6, 2);
  const millisecond = time.substr(9);

  // noinspection JSCheckFunctionSignatures
  return new Date(year, month - 1, day, hour, minute, second, millisecond);
}
