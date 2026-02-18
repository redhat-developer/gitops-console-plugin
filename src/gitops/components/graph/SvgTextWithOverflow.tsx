import * as React from 'react';

const SvgTextWithOverflow = ({ text, maxWidth, x, y }) => {
  const textRef = React.useRef(null);
  const [displayedText, setDisplayedText] = React.useState(text);

  // This truncation logic was done in part with the help of AI.
  // However, I will likely replace this whole thing anyway in order to have similar behaviour as
  // in Argo CD where you can toggle the field to show the start and end of the string.
  // For now, all strings will be truncated to fit inside the node boundary.
  React.useEffect(() => {
    if (textRef.current) {
      const textElement = textRef.current;
      const textWidth = textElement.getComputedTextLength();

      if (textWidth > maxWidth) {
        let truncatedText = text;
        while (textElement.getComputedTextLength() > maxWidth && truncatedText.length > 0) {
          truncatedText = truncatedText.slice(0, -1);
          textElement.textContent = truncatedText + '...';
        }
        setDisplayedText(truncatedText + '...');
      } else {
        setDisplayedText(text);
      }
    }
  }, [text, maxWidth]);

  return (
    <text x={x} y={y} ref={textRef}>
      {displayedText}
    </text>
  );
};

export default SvgTextWithOverflow;
