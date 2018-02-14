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

ModalContainer.propTypes = {
    children: PropTypes.element.isRequired,
  };

ModalContainer.Basic = props => {
    const { header, body } = props;
  return (
    <div className='modal-container basic'>
      <div className='modal-header basic'>{header}</div>
      <div className='modal-body basic'>{body}</div>
    </div>
  );
};

ModalContainer.Basic.propTypes = {
    header: PropTypes.element.isRequired,
    body: PropTypes.element.isRequired,
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
      this.el.classList.add('modal');

      const { header, body } = this.props;

      return ReactDOM.createPortal(
        <ModalContainer.Basic header={header} body={body}>
          {this.props.children}
        </ModalContainer.Basic>,
        this.el
      );
    }
}

Modal.propTypes = {
    children: PropTypes.element.isRequired,
    header: PropTypes.element.isRequired,
    body: PropTypes.element.isRequired,
// target: PropTypes.instanceOf(Element).isRequired,
};
