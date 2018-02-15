import React, { Component } from 'react';
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
    this.el.classList.add('modal');

    const { children } = this.props;

    return ReactDOM.createPortal(
      // <BasicModal header={header} body={body}>
      //   {this.props.children}
      // </BasicModal>,
      children,
      this.el
    );
  }
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  // header: PropTypes.element.isRequired,
  // body: PropTypes.element.isRequired,
// target: PropTypes.instanceOf(Element).isRequired,
};

const ModalContainer = props => {
  const { className } = props;

  return (
    <div className={classNames('modal-container', className)}>
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

const BasicModal = props => {
  const { header, body } = props;
  return (
    <Modal>
      <ModalContainer className='basic'>
        <div className='modal-header basic'>{header}</div>
        <div className='modal-body basic'>
          {body}
          <Button href='asd'>Click me</Button>
          <button className='button outline'>Click Me</button>
        </div>
      </ModalContainer>
    </Modal>
  );
};

BasicModal.propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
};

export { BasicModal, Modal };
