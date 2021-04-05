/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import propTypes from 'prop-types';
import EyeTracker from '../EyeTracker';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class EyePositionIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      visible: true,
    };
  }

  componentDidMount() {
    const { eyeTracker } = this.props;
    eyeTracker.addSubscriber(this);
  }

  componentWillUnmount() {
    const { eyeTracker } = this.props;
    eyeTracker.removeSubscriber(this);
  }

  onPresence(userIsPresent) {
    this.setState({ visible: userIsPresent });
  }

  onPosition(x, y) {
    this.setState({ x, y });
  }

  render() {
    const {
      diameter,
      border,
      filled,
      color,
    } = this.props;
    const { x, y, visible } = this.state;

    const diameterNumber = parseInt(diameter.replace(/^\D+/g, ''), 10);

    const style = {
      position: 'absolute',
      layer: 99999,
      top: `${y * window.innerHeight - (diameterNumber / 2)}px`,
      left: `${x * window.innerWidth - (diameterNumber / 2)}px`,
      width: diameter,
      height: diameter,
      borderRadius: `${diameterNumber / 2}px`,
      backgroundColor: color,
      border,
      borderColor: color,
      visibility: visible ? 'visible' : 'hidden',
    };

    console.log(style.left, style.top);

    if (filled === true) {
      style.bgColor = color;
    }

    return (
      <div style={style} />
    );
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EyePositionIndicator.propTypes = {
  eyeTracker: propTypes.instanceOf(EyeTracker).isRequired,
  diameter: propTypes.string,
  border: propTypes.string,
  filled: propTypes.bool,
  color: propTypes.string,
};

EyePositionIndicator.defaultProps = {
  diameter: '100px',
  border: '5px',
  filled: false,
  color: '#00aaff',
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default EyePositionIndicator;
