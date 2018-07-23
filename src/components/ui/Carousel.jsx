import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
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
  margin: 0 ${props => props.itemMargin}px;
  width: ${props => props.itemSize}px;
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
      containerWidth: 0,
      scrollPosition: 0,
      scrollWidth: 0,
      itemToScroll: 1,
    };
    // is scrolling flag
    this.isScrolling = false;
    // carousel random id
    this.id = Math.random();
    // container reference
    this.container = null;
  }

  componentDidMount = () => {
    // add resize event listener
    window.addEventListener('resize', this.handleResize);
    // trigger handleSize a first time to initiate state properties
    // Use setTimeout to prevent issue with offsetWidth and scrollWidth of the container
    setTimeout(() => {
      this.handleResize();
    }, 500);
  };

  componentWillUnmount = () => {
    // remove event listener
    window.removeEventListener('resize', this.handleResize);
  };

  /**
   * Set container reference
   * @param node - the container reference node
   */
  setContainerRef = (node) => {
    this.container = node;
  };

  /**
   * Compute scroll amount when user click on prev/next arrow
   * @returns {number} - the scroll amount
   */
  getScrollAmount = () => (this.props.itemSize + 10) * this.state.itemToScroll;

  /**
   * Handle previous arrow click
   */
  handlePrevious = () => this.scrollTo(this.container.scrollLeft - this.getScrollAmount());

  /**
   * Handle next arrow click
   */
  handleNext = () => this.scrollTo(this.container.scrollLeft + this.getScrollAmount());

  /**
   * Handle resize event on the container and update state properties
   */
  handleResize = () => {
    this.setState({
      containerWidth: this.container.offsetWidth,
      scrollWidth: this.container.scrollWidth,
      scrollPosition: this.container.scrollLeft,
      itemToScroll: Math.floor(this.container.offsetWidth / this.props.itemSize),
    });
  };

  /**
   * Scroll from actual container.scrollLeft to next scroll position
   * @param {number} nextScrollPosition
   */
  scrollTo = (nextScrollPosition) => {
    const isRightScroll = this.container.scrollLeft < nextScrollPosition;
    if (!this.isScrolling) {
      this.isScrolling = true;
      const stepAmount = 10;
      if (isRightScroll) {
        window.requestAnimationFrame(this.scrollStepRight(nextScrollPosition, stepAmount));
      } else {
        window.requestAnimationFrame(this.scrollStepLeft(nextScrollPosition, stepAmount));
      }
      this.setState({
        scrollPosition: nextScrollPosition >= 0 ? nextScrollPosition : 0,
      });
    }
  };

  /**
   * Recursive function used to animate right scrolling
   * @param {number} nextScrollPosition
   * @param {number} stepAmount
   * @returns {Function}
   */
  scrollStepRight = (nextScrollPosition, stepAmount) => () => {
    const newScroll = this.container.scrollLeft + stepAmount;
    this.container.scrollLeft = newScroll;
    if (
      newScroll !== nextScrollPosition
      && (newScroll + this.container.offsetWidth) <= this.container.scrollWidth
    ) {
      window.requestAnimationFrame(this.scrollStepRight(nextScrollPosition, stepAmount));
    } else {
      this.isScrolling = false;
    }
  };

  /**
   * Recursive function used to animate left scrolling
   * @param nextScrollPosition
   * @param stepAmount
   * @returns {Function}
   */
  scrollStepLeft = (nextScrollPosition, stepAmount) => () => {
    const newScroll = this.container.scrollLeft - stepAmount;
    this.container.scrollLeft = newScroll;
    if (newScroll !== nextScrollPosition && newScroll > 0) {
      window.requestAnimationFrame(this.scrollStepLeft(nextScrollPosition, stepAmount));
    } else {
      this.isScrolling = false;
    }
  };

  render() {
    const { scrollPosition, scrollWidth, containerWidth, itemToScroll } = this.state;
    const { itemSize, itemMargin } = this.props;
    const isNotScrollable = scrollWidth === containerWidth;
    return (
      <Wrapper>
        <ArrowButton
          onClick={this.handlePrevious}
          disabled={scrollPosition === 0 || isNotScrollable}
          isPrevious
        >
          <img src={prevArrowIcon} alt="previous" />
        </ArrowButton>
        <Container innerRef={this.setContainerRef}>
          {this.props.children.map(item => (
            <Item key={`carousel-${this.id}-${Math.random()}`} {...this.props}>{item}</Item>
          ))}
        </Container>
        <ArrowButton
          onClick={this.handleNext}
          disabled={
            scrollPosition >= (scrollWidth - ((itemSize + (2 * itemMargin)) * itemToScroll))
            || isNotScrollable
          }
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
  itemSize: PropTypes.number,
  itemMargin: PropTypes.number,
};

Carousel.defaultProps = {
  itemSize: 300,
  itemMargin: 5,
};

export default Carousel;
