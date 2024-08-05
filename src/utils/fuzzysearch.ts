export default function fuzzySearch(searchString: string, text: string) {
  const textLength = text.length;
  const searchStringLength = searchString.length;

  if (searchStringLength > textLength) {
    return false;
  }
  if (searchStringLength === textLength) {
    return searchString === text;
  }

  outer: for (let index = 0, charIndex = 0; index < searchStringLength; index++) {
    const searchChar = searchString.charCodeAt(index);
    while (charIndex < textLength) {
      if (text.charCodeAt(charIndex++) === searchChar) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
