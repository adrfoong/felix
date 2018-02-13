import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ModalContainer = props => {
  return (
    <div className='modal-container'>
      { props.children }
    </div>
  );
};

ModalContainer.Basic = props => {

  // const headerStyle = {
  //   backgroundColor: '#4195fc',
  //   height: '50px'
  // };

  return (
    <div className='modal-container basic'>
      <div className='modal-header basic'>Header</div>
      <div className='modal-body basic'>Body</div>
    </div>
  );
};

ModalContainer.propTypes = {
  children: PropTypes.element.isRequired,
};

export default class Modal extends Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
      this.root = document.getElementById('modal-root');
    }

    componentDidMount() {
      this.root.appendChild(this.el);
    }

    componentWillUnmount() {
      this.root.removeChild(this.el);
    }

    render() {
    //   const { target } = this.props;

    //   const position = target.getBoundingClientRect();

      this.el.classList.add('modal');
    //   this.el.style.position = 'fixed';
    //   this.el.style.top = `${position.top - 30}px`;
    //   this.el.style.left = `${position.left}px`;

      return ReactDOM.createPortal(
        <ModalContainer.Basic>
          {this.props.children}
        </ModalContainer.Basic>,
        this.el
      );
    }
  }

  Modal.propTypes = {
    children: PropTypes.element.isRequired,
    // target: PropTypes.instanceOf(Element).isRequired,
  };
