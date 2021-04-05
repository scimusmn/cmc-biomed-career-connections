import React from 'react';
import propTypes from 'prop-types';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class EyeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutId: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    console.log('MOUSE ENTER');
    const { displayString, onTrigger, timeout } = this.props;
    const timeoutId = setTimeout(onTrigger, timeout, displayString);
    this.setState({ timeoutId });
  }

  onMouseLeave() {
    // const { onLeave } = this.props;
    const { timeoutId } = this.state;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      // onLeave();
      this.setState({ timeoutId: null });
    }
  }

  render() {
    const {
      displayString, active, isSelected, style,
    } = this.props;
    const className = isSelected ? 'EyeButtonSelected' : 'EyeButton';
    if (active) {
      return (
        <div
          className={className}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className="EyeButtonContent" style={style}>
            {displayString}
          </div>
        </div>
      );
    }

    return (
      <div className="EyeButtonInactive">
        <div className="EyeButtonContent">
          {displayString}
        </div>
      </div>
    );
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EyeButton.propTypes = {
  displayString: propTypes.string.isRequired,
  onTrigger: propTypes.func.isRequired,
  // onLeave: propTypes.func.isRequired,
  timeout: propTypes.number,
  active: propTypes.bool,
  isSelected: propTypes.bool,
  style: propTypes.objectOf(propTypes.any),
};

EyeButton.defaultProps = {
  timeout: 1000,
  active: true,
  isSelected: false,
  style: { border: '1px solid white' },
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default EyeButton;
