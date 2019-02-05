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
import TextButton from './action/TextButton';

const Container = styled.div`
  text-align: right;
  display: flex;
  justify-content: flex-end;
  padding 10px;

  > * {
    margin-left: ${props => 5 / props.size}%;
    width: ${props => 90 / props.size}%;
    max-width: 200px;
  }
`;

function Quickreplies({ quickreplies, sendAction }) {
  return (
    <div>
      <Container className="bf-quickreplies" size={quickreplies.length}>
        {quickreplies.map(q => (
          <TextButton key={q} handleClick={sendAction({ type: 'text', value: q })} label={q} />
        ))}
      </Container>
    </div>
  );
}

Quickreplies.propTypes = {
  quickreplies: PropTypes.arrayOf(PropTypes.string).isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default Quickreplies;
