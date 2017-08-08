import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Cross = styled.div`
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 10px;
  color: #ddd;
  font-size: 10px;
`;

const TopMenu = styled.div`
  font-weight: 200;
  color: ${props => props.theme.colors.mainText};
  background-color: ${props => props.theme.colors.main};
  height: 40px;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  font-size: 16px;
`;

export default function Top(props) {
  return (
    <TopMenu>
      <Cross onClick={props.switchMode}>╳</Cross>
      How can we help?
    </TopMenu>
  );
}

Top.propTypes = {
  switchMode: PropTypes.func.isRequired,
};
