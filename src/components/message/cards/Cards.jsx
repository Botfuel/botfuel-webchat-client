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
import Carousel from '../../ui/Carousel';
import CardActions from './CardActions';

const Card = styled.div`
  width: ${props => props.size}px;
  background-color: white;
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 10px 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1px solid #f5f5f5;
  
  h4 {
    margin: 5px 0 10px;
    font-size: 15px;
    font-weight: 500;
  }
`;

const CardImage = styled.div`
  height: 250px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: #fff url(${props => props.url}) no-repeat center center;
  background-size: cover;
`;

const Cards = ({ payload, sendAction, cardSize }) => (
  <Carousel itemSize={cardSize}>
    {payload.cardsValues.map(card => (
      <Card key={`card-${card.title}`} size={cardSize}>
        <CardImage url={card.image_url} />
        <CardContent>
          <div>
            <h4>{card.title}</h4>
          </div>
        </CardContent>
        {!!card.actionValue.length &&
        <CardActions
          payload={card}
          sendAction={sendAction}
          width={100}
        />
        }
      </Card>
    ))}
  </Carousel>
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
  cardSize: PropTypes.number,
};

Cards.defaultProps = {
  cardSize: 300,
};

export default Cards;
