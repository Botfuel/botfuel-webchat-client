import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import WithLabels from 'components/utils/WithLabels';
import Menu from 'components/ui/Menu';

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
  &:focus {
    outline: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  height: 100%;
  border-radius: 25px;
  width: calc(100% - 85px);
  position: relative;

  input {
    border: none;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    outline-width: 0;
    color: gray;
    font-size: 12px;
    padding-bottom: 6px;
    padding-left: 20px;
  }
`;

const BottomWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  height: 45px;
`;

function Bottom(props) {
  return (
    <BottomWrapper>
      <InputWrapper>
        {!!props.menuActions.length && (
          <Menu sendAction={props.sendAction} menuActions={props.menuActions} />
        )}
        <input
          tabIndex={-1}
          value={props.input}
          placeholder={props.labels.messageInputPlaceholder}
          onChange={props.onInputChange}
          onKeyPress={props.onKeyPress}
        />
      </InputWrapper>
      <SendButton onClick={props.sendMessage}>{props.labels.sendButtonLabel}</SendButton>
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
};

export default WithLabels(Bottom);
