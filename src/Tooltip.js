import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Tooltip extends Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
      this.root = document.getElementById('tooltip-root');
    }

    componentDidMount() {
      this.root.appendChild(this.el);
    }

    componentWillUnmount() {
      this.root.removeChild(this.el);
    }

    render() {
      const { target } = this.props;

      const position = target.getBoundingClientRect();

      this.el.classList.add('tooltip');
      this.el.style.position = 'fixed';
      this.el.style.top = `${position.top - 30}px`;
      this.el.style.left = `${position.left}px`;

      return ReactDOM.createPortal(
        this.props.children,
        this.el
      );
    }
  }

  Tooltip.propTypes = {
    children: PropTypes.element.isRequired,
    target: PropTypes.instanceOf(Element).isRequired,
  };
