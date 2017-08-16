import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MessageListContainer from '../message/MessageListContainer';
import Top from './Top';
import Bottom from './Bottom';

const Container = styled.div`
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity .3s ease-in-out;
  color: #000;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  box-shadow: 0 0 24px rgba(0, 0, 0, .15);
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    border: 0;
  }
`;

const Main = ({
  messages,
  width,
  height,
  isVisible,
  fullScreen,
  switchMode,
  toggleFullScreen,
  sendAction,
  sendMessage,
  handleKeyPress,
  handleInputChange,
  input,
}) =>
  (<Container
    width={width || width}
    height={height || height}
    isVisible={isVisible}
    fullScreen={fullScreen}
  >
    <Top
      width={width || width}
      height={height || height}
      fullScreen={fullScreen}
      switchMode={switchMode}
      switchSize={toggleFullScreen}
    />
    <MessageListContainer sendAction={sendAction} messages={messages} />
    <Bottom
      sendMessage={sendMessage}
      onKeyPress={handleKeyPress}
      onInputChange={handleInputChange}
      input={input}
    />
  </Container>);

Main.propTypes = {
  switchMode: PropTypes.func.isRequired,
  toggleFullScreen: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      user: PropTypes.string,
      bot: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      sender: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  sendAction: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  input: PropTypes.string,
};

Main.defaultProps = {
  messages: [],
  input: '',
};

export default Main;
