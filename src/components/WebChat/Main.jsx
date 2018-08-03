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
import styled, { css } from 'styled-components';
import MessageListContainer from 'components/message/MessageListContainer';
import Bubble from 'components/message/Bubble';
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
  position: relative;

  ${props => (props.theme.layout.noBorder ? '' : DialogStyles[props.theme.dialogStyle])};
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    ${props => props.theme.fixed && fullScreenMode};
  }
`;

const SpeakingIndicator = styled.div`
  &::before {
    content: '\\f130';
  }
  font-family: 'font-awesome';
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
  debug,
  theme,
  setTranscript,
  setIsRecording,
  isRecording,
  voiceEnabled,
  parseHTML,
}) => (
  <Container
    className="bf-webchat-container"
    width={width || width}
    height={height || height}
    isVisible={isVisible}
    fullScreen={fullScreen}
  >
    {!theme.layout.noHeader && (
      <Top
        width={width || width}
        height={height || height}
        fullScreen={fullScreen}
        switchMode={switchMode}
        switchSize={toggleFullScreen}
        disableFullScreenButton={disableFullScreenButton}
      />
    )}
    <MessageListContainer
      sendAction={sendAction}
      markAsClicked={markAsClicked}
      messages={messages}
      quickreplies={quickreplies}
      theme={theme}
      width={width}
      debug={debug}
      parseHTML={parseHTML}
    />
    {isRecording && (
      <div>
        <Bubble side="right">
          <SpeakingIndicator />
        </Bubble>
      </div>
    )}
    <Bottom
      sendMessage={sendMessage}
      sendAction={sendAction}
      menuActions={menuActions}
      onKeyPress={handleKeyPress}
      onInputChange={handleInputChange}
      input={input}
      setTranscript={setTranscript}
      setIsRecording={setIsRecording}
      isRecording={isRecording}
      voiceEnabled={voiceEnabled}
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
  debug: PropTypes.bool.isRequired,
  theme: PropTypes.shape({}).isRequired,
  setTranscript: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  isRecording: PropTypes.bool.isRequired,
  voiceEnabled: PropTypes.bool.isRequired,
  parseHTML: PropTypes.bool.isRequired,
};

Main.defaultProps = {
  messages: [],
  input: '',
};

export default Main;
