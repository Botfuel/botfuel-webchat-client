import React from 'react';
import PropTypes from 'prop-types';
import ThinkingIndicator from '../ui/ThinkingIndicator';

const BotAction = ({ payload: { botActionValue } }) => {
  switch (botActionValue.action) {
    case 'THINKING_ON':
      return <ThinkingIndicator />;
    default:
      return null;
  }
};

BotAction.propTypes = {
  payload: PropTypes.shape({
    botActionValue: PropTypes.shape({
      action: PropTypes.string,
    }),
  }).isRequired,
};

export default BotAction;
