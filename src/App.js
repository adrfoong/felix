import React, { Component } from 'react';
// import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import ReactTable from 'react-table';
// import moment from 'moment';
import 'react-table/react-table.css';

// import data from './data';
import './App.css';
// import avatar from './avatar.png';

import occurrences from './occurrences';
import OccurrenceTable from './OccurrenceTable';
import Modal from './Modal';


// const Card = props => (
//   <div className='card'>
//     {props.children}
//   </div>
// );

// Card.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// const ProfileCard = (props) => {
//   const { name, expertise } = props;

//   return (
//     <Card>
//       <div className='card-image-column'>
//         <img src={avatar} className='card-image' alt='avatar' />
//       </div>
//       <div className='card-main-column'>
//         <div className='card-name'>{name}</div>
//         <div className='card-field'>{expertise}</div>
//       </div>
//     </Card>
//   );
// };

// ProfileCard.propTypes = {
//   name: PropTypes.string.isRequired,
//   expertise: PropTypes.string.isRequired,
// };

// const Cardbox = (props) => {
//   const { items, CardType } = props;

//   return (
//     <div className='card-box'>
//       { items.map(item => <CardType {...item} />) }
//     </div>
//   );
// };

// Cardbox.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.object).isRequired,
//   CardType: PropTypes.func.isRequired,
// };

const ModalContent = props => (
  <div className='modal-content'>
      TEST
  </div>
  );

export default class App extends Component {
    constructor(props, context) {
      super(props, context);
      this.test = occurrences.record;

      this.state = {
        modalActive: false,
      };
    }

    openModal() {
      this.setState({ modalActive: true });
    }

    closeModal() {
      this.setState({ modalActive: false });
    }

    render() {
      const { modalActive } = this.state;
      return (
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>Welcome to React</h1>
          </header>
          <OccurrenceTable data={this.test} />
          <button onClick={() => this.openModal()}>Add</button>
          { modalActive ? <Modal><ModalContent /></Modal> : null}
        </div>
      );
    }
}
