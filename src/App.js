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
import { BasicModal, Modal, ModalPortalHOC } from './Modal';
import Button from './Button';


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

export default class App extends Component {
    constructor(props, context) {
      super(props, context);
      this.test = occurrences.record;
      this.modalPortal = ModalPortalHOC(
        Button,
        <BasicModal
          header='Hello'
          body='you'
          onAccept={() => this.closeModal()}
          onCancel={() => this.closeModal()}
        />
      );

      this.state = {
        showModal: false,
      };
    }

    openModal() {
      this.setState({ showModal: true });
    }

    closeModal() {
      this.setState({ showModal: false });
    }

    render() {
      const { showModal } = this.state;
      const ModalPortal = this.modalPortal;
      return (
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>Welcome to React</h1>
          </header>
          <OccurrenceTable data={this.test} />
          <ModalPortal showModal={showModal}>Modal</ModalPortal>
        </div>
      );
    }
}
