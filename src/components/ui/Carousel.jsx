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
  overflow: hidden;
`;

// Container - where carousel items are displayed
const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
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
      arrowsDisabled: false,
    };
    // carousel random id
    this.id = Math.random();
    // container ref
    this.container = null;
    this.items = [];
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
    // trigger handleSize a first time to initiate
    this.handleResize();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  setItemRef = (node, index) => {
    this.items[index] = node;
  };

  setContainerRef = (node) => {
    console.log('setContainerRef', node);
    this.container = node;
  };

  handleResize = () => {
    console.log('Resize event', this.container.scrollLeft, this.container.offsetWidth, this.container.scrollWidth);
    this.setState({ arrowsDisabled: this.container.offsetWidth === this.container.scrollWidth });
  };

  smoothScroll = (scrollGoal) => {
    const isRightScroll = this.container.scrollLeft < scrollGoal;
    const stepAmount = 10;
    if (isRightScroll) {
      window.requestAnimationFrame(this.scrollStepRight(scrollGoal, stepAmount));
    } else {
      window.requestAnimationFrame(this.scrollStepLeft(scrollGoal, stepAmount));
    }
  };

  scrollStepRight = (scrollGoal, stepAmount) => () => {
    const actualScroll = this.container.scrollLeft;
    const newScroll = actualScroll + stepAmount;
    this.container.scrollLeft = newScroll;
    if (newScroll !== scrollGoal && (newScroll + this.container.offsetWidth) <= this.container.scrollWidth) {
      window.requestAnimationFrame(this.scrollStepRight(scrollGoal, stepAmount));
    }
  };

  scrollStepLeft = (scrollGoal, stepAmount) => () => {
    const actualScroll = this.container.scrollLeft;
    const newScroll = actualScroll - stepAmount;
    this.container.scrollLeft = newScroll;
    if (newScroll !== scrollGoal && newScroll > 0) {
      window.requestAnimationFrame(this.scrollStepLeft(scrollGoal, stepAmount));
    }
  };

  handlePrevious = () => {
    console.log('Go previous', this.state);
    const currentIndex = this.state.currentIndex;
    const currentItemWidth = this.items[currentIndex].offsetWidth;
    // this.container.scrollLeft = this.container.scrollLeft - currentItemWidth;
    this.smoothScroll(this.container.scrollLeft - currentItemWidth);
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
      console.log('Current index decremented');
    }
  };

  handleNext = () => {
    console.log('Go next', this.state);
    const currentIndex = this.state.currentIndex;
    const currentItemWidth = this.items[currentIndex].offsetWidth;
    // this.container.scrollLeft = this.container.scrollLeft + currentItemWidth;
    this.smoothScroll(this.container.scrollLeft + currentItemWidth);
    if (currentIndex < (this.items.length + 1)) {
      this.setState({ currentIndex: currentIndex + 1 });
      console.log('Current index incremented');
    }
  };

  render() {
    return (
      <Wrapper>
        <ArrowButton
          onClick={this.handlePrevious}
          disabled={this.state.currentIndex === 0 || this.state.arrowsDisabled}
          isPrevious
        >
          <img src={prevArrowIcon} alt="previous" />
        </ArrowButton>
        <Container innerRef={this.setContainerRef} onChange={() => console.log('changed!')}>
          {this.props.children.map((item, index) => (
            <Item
              innerRef={node => this.setItemRef(node, index)}
              key={`carousel-${this.id}-${index}`}
            >{item}</Item>
          ))}
        </Container>
        <ArrowButton
          onClick={this.handleNext}
          disabled={this.state.currentIndex === (this.items.length - 1) || this.state.arrowsDisabled}
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
