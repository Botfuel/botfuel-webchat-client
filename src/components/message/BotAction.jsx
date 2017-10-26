import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ThinkingIndicator from '../ui/ThinkingIndicator';
import Bubble from './Bubble';

const Avatar = styled.div`
  padding: 3px 0px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 9px;
  float: left;
  background-image: url("${props =>
    (props.sender === 'bot' ? props.theme.images.botAvatar : props.theme.images.userAvatar)}");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

class BotAction extends React.Component {
  constructor() {
    super();

    this.state = {
      hide: false,
    };
  }

  render() {
    const { payload: { botActionValue } } = this.props;

    switch (botActionValue.action) {
      case 'THINKING_ON':
        return (
          <div>
            <Avatar sender="bot" />
            <Bubble side="left">
              <ThinkingIndicator />
            </Bubble>
          </div>
        );
      case 'THINKING_OFF':
        return null;
      default:
        return null;
    }
  }
}

BotAction.propTypes = {
  payload: PropTypes.shape({
    botActionValue: PropTypes.shape({
      action: PropTypes.string,
    }),
  }).isRequired,
};

export default BotAction;
