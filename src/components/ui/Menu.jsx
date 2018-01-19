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
import onClickOutside from 'react-onclickoutside';
import { darken } from 'polished';

const Icon = styled.span`
  font-family: 'font-awesome';
  cursor: pointer;
  color: ${props => props.theme.colors.menuIcon};
  font-size: 20px;
`;

const List = styled.ul`
  display: ${props => (props.open ? 'block' : 'none')};
  list-style: none;
  min-width: 180px;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(230, 230, 230, 0.8), 0 1px 4px rgba(230, 230, 230, 0.8);
  border-radius: 6px;
  border: 0;
  margin-top: 8px;
  position: absolute;
  bottom: 45px;
  left: 10px;
  z-index: 1000;
  margin: 2px 0 0;
  font-size: 15px;
  text-align: left;
  background-color: ${props => props.theme.colors.menuBackground};
  background-clip: padding-box;
`;

const ListItem = styled.li`
  :hover {
    background-color: ${props => props.theme.colors.menuLinkHover};
  }
`;

const Bars = styled(Icon)`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  &::before {
    content: '\\f0c9';
  }

  &:hover {
    color: ${props => darken(0.1, props.theme.colors.menuIcon)};
  }
`;

const MenuButtonContainer = styled.div`
  width: 45px;
  height: 45px;
  display: table;
`;

const MenuLink = styled.a`
  display: block;
  color: ${props => props.theme.colors.menuLink};
  cursor: pointer;
  text-decoration: none;
  padding: 4px 20px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: left;
`;

const MenuButton = ({ onClick }) => (
  <MenuButtonContainer onClick={onClick}>
    <Bars />
  </MenuButtonContainer>
);

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const MenuPanel = ({ open, menuActions, sendAction, onLinkClick }) => (
  <List open={open}>
    {menuActions.map(action => (
      <ListItem
        key={action.label}
        onClick={() => {
          sendAction({
            type: action.message.type,
            value: action.message.payload.value,
            text: action.label,
          })();
          onLinkClick();
        }}
      >
        <MenuLink>{action.label}</MenuLink>
      </ListItem>
    ))}
  </List>
);

MenuPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  sendAction: PropTypes.func.isRequired,
  onLinkClick: PropTypes.func.isRequired,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.shape({
        type: PropTypes.string,
        payload: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
};

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
    };
  }

  toggleMenu = () => {
    this.setState(oldState => ({
      isOpen: !oldState.isOpen,
    }));
  };

  closeMenu = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleLinkClick = () => {
    this.closeMenu();
  };

  handleClickOutside = () => {
    this.closeMenu();
  };

  render() {
    return (
      <div>
        <MenuButton onClick={this.toggleMenu} />
        <MenuPanel open={this.state.isOpen} onLinkClick={this.handleLinkClick} {...this.props} />
      </div>
    );
  }
}

export default onClickOutside(Menu);
