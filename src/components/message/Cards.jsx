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
import Slider from 'react-slick';
import prevArrowIcon from '../../../assets/images/icons/angle-left.svg';
import nextArrowIcon from '../../../assets/images/icons/angle-right.svg';
import Actions from './action/Actions';

const SliderContainer = styled.div`
  max-width: 360px;
  padding: 30px;
  .slick-next:before, .slick-prev:before {
    color: black;
  }
  
  .slick-list {
    box-shadow: 0 0 20px 2px rgba(0,0,0,0.1);
  }
  
  .slick-slide div:focus {
    outline: none;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 2px;
  margin-right: 10px;
`;

const CardContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  h4 {
    margin: 5px 0 10px;
    font-size: 20px;
  }
`;

const Crop = styled.div`
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  
  img {
    height: 100%;
    width: auto;
  }
`;

// carousel arrows
const ArrowButton = styled.button`
  &::before {
    content: '';
  }
  
  opacity: 0.75;
  
  &:hover {
    opacity: 1;
  }
  
  &.slick-disabled {
    opacity: 0.25;
  }
`;

const SliderArrow = ({ className, onClick, type }) => (
  <ArrowButton className={className} onClick={onClick}>
    <img
      src={type === 'prev' ? prevArrowIcon : nextArrowIcon}
      alt={type === 'prev' ? 'previous' : 'next'}
    />
  </ArrowButton>
);

SliderArrow.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['prev', 'next']).isRequired,
};

const sliderSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  infinite: false,
  nextArrow: <SliderArrow type="next" />,
  prevArrow: <SliderArrow type="prev" />,
};

const Cards = ({ payload, markAsClicked, sendAction }) => (
  <SliderContainer>
    <Slider {...sliderSettings}>
      {payload.cardsValues.map((card, cardIndex) => (
        <Card key={`card-${card.title}`}>
          <Crop>
            <img src={card.image_url} alt={card.title} />
          </Crop>
          <CardContent>
            <div>
              <h4>{card.title}</h4>
            </div>
            {!!card.actionValue.length &&
            <Actions
              payload={card}
              sendAction={sendAction}
              markAsClicked={actionIndex => markAsClicked(actionIndex, cardIndex)}
              width={100}
            />
            }
          </CardContent>
        </Card>
      ))}
    </Slider>
  </SliderContainer>
);

const ButtonType = PropTypes.shape({
  type: PropTypes.oneOf(['text', 'postback', 'link']).isRequired,
  text: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  clicked: PropTypes.bool,
  disabled: PropTypes.bool,
});

ButtonType.defaultProps = {
  clicked: false,
  disabled: false,
};

const CardType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  actionValue: PropTypes.arrayOf(ButtonType),
});

Cards.propTypes = {
  payload: PropTypes.shape({
    cardsValues: PropTypes.arrayOf(CardType).isRequired,
  }).isRequired,
  sendAction: PropTypes.func.isRequired,
  markAsClicked: PropTypes.func.isRequired,
};

export default Cards;
