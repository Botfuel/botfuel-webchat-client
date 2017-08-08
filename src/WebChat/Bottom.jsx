import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  display: inline-block;
  height: 100%;
  border-radius: 25px;
  width: ${props => props.width}px;
  position: relative;
  padding: 0 20px;
  input {
    border: none;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    outline-width: 0;
    color: gray;
    font-size: 12px;
    padding-bottom: 6px;
  }
`;

const BottomWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, .1);
  height: 45px;
`;

export default function Bottom(props) {
  return (
    <BottomWrapper>
      <InputWrapper width={props.width - 85}>
        <input
          tabIndex={-1}
          value={props.input}
          placeholder="Écrivez un message..."
          onChange={props.onInputChange}
          onKeyPress={props.onKeyPress}
        />
      </InputWrapper>
      <SendButton onClick={props.sendMessage}>Envoyer</SendButton>
    </BottomWrapper>
  );
}

Bottom.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  input: PropTypes.string.isRequired,
};
