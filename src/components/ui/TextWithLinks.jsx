import React from 'react';
import PropTypes from 'prop-types';

const emailPattern = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
const linkOrEmailPattern = /((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+)|(([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+))/gi;

export default class TextWithLinks extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: '',
  };

  render() {
    const { text } = this.props;
    const comps = [];
    let match = linkOrEmailPattern.exec(text);

    if (!match) return <span>{text}</span>;

    let currentIndex = 0;
    while (match) {
      comps.push({ type: 'text', value: text.substr(currentIndex, match.index - currentIndex) });
      const str = text.substr(match.index, match[0].length);
      const isEmail = emailPattern.exec(str);

      comps.push({
        type: 'link',
        href: isEmail ? `mailto:${str}` : str,
        blank: !isEmail,
        value: str,
      });
      currentIndex = match.index + match[0].length;

      match = linkOrEmailPattern.exec(text);
    }
    comps.push({ type: 'text', value: text.substr(currentIndex, text.length - 1) });

    return (
      <span>
        {comps.map((component, i) => {
          const key = `${component.type}-${component.value}-${i}`;
          return component.type === 'text' ? (
            <span key={key}>{component.value}</span>
          ) : (
            <a key={key} target={component.blank ? '_blank' : ''} href={component.href}>
              {component.value}
            </a>
          );
        })}
      </span>
    );
  }
}
