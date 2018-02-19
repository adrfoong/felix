
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import Tooltip from './Tooltip';

const TooltipContent = props => {
  const { timeDiff } = props;
  return (
    <div>
      {`${timeDiff} days`}
    </div>
  );
};

TooltipContent.propTypes = {
  timeDiff: PropTypes.number.isRequired,
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
    // const width = timeDiff ? Math.max(1, 100 - timeDiff) : 0;
    const width = timeDiff ? Math.max(1, Math.min(timeDiff, 100)) : 0;
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

const EditableCell = (cellInfo) => {
  return (
    <div
      style={{ backgroundColor: '#fafafa' }}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => {
        cellInfo.column.updateData(e.target.innerHTML, cellInfo.index);
      }}
    >
      { cellInfo.row[cellInfo.column.id] }
    </div>
  );
};

class OccurrenceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };

    this.columns = [
      { Header: 'First Name', id: 'firstName', updateData: (val, index) => this.update(val, index, 'firstName'), accessor: 'firstName', Cell: EditableCell },
      { Header: 'Last Name', id: 'lastName', updateData: (val, index) => this.update(val, index, 'lastName'), accessor: 'lastName', Cell: EditableCell },
      { Header: 'Last Occurrence', id: 'lastOccurrence', accessor: d => (d.lastOccurrence ? moment(d.lastOccurrence).format('LL') : null) },
      {
          Header: 'Recency',
          id: 'recency',
          accessor: d => (d.lastOccurrence ? d.lastOccurrence : null),
          Cell: row => <RecencyCell row={row} />,
      },
    ];
  }

  /**
   * Delegate control to update state with modified data
   */
  update(val, index, prop) {
    const { data } = this.state;

    const change = { [prop]: val };

    // Create new data state
    const updatedData = data.map((_row, i) => {
      if (i !== index) {
        return _row;
      }

      return { ..._row, ...change };
    });

    // Update state with new state
    this.setState({ data: updatedData });
  }

  render() {
    // We're not going to modify data at this point, just take data from the state and render
    const { data } = this.state;

    const settings = {
      defaultPageSize: 10,
    };

    return (
      <div className='occurrence-table'>
        <ReactTable className='-striped -highlight' {...settings} data={data} columns={this.columns} />
      </div>
    );
  }
}

OccurrenceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OccurrenceTable;
