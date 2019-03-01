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
import DEFAULT_LABELS from '../../labels';

export default function WithLabels(Component) {
  const ComponentWithLabels = ({ ...props }, context) => {
    const labels = {
      ...DEFAULT_LABELS,
      ...context.customLabels,
    };

    return <Component {...props} labels={labels} />;
  };

  ComponentWithLabels.contextTypes = {
    customLabels: PropTypes.shape({
      onboardingMessage: PropTypes.string,
      sendButtonLabel: PropTypes.string,
      messageInputPlaceholder: PropTypes.string,
      webchatHeaderTitle: PropTypes.string,
      helpMessage: PropTypes.string,
    }),
  };

  return ComponentWithLabels;
}
