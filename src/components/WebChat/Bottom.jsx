import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import WithLabels from 'components/utils/WithLabels';
import Menu from 'components/ui/Menu';
import Voice from 'components/message/Voice';

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

  &::placeholder {
    color: lightgray;
  }
`;

const VoiceWrapper = styled.div`margin-right: 10px;`;

function Bottom(props) {
  return (
    <BottomWrapper>
      <InputWrapper>
        {!!props.menuActions.length && (
          <Menu sendAction={props.sendAction} menuActions={props.menuActions} />
        )}
        <WideTextarea
          tabIndex={-1}
          maxRows={4}
          maxLength={400}
          value={props.input}
          placeholder={props.labels.messageInputPlaceholder}
          onChange={props.onInputChange}
          onKeyPress={props.onKeyPress}
        />
        {!!props.voiceEnabled && (
          <VoiceWrapper>
            <Voice
              setTranscript={props.setTranscript}
              setIsRecording={props.setIsRecording}
              isRecording={props.isRecording}
            />
          </VoiceWrapper>
        )}
        <SendButton onClick={() => props.sendMessage()}>{props.labels.sendButtonLabel}</SendButton>
      </InputWrapper>
    </BottomWrapper>
  );
}

Bottom.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  input: PropTypes.string.isRequired,
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
