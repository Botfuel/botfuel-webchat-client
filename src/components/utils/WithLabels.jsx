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
    customLabels: PropTypes.object,
  };

  return ComponentWithLabels;
}
