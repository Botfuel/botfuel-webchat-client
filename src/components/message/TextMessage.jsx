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

import React from 'react';
import PropTypes from 'prop-types';
import TextWithLinks from 'components/ui/TextWithLinks';

export default function TextMessage({ payload, sender, parseHTML, sanitizeDOM }) {
  return (
    <TextWithLinks
      text={payload.textValue || payload.text}
      parseHTML={parseHTML && sender === 'bot'}
      sanitizeDOM={sanitizeDOM}
    />
  );
}

TextMessage.propTypes = {
  payload: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
  sender: PropTypes.oneOf(['bot', 'user', 'server']).isRequired,
  parseHTML: PropTypes.bool,
  sanitizeDOM: PropTypes.bool,
};

TextMessage.defaultProps = {
  parseHTML: false,
  sanitizeDOM: true,
};
