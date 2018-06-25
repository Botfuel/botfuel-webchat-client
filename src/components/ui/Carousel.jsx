import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import scrollIntoView from 'scroll-into-view';
import prevArrowIcon from '../../../assets/images/icons/angle-left.svg';
import nextArrowIcon from '../../../assets/images/icons/angle-right.svg';

// Wrapper - where buttons and carousel content are displayed
const Wrapper = styled.div`
  position: relative;
  padding: 30px;
  overflow-y: scroll;
`;

// Container - where carousel items are displayed
const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow-y: scroll;
`;

// Item - when an item go
const Item = styled.div`
  margin-right: 10px;
  max-width: 300px;
`;

// Arrows - prev and next controls buttons
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  opacity: 0.75;
  height: 40px;
  width: 25px;
  padding: 0;
  background: none;
  border: none;
  
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
  
  ${props => props.isPrevious && 'left: 0;'}
  ${props => props.isNext && 'right: 0;'}
`;

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      maxIndex: null,
    };
    // carousel random id
    this.id = Math.random();
    // container ref
    this.container = null;
    this.items = [];
  }

  setItemRef = (node, index) => {
    this.items[index] = node;
  };

  handlePrevious = () => {
    console.log('Go previous', this.state);
    this.setState({ currentIndex: this.state.currentIndex - 1 });
    scrollIntoView(this.items[this.state.currentIndex], {
      time: 1000,
      align: {
        left: 0,
      },
      validTarget: (target, parentsScrolled) => (parentsScrolled < 1 && target !== window),
    });
  };

  handleNext = () => {
    console.log('Go next', this.state);
    this.setState({ currentIndex: this.state.currentIndex + 1 });
    scrollIntoView(this.items[this.state.currentIndex], {
      time: 1000,
      align: {
        right: 0,
      },
      validTarget: (target, parentsScrolled) => (parentsScrolled < 1 && target !== window),
    });
  };

  render() {
    return (
      <Wrapper>
        <ArrowButton
          onClick={this.handlePrevious}
          disabled={this.state.currentIndex === 0}
          isPrevious
        >
          <img src={prevArrowIcon} alt="previous" />
        </ArrowButton>
        <Container>
          {this.props.children.map((item, index) => (
            <Item
              innerRef={node => this.setItemRef(node, index)}
              key={`carousel-${this.id}-${index}`}
            >{item}</Item>
          ))}
        </Container>
        <ArrowButton
          onClick={this.handleNext}
          disabled={this.state.currentIndex === (this.items.length - 1)}
          isNext
        >
          <img src={nextArrowIcon} alt="next" />
        </ArrowButton>
      </Wrapper>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Carousel;
