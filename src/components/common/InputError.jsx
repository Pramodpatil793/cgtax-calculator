import React from 'react';

const InputError = ({ message }) => {
    return message ? <p className="text-red-400 text-xs mt-1 ml-1">{message}</p> : null;
};

export default InputError;