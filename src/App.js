import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import data from './data';
import './App.css';
import avatar from './avatar.png';

const Card = props => (
  <div className='card'>
    {props.children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

const ProfileCard = (props) => {
  const { name, expertise } = props;

  return (
    <Card>
      <div className='card-image-column'>
        <img src={avatar} className='card-image' alt='avatar' />
      </div>
      <div className='card-main-column'>
        <div className='card-name'>{name}</div>
        <div className='card-field'>{expertise}</div>
      </div>
    </Card>
  );
};

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  expertise: PropTypes.string.isRequired,
};

const Cardbox = (props) => {
  const { items, CardType } = props;

  return (
    <div className='card-box'>
      { items.map(item => <CardType {...item} />) }
    </div>
  );
};

Cardbox.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  CardType: PropTypes.func.isRequired,
};

export default class App extends Component {
    constructor(props, context) {
      super(props, context);
      this.test = 'a';
    }

    render() {
      return (
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>Welcome to React</h1>
          </header>
          <p className='App-intro'>
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <span>Teachers</span>
          <Cardbox items={data.teachers} CardType={ProfileCard} />
          <span>Learners</span>
          <Cardbox items={data.learners} CardType={ProfileCard} />
        </div>
      );
    }
}
