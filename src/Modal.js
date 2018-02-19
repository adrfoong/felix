import React, { Component, Fragment } from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';

import './Modal.css';

const ModalPortalHOC = (WrappedComponent, ModalElement) => {
  class ModalPortal extends Component {
    constructor(props) {
      super(props);
      this.modalPortal = document.createElement('div');
    }

    componentWillReceiveProps() {
      this.handleShowModal();
    }

    shouldComponentUpdate() {
      if (this.ignoreUpdate) {
        this.ignoreUpdate = false;
        return false;
      }

      return true;
    }

    handleShowModal() {
      const { showModal } = this.props;

      if (!showModal) {
        this.unmountModal();
        this.ignoreUpdate = true;
      }
    }

    unmountModal() {
      ReactDOM.unmountComponentAtNode(this.modalPortal);
      this.parent.removeChild(this.modalPortal);
    }

    mountModal(e) {
      this.parent = e.target.parentNode;

      this.parent.insertBefore(this.modalPortal, e.target);
      ReactDOM.render(React.cloneElement(ModalElement, { isOpen: true, unmountModal: () => this.unmountModal() }), this.modalPortal);
    }

    render() {
      const { children } = this.props;
      return (
        <WrappedComponent onClick={(e) => this.mountModal(e)}>{children}</WrappedComponent>
      );
    }
  }

  ModalPortal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    showModal: PropTypes.bool.isRequired,
  };

  return ModalPortal;
};

class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.root = document.getElementById('modal-root');
  }

  componentDidMount() {
    this.root.appendChild(this.el);
    document.addEventListener('mousedown', (e) => this.handleOutsideClick(e));
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
    document.removeEventListener('mousedown', (e) => this.handleOutsideClick(e));
  }

  handleOutsideClick(e) {
    if (this.container && !this.container.contains(e.target)) {
      // console.log('Clicked outside');
      this.forceClose();
    }
  }

  forceClose() {
    this.props.unmountModal();
  }

  render() {
    const { children, variant, isOpen } = this.props;

    this.el.classList.add('modal');
    if (isOpen) {
      this.el.classList.add('show');
    } else {
      this.el.classList.remove('show');
    }

    const variantClass = `modal__container--${variant}`;

    return (
      isOpen ? ReactDOM.createPortal(
        <ModalContainer containerRef={ref => { this.container = ref; }} className={classNames('modal__container', variantClass)}>
          { children }
        </ModalContainer>,
        this.el
      ) : null
    );
  }
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  variant: PropTypes.string,
  unmountModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

Modal.defaultProps = {
  variant: undefined,
};

const ModalContainer = props => {
  const { className, containerRef } = props;

  return (
    <div ref={containerRef} className={classNames('modal__container', className)}>
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
  containerRef: PropTypes.func.isRequired,
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
          <Button className='slide-right' variant='outline' onClick={onCancel}>OK</Button>
          <Button className='slide-down' onClick={onAccept}>Cancel</Button>
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
  const { unmountModal, isOpen } = props;
  return (
    <Modal variant='basic' isOpen={isOpen} unmountModal={unmountModal}>
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
    unmountModal: PropTypes.func,
};

BasicModal.defaultProps = {
  isOpen: false,
  unmountModal: () => { throw new Error('`unmountModal` is not defined for BasicModal'); },
};

export { BasicModal, Modal, ModalPortalHOC };
