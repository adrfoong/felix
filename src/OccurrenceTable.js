
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.root = document.getElementById('tooltip-root');
  }

  componentDidMount() {
    this.root.appendChild(this.el);
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    const { target } = this.props;

    const position = target.getBoundingClientRect();

    this.el.style.position = 'fixed';
    this.el.style.top = `${position.top - 20}px`;
    this.el.style.left = `${position.left}px`;

    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  target: PropTypes.instanceOf(Element).isRequired,
  // position: PropTypes.objectOf(PropTypes.number).isRequired,
  // content: PropTypes.element.isRequired,
};

const TooltipContent = props => {
  const { timeDiff } = props;
  const style = {
    backgroundColor: 'white',
    border: '2px solid blue',
  };
  return (
    <div style={style}>
      {`${timeDiff} days`}
    </div>
  );
};

TooltipContent.propTypes = {
  timeDiff: PropTypes.number.isRequired,
};

TooltipContent.propTypes = {
  // position: PropTypes.objectOf(PropTypes.number).isRequired,
};

class RecencyCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
    };
  }

  toggleTooltip(state) {
    this.setState({
      showTooltip: state,
    });
  }

  render() {
    const { row } = this.props;
    const { showTooltip } = this.state;
    const STALE_THRESHOLD = 60;
    const MEDIUM_THRESHOLD = 30;
    const FRESH_THRESHOLD = 0;

    // If the last occurrence is null, we set timeDiff to null
    const timeDiff = row.value === null ? null : moment().diff(moment(row.value), 'days');

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
          ref={bar => { this.indicator = bar; }}
          style={{
            width: `${width}%`,
          }}
          className={classNames('recency-cell-indicator', age)}
          onMouseOver={() => this.toggleTooltip(true)}
          onMouseOut={() => this.toggleTooltip(false)}
          onFocus={() => { console.log('hovering'); }}
          onBlur={() => { console.log('outing'); }}
        />
        { showTooltip ? <Tooltip target={this.indicator}><TooltipContent timeDiff={timeDiff} /></Tooltip> : null }
      </div>
    );
  }
}

RecencyCell.propTypes = {
  row: PropTypes.shape({
    value: PropTypes.any,
  }).isRequired,
  // position: PropTypes.objectOf(PropTypes.number).isRequired,
};

// const RecencyCell = (row) => {
//   const STALE_THRESHOLD = 60;
//   const MEDIUM_THRESHOLD = 30;
//   const FRESH_THRESHOLD = 0;

//   // If the last occurrence is null, we set timeDiff to null
//   const timeDiff = row.value === null ? null : moment().diff(moment(row.value), 'days');

//   // If timeDiff is null, we don't want the bar to show up
//   // Otherwise, the bar should at least be 1 pixel wide
//   const width = timeDiff ? Math.max(1, 100 - timeDiff) : 0;
//   let age;

//   if (timeDiff >= STALE_THRESHOLD) {
//     age = 'stale';
//   } else if (timeDiff >= MEDIUM_THRESHOLD) {
//     age = 'medium';
//   } else if (timeDiff >= FRESH_THRESHOLD) {
//     age = 'fresh';
//   } else { // timeDiff can be null
//     age = null;
//   }

//   return (
//     <div className='recency-cell-container'>
//       <div
//         style={{
//           width: `${width}%`,
//         }}
//         className={classNames('recency-cell-indicator', age)}
//       />
//     </div>
//   );
// };

const OccurrenceTable = (props) => {
  const { data } = props;

  const columns = [
      { Header: 'First Name', id: 'firstname', accessor: d => d.name.first },
      { Header: 'Last Name', id: 'lastname', accessor: d => d.name.last },
      { Header: 'Last Occurrence', id: 'lastOccurrence', accessor: d => (d.lastOccurrence ? moment(d.lastOccurrence).format('LL') : null) },
      {
          Header: 'Recency',
          id: 'recency',
          accessor: d => (d.lastOccurrence ? d.lastOccurrence : null),
          Cell: row => <RecencyCell row={row} />,
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

OccurrenceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OccurrenceTable;
