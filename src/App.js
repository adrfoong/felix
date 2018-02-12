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

  const STALE_THRESHOLD = 60;
  const MEDIUM_THRESHOLD = 30;
  const FRESH_THRESHOLD = 0;
  
  // If the last occurrence is null, we set timeDiff to null
  const timeDiff = row.value === null ? null : moment().diff(moment(row.value), 'days');
  console.log(moment(row.value))
console.log(timeDiff)
  // If timeDiff is null, we don't want the bar to show up
  // Otherwise, the bar should at least be 1 pixel wide
  const width = timeDiff ? Math.max(1, 100 - timeDiff) : 0;
  let age;

  if (timeDiff >= STALE_THRESHOLD) {
    age = 'stale';
  } else if (timeDiff >= MEDIUM_THRESHOLD) {
    age = 'medium';
  } else if (timeDiff >= FRESH_THRESHOLD) {
    age = 'fresh';
  } else { // timeDiff can be null
    age = null;
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
   { Header: 'Last Occurrence', id: 'lastOccurrence', accessor: d => (d.lastOccurrence ? moment(d.lastOccurrence).format('LL') : null) },
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
