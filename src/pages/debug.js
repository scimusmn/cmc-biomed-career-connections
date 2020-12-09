/* eslint no-console: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-return-assign: 0 */
/* eslint import/no-named-as-default: 0 */
/* eslint import/no-named-as-default-member: 0 */
/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react';
import {
  InputGroup, InputGroupAddon, Button, Input,
} from 'reactstrap';
import ReactScrollableList from 'react-scrollable-list';
import withSerialCommunication from '../Arduino/arduino-base/ReactSerial/SerialHOC';

class DebugPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      log: [],
      logCount: 0,
    };

    this.onData = this.onData.bind(this);
    this.sendClick = this.sendClick.bind(this);

    this.logLimit = 150;
    this.logArray = [];

    this.SERIAL_COMMANDS = {
      Global: ['{arduino-ready:1}', '{get-all-states:1}'],
      Coal: ['{coal-1-light:off}', '{coal-1-light:warming}', '{coal-1-light:on}'],
      Gas: ['{gas-1-light-bar:0}', '{gas-1-light-bar:33}', '{gas-1-light-bar:66}', '{gas-1-light-bar:100}'],
      Hydro: ['{hydro-1-light-bar:0}', '{hydro-1-light-bar:33}', '{hydro-1-light-bar:66}', '{hydro-1-light-bar:100}'],
      Solar: ['{solar-1-light-bar:0}', '{solar-1-light-bar:33}', '{solar-1-light-bar:66}', '{solar-1-light-bar:100}'],
      Wind: ['{wind-1-light-bar:0}', '{wind-1-light-bar:33}', '{wind-1-light-bar:66}', '{wind-1-light-bar:100}'],
    };
  }

  componentDidMount() {
    const { setOnDataCallback } = this.props;
    setOnDataCallback(this.onData);
  }

  onData(data) {
    console.log('onData:', data);
    const { logCount } = this.state;
    const timestamp = Date.now();
    const logData = {
      // Generate unique ID
      id: `${logCount}-${timestamp}`,
      content: `${logCount} - ${timestamp} - ${JSON.stringify(data)}`,
    };

    this.logArray.push(logData);

    if (this.logArray.length > this.logLimit) this.logArray.shift();

    this.setState({
      log: this.logArray,
      logCount: logCount + 1,
    });

    // For testing purposes, all incoming
    // `hydro-X-lever` msgs are immediately
    // responded to with an outgoing `hydro-X-light-bar` msg.
    const inMsg = Object.keys(data)[0];
    if (inMsg.startsWith('hydro-') && inMsg.endsWith('-lever')) {
      console.log('hydro lever input recognized');
      const panelId = inMsg.substring(6, 7);
      const responseMsg = `hydro-${panelId}-light-bar`;
      const responseVal = Object.values(data)[0];
      const response = `{${responseMsg}:${responseVal}}`;
      console.log('responseObj', response);
      const { sendData } = this.props;
      sendData(response);
    }
  }

  sendClick(msg) {
    console.log('sendClick:', msg);

    // This is where we pass it through
    // our HOC method to Stele, which passes
    // to Serial device.
    const { sendData } = this.props;
    sendData(msg);
  }

  render() {
    const { log, logCount } = this.state;
    const { ipcAvailable } = this.props;
    return (
      <div style={{ padding: '5%', backgroundColor: 'SkyBlue' }}>
        <h1>
          Energy Distribution - Communication Debug Page
          {' '}
          <span role="img" aria-label="radar">📡</span>
        </h1>
        <hr />
        <br />
        {Object.keys(this.SERIAL_COMMANDS).map((keyName, i) => (
          <div key={i}>
            <h3>{keyName}</h3>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {this.SERIAL_COMMANDS[keyName].map((cmd, index) => (
                <Button
                  key={index}
                  color="primary"
                  onClick={() => this.sendClick(cmd)}
                >
                  {cmd}
                </Button>
              ))}
            </div>
            <hr />
          </div>
        ))}
        <div>
          <h3>Custom Message</h3>
          <br />
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button
                color="primary"
                onClick={() => this.sendClick(this.sendTextInput.value)}
              >
                Send:
              </Button>
              <Input
                innerRef={(input) => (this.sendTextInput = input)}
                placeholder="{wake-arduino:1}"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <hr />
        <p style={{ fontSize: '14px' }}>NOTE: All incoming `hydro-X-lever` messages are immediately responded to with an outgoing `hydro-X-light-bar` message.</p>
        <br />
        <h3>
          Incoming Message Log
        </h3>
        <ReactScrollableList
          listItems={this.logArray}
          heightOfItem={30}
          maxItemsToRender={this.logLimit}
          style={{
            height: '278px',
            boxSizing: 'border-box',
            overflowY: 'scroll',
            overflowAnchor: 'none',
            border: '#ddd solid 1px',
            backgroundColor: '#efefef',
          }}
        />
        <span style={{ fontSize: '12px', color: logCount < this.logLimit ? 'gray' : 'red' }}>
          History limit:
          {' '}
          {log.length}
          /
          {this.logLimit}
        </span>
        <br />
        <hr />
        <h4>
          <strong>IPC communication available:</strong>
          {' '}
          <span style={{ color: ipcAvailable.toString() === 'false' ? 'red' : 'green' }}>{ipcAvailable.toString()}</span>
        </h4>
      </div>
    );
  }
}

const DebugPageWithSerialCommunication = withSerialCommunication(DebugPage);

export default DebugPageWithSerialCommunication;
