import userAvatar from '../../assets/images/avatars/user.png';
import startButton from '../../assets/images/icons/botfuel.png';

export default {
  layout: {
    compact: true,
    rounded: false,
    shadowed: false,
  },
  colors: {
    main: '#244891',
    mainLight: '#e4e9f2',
    mainText: '#fff',
    primary: '#0084f4',
    secondary: '#f1f0f0',
    primaryText: '#fff',
    secondaryText: '#000',
    background: '#fff',
  },
  buttons: {
    close: true,
    fullScreen: true,
  },
  images: {
    botAvatar: userAvatar,
    userAvatar,
    startButton,
  },
  startButtonStyle: 'bubble',
  dialogStyle: 'hover',
};
