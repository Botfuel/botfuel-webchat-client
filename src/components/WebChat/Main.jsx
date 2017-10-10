import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import MessageListContainer from 'components/message/MessageListContainer';
import Top from './Top';
import Bottom from './Bottom';

const fullScreenMode = css`
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  border: 0;
`;

const DialogStyles = {
  hover: css`
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
    border: 1px solid #e3e3e3;
    border-radius: 10px;
  `,
};

const Container = styled.div`
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out;
  color: #000;
  width: ${props => (props.theme.fluid ? '100%' : `${props.width}px`)};
  height: ${props => (props.theme.fluid ? '100%' : `${props.height}px`)};
  overflow: hidden;
  background: ${props => props.theme.colors.background};

  ${props => DialogStyles[props.theme.dialogStyle]};
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    ${props => props.theme.fixed && fullScreenMode};
  }
`;

const Main = ({
  messages,
  quickreplies,
  width,
  height,
  isVisible,
  fullScreen,
  switchMode,
  toggleFullScreen,
  sendAction,
  markAsClicked,
  sendMessage,
  handleKeyPress,
  handleInputChange,
  input,
  disableFullScreenButton,
  menuActions,
}) => (
  <Container
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
      disableFullScreenButton={disableFullScreenButton}
    />
    <MessageListContainer
      sendAction={sendAction}
      markAsClicked={markAsClicked}
      messages={messages}
      quickreplies={quickreplies}
    />
    <Bottom
      sendMessage={sendMessage}
      sendAction={sendAction}
      menuActions={menuActions}
      onKeyPress={handleKeyPress}
      onInputChange={handleInputChange}
      input={input}
    />
  </Container>
);

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
  quickreplies: PropTypes.arrayOf(PropTypes.string).isRequired,
  sendAction: PropTypes.func.isRequired,
  markAsClicked: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  input: PropTypes.string,
  disableFullScreenButton: PropTypes.bool.isRequired,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.shape({
        type: PropTypes.string,
        payload: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
};

Main.defaultProps = {
  messages: [],
  input: '',
};

export default Main;
