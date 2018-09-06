/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)/;
const linkOrEmailPattern = /((^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?))|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))/gi;
const protocolPattern = /^https?:\/\//;
const textToLinkComponents = (text) => {
  const comps = [];
  let match = linkOrEmailPattern.exec(text);
  if (!match) return [];
  let currentIndex = 0;
  while (match) {
    comps.push({ type: 'text', value: text.substr(currentIndex, match.index - currentIndex) });
    const str = text.substr(match.index, match[0].length);
    const isEmail = emailPattern.exec(str);
    comps.push({
      type: 'link',
      href: isEmail ? `mailto:${str}` : protocolPattern.exec(str) ? str : `http://${str}`,
      blank: !isEmail,
      value: str,
    });
    currentIndex = match.index + match[0].length;

    match = linkOrEmailPattern.exec(text);
  }
  comps.push({ type: 'text', value: text.substr(currentIndex, text.length - 1) });

  return comps;
};

// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
  }
  // set non-HTML/MathML links to xlink:show=new
  if (
    !node.hasAttribute('target') &&
    (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
  ) {
    node.setAttribute('xlink:show', 'new');
  }
});

export default class TextWithLinks extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    sanitizeDOM: PropTypes.bool,
    parseHTML: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    text: '',
    sanitizeDOM: true,
  };

  render() {
    const { text, parseHTML, sanitizeDOM } = this.props;
    console.log('sanitizeDOM', sanitizeDOM);

    if (parseHTML) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeDOM ? DOMPurify.sanitize(text) : text,
          }}
        />
      );
    }

    if (!parseHTML) {
      const comps = textToLinkComponents(text);

      if (comps.length) {
        return (
          <span>
            {comps.map((component, i) => {
              const key = `${component.type}-${component.value}-${i}`;
              return component.type === 'text' ? (
                <span
                  key={key}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeDOM
                      ? DOMPurify.sanitize(component.value)
                      : component.value,
                  }}
                />
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

    return <span>{text}</span>;
  }
}
