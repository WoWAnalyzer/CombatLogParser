const partSeparator = ',';
const nestingCharacters = {
  '"': '"',
  '[': ']',
  '(' : ')',
};

export default function splitLine(line) {
  const partSeparatorLength = partSeparator.length;

  const parts = [];
  const lineLength = line.length;
  let currentPartStartIndex = 0;
  let nestingType = null;
  for (let i = 0; i < lineLength; i += 1) {
    const character = line[i];

    // If the first character is a nesting character we assume the entire group is enclosed by that nesting character. This assume the same nesting character for the parent node isn't reused for children, we do this for performance and code-simplicity reasons. None of the current events re-use the parent nesting character, but that may change in the future.
    if (i === currentPartStartIndex && nestingCharacters[character] !== undefined) {
      nestingType = character;
    }

    if (character === partSeparator) {
      if (nestingType !== null) {
        // If we're in any kind of nesting group, check if the group was closed properly in the previous character.
        const previousCharacter = line[i - 1];
        if (previousCharacter !== nestingCharacters[nestingType]) {
          // If the previous character was anything other than the closing character we're still in the middle of the nested group.
          continue; // next character
        }
        // Ok so previous character was an ending character, but was it escaped? Because if it was then we're still in the middle of the string.
        const isEscaped = line[i - 2] === '\\';
        if (isEscaped) {
          continue;
        }
      }

      // End of part
      let partStartIndex = currentPartStartIndex;
      let partEndIndex = i;
      // Unwrap strings; turns '"abc"' into 'abc'
      if (nestingType === '"') {
        partStartIndex += 1;
        partEndIndex -= 1;
      }
      // substr needs a length, not an end index
      const partLength = partEndIndex - partStartIndex;
      let part = line.substr(partStartIndex, partLength);
      if (nestingType === '"' && part.indexOf('\\') !== -1) {
        // If the part has a backslash it's likely we have escaped quotes that we need to unescape (it's safe to always run this, but for performance best to only do when really necessary)
        part = part.replace(/\\"/g, '"');
      }
      parts.push(part);

      // Prepare next part
      currentPartStartIndex = i + partSeparatorLength;
      nestingType = null;
    }
  }
  // The last part doesn't end with a comma, so add the remaining stuff as the last part
  parts.push(line.substr(currentPartStartIndex));

  return parts;
}
