import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';

import './Modal.css';

class Modal extends Component {
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
    const { children, isOpen, variant } = this.props;

    this.el.classList.add('modal');

    if (isOpen) {
      this.el.classList.add('show');
    } else {
      this.el.classList.remove('show');
    }

    const variantClass = `modal__container--${variant}`;

    return isOpen ? ReactDOM.createPortal(
      <ModalContainer className={classNames('modal__container', variantClass)}>
        { children }
      </ModalContainer>,
      this.el
    ) : null;
  }
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  isOpen: PropTypes.bool,
  variant: PropTypes.string,
};

Modal.defaultProps = {
  isOpen: false,
  variant: undefined,
};

const ModalContainer = props => {
  const { className } = props;

  return (
    <div className={classNames('modal__container', className)}>
      { props.children }
    </div>
  );
};

ModalContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  className: PropTypes.string,
};

ModalContainer.defaultProps = {
  className: '',
};

const BasicModalContent = props => {
  const { header, body, onAccept, onCancel } = props;
  return (
    <Fragment>
      <div className='modal__header--basic'>{header}</div>
      <div className='modal__body--basic'>
        {body}
      </div>
      <div className='modal__footer--basic'>
        <div className='button-container'>
          <Button variant='outline' onClick={onCancel}>OK</Button>
          <Button onClick={onAccept}>Cancel</Button>
        </div>
      </div>
    </Fragment>
  );
};

BasicModalContent.propTypes = {
  header: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


const BasicModal = props => {
  const { isOpen } = props;
  return (
    <Modal variant='basic' isOpen={isOpen}>
      <BasicModalContent {...props} />
    </Modal>
  );
};

BasicModal.propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
};

BasicModal.defaultProps = {
  isOpen: false,
};

export { BasicModal, Modal };
