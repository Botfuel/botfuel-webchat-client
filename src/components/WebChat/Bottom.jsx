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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import WithLabels from '../utils/WithLabels';
import Menu from '../ui/Menu';
import Voice from '../message/Voice';

const SendButton = styled.div`
  width: 70px;
  height: 100%;
  display: inline-block;
  color: #b2b2b2;
  cursor: pointer;
  text-align: center;
  float: right;
  font-size: 13px;
  line-height: 40px;
  font-weight: 600;
  padding-right: 10px;
  &:focus {
    outline: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  height: 100%;
  border-radius: 25px;
  position: relative;
  align-items: center;
`;

const BottomWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 0;
`;

const WideTextarea = styled(Textarea)`
  width: 100%;
  resize: none;
  border: none;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  outline-width: 0;
  color: dimgray;
  font-size: 13px;
  margin: 10px;
  overflow: hidden;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  &:focus {
    outline: none;
  }
  
  &:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: lightgray;
  }
  
  &::-ms-input-placeholder { /* Microsoft Edge */
    color: lightgray;
  }

  &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: lightgray;
  }
  
  &::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: lightgray;
  }
  
  &::-webkit-input-placeholder { /* WebKit browsers */
    color: lightgray;
  }
  
  &::placeholder {
    color: lightgray;
  }
`;

const VoiceWrapper = styled.div`
  margin-right: 10px;
`;

const BrandContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.menuIcon};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em 0;
`;

const BrandImage = styled.img.attrs({
  alt: 'brand',
})`
  height: 12px;
`;

class Bottom extends React.Component {
  state = {
    input: '',
  };

  handleInputChange = (e) => {
    if (!e.target.value || (e.target.value && e.target.value.length < 500)) {
      this.setState({
        input: e.target.value,
      });
    }
  };

  resetInput = () => {
    this.setState({
      input: '',
    });
  };

  handleKeyPress = (e) => {
    if (e && e.nativeEvent.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.input.length) {
      this.props.onSubmit(this.state.input);
      this.resetInput();
    }
  };

  render() {
    const {
      menuActions,
      sendAction,
      labels,
      voiceEnabled,
      setTranscript,
      isRecording,
      setIsRecording,
    } = this.props;
    return (
      <BottomWrapper className="bf-input-wrapper">
        <InputWrapper className="bf-input-container">
          {!!menuActions.length && (
            <Menu sendAction={sendAction} menuActions={menuActions} />
          )}
          <WideTextarea
            className="bf-input-textarea"
            tabIndex={-1}
            maxRows={4}
            maxLength={400}
            value={this.state.input}
            placeholder={labels.messageInputPlaceholder}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
          />
          {!!voiceEnabled && (
            <VoiceWrapper className="bf-input-voice-wrapper">
              <Voice
                setTranscript={setTranscript}
                setIsRecording={setIsRecording}
                isRecording={isRecording}
              />
            </VoiceWrapper>
          )}
          <SendButton className="bf-input-send-button" onClick={this.handleSubmit}>{labels.sendButtonLabel}</SendButton>
        </InputWrapper>
        <BrandContainer>
          <a href="https://answers.botfuel.io" target="_blank" rel="noopener noreferrer">
            <BrandImage src="https://s3-eu-west-1.amazonaws.com/botfuel-assets/webchat_by_botfuel_en.png" />
          </a>
        </BrandContainer>
      </BottomWrapper>
    );
  }
}

Bottom.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    messageInputPlaceholder: PropTypes.string,
    sendButtonLabel: PropTypes.string,
  }).isRequired,
  sendAction: PropTypes.func.isRequired,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.shape({
        type: PropTypes.string,
        payload: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
  setTranscript: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  isRecording: PropTypes.bool.isRequired,
  voiceEnabled: PropTypes.bool.isRequired,
};

export default WithLabels(Bottom);
