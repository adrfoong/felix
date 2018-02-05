import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import 'react-table/react-table.css';

// import data from './data';
import './App.css';
import avatar from './avatar.png';

import occurrences from './occurrences';

const RecencyCell = (row) => {
  const timeDiff = row.value ? moment().diff(moment(row.value), 'days') : 100;

  const width = Math.max(1, 100 - timeDiff);
  let age;

  if (timeDiff > 60) {
    age = 'stale';
  } else if (timeDiff > 30) {
    age = 'medium';
  } else {
    age = 'fresh';
  }

  return (
    <div className='recency-cell-container'>
      <div
        style={{
          width: `${width}%`,
        }}
        className={classNames('recency-cell-indicator', age)}
      />
    </div>
  );
};

const OccurrenceTable = (props) => {
  const data = occurrences.record;
  const columns = [
   { Header: 'First Name', id: 'firstname', accessor: d => d.name.first },
   { Header: 'Last Name', id: 'lastname', accessor: d => d.name.last },
   { Header: 'Last', id: 'lastOccurrence', accessor: d => (d.lastOccurrence ? moment(d.lastOccurrence).format('LL') : null) },
   {
      Header: 'Recency',
      id: 'recency',
      accessor: d => (d.lastOccurrence ? d.lastOccurrence : null),
      Cell: RecencyCell,
    },
  ];
  const settings = {
    defaultPageSize: 10,
  };

  return (
    <div className='occurrence-table'>
      <ReactTable className='-striped -highlight' {...settings} data={data} columns={columns} />
    </div>
  );
};



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
          <OccurrenceTable />
        </div>
      );
    }
}
