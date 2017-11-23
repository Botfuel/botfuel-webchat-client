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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`padding-right: 10px;`;

export default function ButtonList({ value }) {
  const choices = value.choices;
  return (
    <Container>
      {choices && choices.map(choice => <Button key={choice.id} text={choice.text} />)}
    </Container>
  );
}

ButtonList.propTypes = {
  value: PropTypes.shape({
    choices: PropTypes.array.isRequired,
  }).isRequired,
};
