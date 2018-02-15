import React from 'react';
import styled, { keyframes } from 'styled-components';
import annyang from 'annyang';
import PropTypes from 'prop-types';
import startRecordingSound from '../../../assets/sound/start-recording.wav';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 2px rgb(255, 187, 180);
  }
  
  50% {
     box-shadow: 0 0 0 7px rgb(255, 187, 180);
  }
 
  100% {
     box-shadow: 0 0 0 2px rgb(255, 187, 180);
  }
`;

const Button = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #f32;
  box-shadow: 0 0 0 ${props => (props.active ? '1px' : '4px')} rgb(255, 187, 180);
  cursor: pointer;
  ${props =>
    props.active &&
    `
animation: ${pulse} 0.8s infinite ease;
  `};
`;

export default class Voice extends React.Component {
  static propTypes = {
    isRecording: PropTypes.bool.isRequired,
    setTranscript: PropTypes.func.isRequired,
    setIsRecording: PropTypes.func.isRequired,
  };

  componentDidMount() {
    annyang.setLanguage('fr-FR');
    annyang.addCallback('result', ([userText]) => {
      this.props.setTranscript(userText);
    });
  }

  toggleRecording = () => {
    const isRecording = !this.props.isRecording;

    if (isRecording) {
      const audio = new Audio(startRecordingSound);
      audio.play();

      annyang.start();
    } else {
      annyang.pause();
    }

    this.props.setIsRecording(isRecording);
  };

  render() {
    const { isRecording } = this.props;

    return (
      <div>
        <Button active={isRecording} onClick={this.toggleRecording} />
      </div>
    );
  }
}
