import fs from 'fs';
import readline from 'readline';

const TIME_SEPARATOR = '  ';

console.time('parse');
const rl = readline.createInterface({
  input: fs.createReadStream('WoWCombatLog.txt'),
  crlfDelay: Infinity
});
let lineNr = 0;
let something = null;
const timeSeparatorLength = TIME_SEPARATOR.length;
rl.on('line', line => {
  lineNr += 1;
  const timeEndIndex = line.indexOf(TIME_SEPARATOR);
  const time = line.substr(0, timeEndIndex);
  const eventIndex = timeEndIndex + timeSeparatorLength;
  const event = line.substr(eventIndex);
  const eventParts = event.split(',');
  something = eventParts;
});
rl.on('close', () => {
  console.timeEnd('parse');
  console.log('Read entire file.', lineNr, 'lines');
  console.log(something);
  process.exit(0);
});

// let lineNr = 0;
//
// console.time('parse');
//
// // Source: https://stackoverflow.com/a/23695940/684353
// const s = fs.createReadStream('./WoWCombatLog.txt')
//   .pipe(es.split())
//   .pipe(es.mapSync(function (line) {
//       // pause the readstream
//       s.pause();
//
//       lineNr += 1;
//
//       // process line here and call s.resume() when rdy
//       // function below was for logging memory usage
//       if (lineNr % 10000 === 0) {
//         // console.log(lineNr);
//       }
//
//       // resume the readstream, possibly from a callback
//       s.resume();
//     })
//       .on('error', function (err) {
//         console.log('Error while reading file.', err);
//       })
//       .on('end', function () {
//         console.timeEnd('parse');
//         console.log('Read entire file.', lineNr, 'lines');
//       })
//   );
