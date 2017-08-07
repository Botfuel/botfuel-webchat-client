import React from 'react';
import styled from 'styled-components';

import Button from './Button';

export default ({ choices }) =>
  (<div>
    {choices.map(choice => <Button text={choice.text} />)}
  </div>);
