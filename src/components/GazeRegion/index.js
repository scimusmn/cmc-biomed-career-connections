/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable */
import React from 'react';
import propTypes from 'prop-types';
import EyeTracker from '../EyeTracker';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class GazeRegion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      active: false,
    };
  }

  componentDidMount() {
    const { eyeTracker, onEnable } = this.props;
    onEnable();
    eyeTracker.addSubscriber(this);
  }

  componentWillUnmount() {
    const { eyeTracker, onDisable } = this.props;
    onDisable();
    eyeTracker.removeSubscriber(this);
  }

  onPresence(userIsPresent) {
    const { onEnable, onDisable } = this.props;
    const { enabled } = this.state;
    if (enabled && !userIsPresent) {
      this.setState({ enabled: false });
      onEnable();
    } else if (!enabled && userIsPresent) {
      this.setState({ enabled: true });
      onDisable();
    }
  }

  onPosition(gazeX, gazeY) {
    const {
      x, y, width, height,
      onActivate, onDeactivate,
    } = this.props;
    const { enabled, active } = this.state;

    if (!enabled) {
      return;
    }

    let gazeInRegion = false;
    if (gazeX > x && gazeX < x + width
        && gazeY > y && gazeY < y + height) {
      gazeInRegion = true;
    }

    console.log(gazeX - x, gazeY - y, gazeInRegion);

    if (gazeInRegion && !active) {
      this.setState({ active: true });
      onActivate();
    } else if (!gazeInRegion && active) {
      this.setState({ active: false });
      onDeactivate();
    }
  }

  render() {
    const {
      x, y,
      width, height,
      enabledColor,
      activeColor,
      disabledColor,
      visible,
    } = this.props;

    const {
      enabled, active,
    } = this.state;

    const style = {
      position: 'absolute',
      top: `${y * window.innerHeight}px`,
      left: `${x * window.innerWidth}px`,
      width: `${width * window.innerWidth}px`,
      height: `${height * window.innerHeight}px`,
      backgroundColor: enabled ? (active ? activeColor : enabledColor) : disabledColor,
      visibility: visible ? 'visible' : 'hidden',
    };

    return (
      <div style={style} />
    );
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

GazeRegion.propTypes = {
  eyeTracker: propTypes.instanceOf(EyeTracker).isRequired,
  x: propTypes.number.isRequired,
  y: propTypes.number.isRequired,
  width: propTypes.number.isRequired,
  height: propTypes.number.isRequired,
  enabledColor: propTypes.string,
  activeColor: propTypes.string,
  disabledColor: propTypes.string,
  onActivate: propTypes.func,
  onDeactivate: propTypes.func,
  onEnable: propTypes.func,
  onDisable: propTypes.func,
  visible: propTypes.bool,
};

GazeRegion.defaultProps = {
  enabledColor: '#0022aa',
  activeColor: '#1144cc',
  disabledColor: '#888888',
  onActivate: () => {},
  onDeactivate: () => {},
  onEnable: () => {},
  onDisable: () => {},
  visible: false,
};

export default GazeRegion;
