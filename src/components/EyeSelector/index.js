import React from 'react';
import propTypes from 'prop-types';
import EyeButton from '../EyeButton';

class EyeSelector extends React.Component {
  constructor(props) {
    super(props);
    const { initialSelection } = this.props;
    this.state = {
      currentChoice: initialSelection,
    };

    this.select = this.select.bind(this);
  }

  select(choice, index) {
    const { onSelection } = this.props;
    this.setState({ currentChoice: index });
    onSelection(choice, index);
  }

  render() {
    const { choices } = this.props;
    const { currentChoice } = this.state;
    const row = [];
    choices.forEach((choice, index) => {
      row.push(
        <td>
          <EyeButton
            isSelected={currentChoice === index}
            displayString={choice}
            onTrigger={() => this.select(choice, index)}
          />
        </td>,
      );
    });

    return (
      <table>
        <tr>
          {row}
        </tr>
      </table>
    );
  }
}

EyeSelector.propTypes = {
  choices: propTypes.arrayOf(propTypes.string).isRequired,
  onSelection: propTypes.func.isRequired,
  initialSelection: propTypes.number,
};

EyeSelector.defaultProps = {
  initialSelection: 0,
};

export default EyeSelector;
