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

const Container = styled.div`
  background-color: ${props => props.theme.colors.mainLight};
  padding: 18px 18px 22px;
  border-bottom: 1px solid #e6e6e6;
  border-top: ${props => (props.top ? 0 : '1px solid #e6e6e6')};
  margin: 0 -10px 10px;
  margin-top: ${props => (props.top ? -10 : 0)}px;
`;

const Title = styled.div`
  color: #464646;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Text = styled.div`
  color: #787f8c;
  font-size: 13px;
  line-height: 1.3;
`;

export default function Block({ value, className }) {
  return (
    <Container className={className} top={value.top}>
      {value.title && <Title>{value.title}</Title>}
      {value.text && <Text>{value.text}</Text>}
    </Container>
  );
}

Block.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
  className: PropTypes.string,
};

Block.defaultProps = {
  className: '',
};
