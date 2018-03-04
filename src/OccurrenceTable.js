import { createAutoCorrectedDatePipe } from 'text-mask-addons';
import MaskedInput from 'react-text-mask';

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import Tooltip from './Tooltip';

import Button, { IconButton } from './Button';

const TooltipContent = props => {
  const { timeDiff } = props;
  const label = Number.isNaN(timeDiff) ? 'No record available' : `${timeDiff} days`;
  return (
    <div>
      {label}
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
    const timeDiff = row.value === null ? null : moment().diff(moment(row.value, 'MM-DD-YYYY'), 'days');

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

const EditableCell = (props) => {
  const { column, index, value, tdProps } = props;
  const { selected, updateCellSelection } = tdProps.rest;
  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Tab') {
      // updateCellSelection(column.index + 1);
    }

  };

  let input;

  return (
    <input
      ref={ref => { input = ref; }}
      className='editable-cell'
      type='text'
      value={value}
      // onFocus={e => { e.stopPropagation(); }}
      // onBlur={e => column.updateData(e.target.value, index)}
      onChange={e => column.updateData(e.target.value, index)}
      onKeyDown={e => handleKeyDown(e)}
    />
  );

};

const EditableDateCell = props => {

  const { column, index, value, tdProps } = props;
  const { selected, updateCellSelection } = tdProps.rest;
  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Tab') {
      // updateCellSelection(column.index + 1);
    }

  };

  const formattedValue = value ? value.format('MM-DD-YYYY') : null;

  return (<MaskedInput
    className='editable-cell'
    type='text'
    placeholder='mm-dd-yyyy'
    value={formattedValue}
    onFocus={e => { e.stopPropagation(); }}
    onBlur={e => {
      const correctedValue = e.target.value ? e.target.value.replace(/(?:(?:(\d)_|_(\d))(?=-)|(\d*)_+(\d*))/g, (match, p1, p2, p3, p4) => (match.length > 2 ? (p3 + p4).padStart(4, '0') : `0${p1 || p2}`)) : null;

      if (correctedValue !== formattedValue) {
        const momentValue = moment(correctedValue, 'MM-DD-YYYY');
        column.updateData(momentValue, index);
      }
    }}
    onKeyDown={e => handleKeyDown(e)}
    // onChange={e => column.updateData(e.target.value, index)}
    mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
    pipe={createAutoCorrectedDatePipe('mm-dd-yyyy')}
    keepCharPositions
  />);
};

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
  rowInfo: PropTypes.shape({}),
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
};

ContextMenu.defaultProps = {
  rowInfo: undefined,
};

class TrGroupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
    TrGroupComponent.displayName = 'TrGroup';
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected) {
      this.container.focus();
    }
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

  focusChild() {
    // ReactDOM.findDOMNode(this.props.children[0]).focus();
    this.container.getElementsByClassName('editable-cell')[0].focus();
  }

  handleKeyDown(e) {
    const { key } = e;
    const { addRow, removeRow, rowInfo, updateCellSelection } = this.props;
    e.stopPropagation();
    e.preventDefault();
    if (key === 'Enter' || key === 'Tab') {
      this.focusChild();
    } else if (key === '+' && rowInfo) {
      addRow();
    } else if (key === '-' && rowInfo) {
      removeRow();
    }
  }

  // This is triggered before the cell handlers
  handleKeyDownCapture(e) {
    const { key } = e;
    const { rowInfo, updateRowSelection, updateCellSelection } = this.props;

    if (key === 'ArrowDown' && rowInfo) {
      e.stopPropagation();
      e.preventDefault();
      updateRowSelection(rowInfo.index + 1);
    } else if (key === 'ArrowUp' && rowInfo) {
      e.stopPropagation();
      e.preventDefault();
      updateRowSelection(rowInfo.index - 1);
    }
  }

  render() {
    const { children, addRow, removeRow, className, rowInfo, updateRowSelection, showMenu: sm, ...rest } = this.props;
    const { showMenu } = this.state;

    return (
      <div
        ref={div => { this.container = div; }}
        role='row'
        tabIndex={rowInfo && rowInfo.index === 0 ? 0 : -1}
        onContextMenu={e => this.toggleMenu(e)}
        // onClick={e => this.toggleMenu(e)}
        onKeyDown={e => this.handleKeyDown(e)}
        onKeyDownCapture={e => this.handleKeyDownCapture(e)}
        // onMouseOver={e => this.showMenu(e)}
        // onFocus={rowInfo && rowInfo.index === 0 ? (e) => {updateRowSelection(rowInfo.index)} : () => {}}
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
      {
        index: 0,
        Header: 'First Name',
        id: 'firstName',
        updateData: (val, index) => this.updateRow(val, index, 'firstName'),
        accessor: 'firstName',
        Cell: EditableCell,
      },
      {
        index: 1,
        Header: 'Last Name',
        id: 'lastName',
        updateData: (val, index) => this.updateRow(val, index, 'lastName'),
        accessor: 'lastName',
        Cell: EditableCell,
      },
      {
        index: 2,
        Header: 'Last Occurrence',
        id: 'lastOccurrence',
        accessor: 'lastOccurrence',
        updateData: (val, index) => this.updateRow(val, index, 'lastOccurrence'),
        Cell: EditableDateCell,
      },
      {
        index: 3,
        Header: 'Recency',
        id: 'recency',
        accessor: d => (d.lastOccurrence ? d.lastOccurrence : null),
        Cell: row => <RecencyCell row={row} />,
      },
    ];

    this.state = {
      y: 0, // is this a bad idea?
      x: -1,
      showMenu: false,
    };
  }

  componentDidUpdate() {
    this.props.save(this.props.data);
    console.log(this.state);
  }

  handleKeyDown(e) {
    const { key } = e;

    if (key === '+') {
      this.addNewRow();
    }
  }

  updateRowSelection(y) {
    const newY = Math.max(0, Math.min(this.props.data.length - 1, y))

    this.setState({
      y: newY,
    });
  }

  updateCellSelection(x) {
    // const newX = Math.max(0, Math.min(this.props.data[0].length, x));

    this.setState({
      x,
    });
  }

  // toggleMenu() {
  //   this.setState({
  //     showMenu: !this.state.showMenu,
  //   })
  // }

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
      selected: rowInfo ? this.state.y === rowInfo.index : false,
      // showMenu: this.state.showMenu,
      // onContextMenu: () => this.toggleMenu
      removeRow: () => this.removeRow(rowInfo.index),
      addRow: () => this.addNewRow(rowInfo.index),
      updateRowSelection: (y) => this.updateRowSelection(y),
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
