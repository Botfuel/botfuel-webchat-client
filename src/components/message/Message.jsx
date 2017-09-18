import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from './Table';
import Text from './Text';
import ButtonList from './ButtonList';
import Block from './Block';
import QuickReplies from './QuickReplies';
import Bubble from './Bubble';

const componentsDict = {
  text: Text,
  table: Table,
  choices: QuickReplies,
  choicesOld: ButtonList,
  block: Block,
  action: Text,
};

const ClearDiv = styled.div`
  &::after {
    clear: both;
    content: '';
    display: block;
  }
`;

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

// eslint-disable-next-line react/prefer-stateless-function
export default class MessageContainer extends React.Component {
  render() {
    const { side, type, sender, ...props } = this.props;
    const Component = componentsDict[type];
    const disableBubble = ['block', 'choices'].includes(type);

    return disableBubble ? (
      <Component type={type} {...props} />
    ) : (
      <ClearDiv component={Component}>
        {side === 'left' && <Avatar sender={sender} />}
        <Bubble side={side}>
          <Component {...props} />
        </Bubble>
      </ClearDiv>
    );
  }
}

MessageContainer.propTypes = {
  side: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      text: PropTypes.string,
    }),
    PropTypes.shape({
      schema: PropTypes.array,
      rows: PropTypes.array,
    }),
    PropTypes.array,
  ]).isRequired,
};
