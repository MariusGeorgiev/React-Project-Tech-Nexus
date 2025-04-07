export function lineBreaks(text) {
  if (!text) return text;
  return text.split("\n").map((str, index) => (
    <span key={index}>
      {str}
      <br />
    </span>
  ));
}
