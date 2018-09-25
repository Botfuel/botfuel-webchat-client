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

import userAvatar from '../../assets/images/avatars/user.png';
import startButton from '../../assets/images/icons/botfuel.png';

export default {
  buttons: {
    close: true,
    fullScreen: true,
  },
  colors: {
    background: '#f5f5f5',
    main: '#5B468F',
    mainLight: '#f1f0f2',
    mainText: '#fff',
    menuBackground: '#fff',
    menuIcon: '#ddd',
    menuLink: '#949494',
    menuLinkHover: '#d7e0f2',
    primary: '#2BB573',
    primaryText: '#fff',
    secondary: '#fff',
    secondaryText: '#000',
  },
  dialogStyle: 'hover',
  fixed: false,
  fluid: false,
  images: {
    botAvatar: userAvatar,
    startButton,
    userAvatar,
  },
  layout: {
    buttonsDisplay: 'horizontal',
    compact: true,
    noBorder: false,
    noHeader: false,
    noHelpMessage: false,
    rounded: '15px',
    shadowed: false,
  },
  sanitizeDOM: true,
  startButtonStyle: 'bubble',
};
