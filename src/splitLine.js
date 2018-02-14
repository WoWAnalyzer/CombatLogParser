const EVENT_PART_SEPARATOR = ',';

export default function splitLine(line) {
  const partSeparator = EVENT_PART_SEPARATOR;
  const partSeparatorLength = partSeparator.length;

  const parts = [];
  const lineLength = line.length;
  let currentPartStartIndex = 0;
  let isCurrentPartString = false;
  for (let i = 0; i < lineLength; i++) {
    const character = line[i];

    // If the first character is a quote we can be sure we're in a string
    if (i === currentPartStartIndex && character === '"') {
      isCurrentPartString = true;
    }

    if (character === partSeparator) {
      if (isCurrentPartString) {
        // If we found a comma while in a string, check if the string was closed in the previous character.
        const previousCharacter = line[i - 1];
        if (previousCharacter !== '"') {
          // If the previous character was anything other than a quote we're still in the middle of the string.
          continue; // next character
        }
        // Ok so previous character was a quote, but was that quote escaped? Because if it was then we're still in the middle of the string.
        const isEscaped = line[i - 2] === '\\';
        if (isEscaped) {
          continue;
        }
      }

      // End of part
      let partStartIndex = currentPartStartIndex;
      let partEndIndex = i;
      // Unwrap strings; turns '"abc"' into 'abc'
      if (isCurrentPartString) {
        partStartIndex += 1;
        partEndIndex -= 1;
      }
      // substr needs a length, not an end index
      const partLength = partEndIndex - partStartIndex;
      let part = line.substr(partStartIndex, partLength);
      if (isCurrentPartString && part.indexOf('\\') !== -1) {
        // If the part has a backslash it's likely we have escaped quotes that we need to unescape (it's safe to always run this, but for performance best to only do when really necessary)
        part = part.replace(/\\"/g, '"');
      }
      parts.push(part);

      // Prepare next part
      currentPartStartIndex = i + partSeparatorLength;
      isCurrentPartString = false;
    }
  }
  // The last part doesn't end with a comma, so add the remaining stuff as the last part
  parts.push(line.substr(currentPartStartIndex));

  return parts;
}
