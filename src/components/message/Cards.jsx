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
import Actions from './action/Actions';

const SliderContainer = styled.div`
  max-width: 400px;
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

  img {
    width: 100%;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
`;

const CardContent = styled.div`
  padding: 10px;
  
  h4 {
    margin: 5px 0 10px;
  }
`;

const sliderSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  infinite: false,
  nextArrow: null,
  prevArrow: null,
};

const Cards = ({ payload, markAsClicked, sendAction }) => (
  <SliderContainer>
    <Slider {...sliderSettings}>
      {payload.cardsValues.map((card, cardIndex) => (
        <Card key={`card-${card.title}`}>
          <img src={card.image_url} alt={card.title} />
          <CardContent>
            <h4>{card.title}</h4>
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
