import React from 'react';
import styled from 'styled-components';

const Message = styled.div`
  clear: both;
  overflow: hidden;
  margin-bottom: 10px;
  transition: all .5s linear;
  float: ${props => props.side};
  .text_wrapper {
    background-color: ${props => (props.side === 'left' ? '#f1f0f0' : '#0084f4')};
  }
  .text {
    color: ${props => (props.side === 'left' ? '#000' : '#fff')};
  }
  .text_wrapper {
    display: inline-block;
    padding: 8px 10px;
    border-radius: 18px;
    position: relative;
    .text {
      font-size: 15px;
      font-weight: 300;
    }
  }
`;

export default function (props) {
  return (
    <Message side="right">
      <div className="text_wrapper">
        <div className="text">
          {props.text}
        </div>
      </div>
    </Message>
  );
}
