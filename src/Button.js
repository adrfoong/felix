import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Button.css';

const Button = props => {
  const { href, onClick, children } = props;
  return href ? <a href={href}> { children } </a> : <button onClick={onClick} className='button'> { children } </button>;
};

const requiredProps = ['href', 'onClick'];

const oneOrTheOther = (props, componentName, propPool) => {
  const error = !propPool.some(prop => props[prop])

  if (error) {
    const list = propPool.join(', ');
    return new Error(`One of these props must be supplied to ${componentName}: ${list}`);
  }
};

Button.propTypes = {
  href: (props, propName, componentName) => {
    const error = oneOrTheOther(props, componentName, requiredProps);
    if (error) {
      return error;
    } else if (props[propName] && typeof props[propName] !== 'string') {
      return new Error(`\`href\` supplied to  ${componentName} needs to be a string.`);
    }
    return null;
  },
  onClick: (props, propName, componentName) => {
    const error = oneOrTheOther(props, componentName, requiredProps);
    if (error) {
      return error;
    } else if (props[propName] && typeof props[propName] !== 'function') {
      return new Error(`\`onClick\` supplied to  ${componentName} needs to be a function.`);
    }
    return null;
  },
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  href: undefined,
  onClick: undefined,
}

export default Button;
