import React from "react";
import PropTypes from 'prop-types';

const ButtonThree = ({ children, className = '', onClick, ...restProps }) => {
    return (
        <button className={`${className} inline-flex items-center justify-center gap-2 rounded-md bg-warning py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`} onClick={onClick} {...restProps}>
            {children}
        </button>
    );
};

ButtonThree.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default ButtonThree;
