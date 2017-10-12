import React from 'react';

const rePattern = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/gi;

export default (text) => {
  const comps = [];
  let match = rePattern.exec(text);
  if (!match) return <div>{text}</div>;
  let currentIndex = 0;
  while (match) {
    comps.push({ type: 'text', value: text.substr(currentIndex, match.index - currentIndex) });
    comps.push({ type: 'link', value: text.substr(match.index, match[0].length) });
    currentIndex = match.index + match[0].length;

    match = rePattern.exec(text);
  }
  comps.push({ type: 'text', value: text.substr(currentIndex, text.length - 1) });
  return (
    <div>
      {comps.map((component, i) => {
        const key = `${component.type}-${component.value}-${i}`;
        return component.type === 'text' ? (
          <span key={key}>{component.value}</span>
        ) : (
          <a key={key} target="_blank" href={component.value}>
            {component.value}
          </a>
        );
      })}
    </div>
  );
};
