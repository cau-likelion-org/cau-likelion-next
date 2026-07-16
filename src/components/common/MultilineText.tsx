import React from 'react';

const MultilineText = ({ text }: { text: string }) => {
  return (
    <>
      {text
        .replace(/\\n/g, '\n')
        .split('\n')
        .map((line, key) => (
          <span key={key}>
            {line}
            <br />
          </span>
        ))}
    </>
  );
};

export default MultilineText;
