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

import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

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
    parseHTML: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    text: '',
  };

  render() {
    const { text, parseHTML } = this.props;

    if (parseHTML) {
      return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;
    }

    return <span>{text}</span>;
  }
}
