import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider as MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';

import connectComponent from '../helpers/connect-component';

import { updateIsFullScreen } from '../state/root/general/actions';

import App from './app';

const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  // overwite material-ui styles
  '@global': {
    '.MuiTooltip-tooltipPlacementLeft': {
      margin: '0 8px',
    },
    '.MuiTooltip-tooltipPlacementRight': {
      margin: '0 8px',
    },
    '.MuiTooltip-tooltipPlacementTop': {
      margin: '8px 0',
    },
    '.MuiTooltip-tooltipPlacementBottom': {
      margin: '8px 0',
    },
  },
})(() => null);

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.handleEnterFullScreen = this.handleEnterFullScreen.bind(this);
    this.handleLeaveFullScreen = this.handleLeaveFullScreen.bind(this);
  }

  componentDidMount() {
    const { remote } = window.require('electron');
    remote.getCurrentWindow().on('enter-full-screen', this.handleEnterFullScreen);
    remote.getCurrentWindow().on('leave-full-screen', this.handleLeaveFullScreen);
  }

  componentWillUnmount() {
    const { remote } = window.require('electron');
    remote.getCurrentWindow().removeListener('enter-full-screen', this.handleEnterFullScreen);
    remote.getCurrentWindow().removeListener('leave-full-screen', this.handleLeaveFullScreen);
  }

  handleEnterFullScreen() {
    const { onUpdateIsFullScreen } = this.props;
    onUpdateIsFullScreen(true);
  }

  handleLeaveFullScreen() {
    const { onUpdateIsFullScreen } = this.props;
    onUpdateIsFullScreen(false);
  }

  render() {
    const {
      shouldUseDarkColors,
    } = this.props;

    const themeObj = {
      typography: {
        fontSize: 13.5,
      },
      palette: {
        type: shouldUseDarkColors ? 'dark' : 'light',
        primary: {
          light: green[300],
          main: green[600],
          dark: green[700],
        },
        secondary: {
          light: pink[300],
          main: pink[500],
          dark: pink[700],
        },
        error: {
          light: red[300],
          main: red[500],
          dark: red[700],
        },
      },
    };

    if (!shouldUseDarkColors) {
      themeObj.background = {
        primary: grey[200],
      };
    }

    const theme = createMuiTheme(themeObj);

    return (
      <MuiThemeProvider theme={theme}>
        <GlobalCss />
        <App />
      </MuiThemeProvider>
    );
  }
}

AppWrapper.propTypes = {
  onUpdateIsFullScreen: PropTypes.func.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

const actionCreators = {
  updateIsFullScreen,
};

export default connectComponent(
  AppWrapper,
  mapStateToProps,
  actionCreators,
  null,
);
