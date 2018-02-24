
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import Tooltip from './Tooltip';

import Button, { IconButton } from './Button';

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
    const width = timeDiff !== null ? Math.max(1, Math.min(timeDiff, 100)) : 0;
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
};

const EditableCell = (cellInfo) => (
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

const ContextMenu = props => {
  const { closeMenu, rowInfo, addRow, removeRow } = props;
  let container;
  const handleOutsideClick = (e) => {
    if (container && !container.contains(e.target)) {
      document.removeEventListener('mousedown', handleOutsideClick);

      closeMenu();
    }
  };

  document.addEventListener('mousedown', handleOutsideClick);


  return (
    <div className='context-menu' ref={ref => { container = ref; }}>
      <div className='context-menu__content'>
        <div className='button-container'>
          <IconButton disabled={!rowInfo} onClick={addRow} className='add'><i className='fas fa-plus' /></IconButton>
          <IconButton disabled={!rowInfo} onClick={removeRow} className='remove'><i className='fas fa-times' /></IconButton>
        </div>
      </div>
    </div>
  );
};

ContextMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  rowInfo: PropTypes.shape({}).isRequired,
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
};

class TrGroupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
    TrGroupComponent.displayName = 'TrGroup';
  }

  showMenu() {
    this.setState({
      showMenu: true,
    });
  }

  hideMenu() {
    this.setState({
      showMenu: false,
    });
  }

  toggleMenu(e) {
    e.preventDefault();
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  render() {
    const { children, addRow, removeRow, className, rowInfo, ...rest } = this.props;
    const { showMenu } = this.state;

    return (
      <div
        onContextMenu={e => this.toggleMenu(e)}
        // onMouseOver={e => this.showMenu(e)}
        // onFocus={() => { console.log('focus'); }}
        // onMouseOut={e => this.hideMenu(e)}
        // onBlur={() => { console.log('blur'); }}
        className={classNames('rt-tr-group context-menu__container', className)}
        {...rest}
      >
        {/* {React.Children.map(children, child => child ? React.cloneElement(child, { ...child.props, className: classNames(child.props.className, { blur: showMenu }) }) : child)} */}
        {children}
        {showMenu ? <ContextMenu closeMenu={() => this.hideMenu()} rowInfo={rowInfo} addRow={addRow} removeRow={removeRow} /> : null}
      </div>
    );
  }
}

TrGroupComponent.propTypes = {
  rowInfo: PropTypes.shape({}),
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
};

TrGroupComponent.defaultProps = {
  className: undefined,
  rowInfo: undefined,
};

class OccurrenceTable extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      { Header: 'First Name', id: 'firstName', updateData: (val, index) => this.updateRow(val, index, 'firstName'), accessor: 'firstName', Cell: EditableCell },
      { Header: 'Last Name', id: 'lastName', updateData: (val, index) => this.updateRow(val, index, 'lastName'), accessor: 'lastName', Cell: EditableCell },
      { Header: 'Last Occurrence', id: 'lastOccurrence', accessor: d => (d.lastOccurrence ? moment(d.lastOccurrence).format('LL') : null) },
      {
          Header: 'Recency',
          id: 'recency',
          accessor: d => (d.lastOccurrence ? d.lastOccurrence : null),
          Cell: row => <RecencyCell row={row} />,
      },
    ];
  }

  componentDidUpdate() {
    this.props.save(this.props.data);
  }

  updateRow(val, index, prop) {
    const { updateAppState, data } = this.props;

    const change = { [prop]: val };

    // Create new data state
    const updatedData = data.map((_row, i) => {
      if (i !== index) {
        return _row;
      }

      return { ..._row, ...change };
    });

    // Update state with new state
    updateAppState(updatedData);
  }

  addNewRow(index) {
    const { updateAppState, data } = this.props;

    const updatedData = index !== undefined ?
      [...data.slice(0, index + 1), { firstName: 'John', lastName: 'Doe', lastOccurrence: moment() }, ...data.slice(index + 1)] :
      [...data, { firstName: 'John', lastName: 'Doe', lastOccurrence: moment() }];
    updateAppState(updatedData);
  }

  removeRow(index) {
    const { updateAppState, data } = this.props;

    const updatedData = [...data.slice(0, index), ...data.slice(index + 1)];
    updateAppState(updatedData);
  }

  render() {
    // We're not going to modify data at this point, just take data from the state and render
    const { data } = this.props;

    const settings = {
      defaultPageSize: 10,
    };

    const TrGroupProps = (state, rowInfo) => ({
      rowInfo,
      removeRow: () => this.removeRow(rowInfo.index),
      addRow: () => this.addNewRow(rowInfo.index),
    });

    return (
      <div className='occurrence-table'>
        <ReactTable
          className='-striped -highlight'
          {...settings}
          data={data}
          columns={this.columns}
          getTrGroupProps={TrGroupProps}
          TrGroupComponent={TrGroupComponent}
        />
        <Button onClick={() => this.addNewRow()}>Add Row</Button>
      </div>
    );
  }
}

OccurrenceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  save: PropTypes.func.isRequired,
  updateAppState: PropTypes.func.isRequired,
};

export default OccurrenceTable;
