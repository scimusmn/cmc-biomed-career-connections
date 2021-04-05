import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'gatsby';
import withSerialCommunication from '@components/Serial/SerialHOC';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastMessage: '...waiting on first message',
    };

    this.onData = this.onData.bind(this);
    this.sendClick = this.sendClick.bind(this);
  }

  componentDidMount() {
    const { setOnDataCallback } = this.props;
    setOnDataCallback(this.onData);
  }

  onData(data) {
    // data parsing from the HOC is being weird, but grabbing a substring works
    // as a weird hack for now
    console.log(data);
    if (data[5] === 'o') {
      window.location.replace('http://localhost:3000/calibration');
    }

    this.setState({
      lastMessage: JSON.stringify(data),
    });
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
    const { lastMessage } = this.state;
    return (
      <Container className="home-background component-container">
        <button type="button" onClick={() => this.sendClick('{wake-arduino:1}')}>
          Wake Arduino
          {lastMessage}
        </button>

        <Row>
          <Col style={{ textAlign: 'right', marginTop: '440px' }} md={{ size: 6, offset: 3 }}>
            <h1 className="header-arabic">
              .ءﺪﺒﻠﻟ   ﺪﻳﺪﺠﻟا مﺪﺨﺘﺴﻤﻟا رز ﻰﻠﻋ ﻂﻐﺿا
            </h1>
            <hr className="arabic-hr" />
            <p className="arabic-p">
              ئ للروح ، أي أنهم كدح لي ، لقد هجروا العامئ للروح ، أي أنهم كدح
            </p>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '100px' }}>
            <Link to="/calibration">ئ للروح ، أي أنهم كدح</Link>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 6, offset: 3 }} style={{ marginTop: '440px' }}>
            <h1 className="uppercase-english">
              Use Eye tracking
              <br />
              to play a song
            </h1>
            <hr className="english-hr" />
            <p className="english-p">
              Before you can play a song, the eye tracking device needs to be adjusted
              to follow your eyes. The computer will lead you through this simple, 30-second
              process. Follow the instructions on the screen.
            </p>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '100px' }}>
            <span className="uppercase-english">Press the</span>
            <a href="http://localhost:3000/calibration">
              <span className="uppercase-english" style={{ color: 'white', fontWeight: 900 }}>&nbsp;new user&nbsp;</span>
            </a>
            <span className="uppercase-english">button to begin</span>
          </Col>
        </Row>
      </Container>
    );
  }
}

Home.propTypes = {
  setOnDataCallback: propTypes.func.isRequired,
  sendData: propTypes.func.isRequired,
};

const HomeWithSerial = withSerialCommunication(Home);

export default HomeWithSerial;
