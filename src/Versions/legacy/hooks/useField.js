import { useState } from 'react';

export const useField = (defaultValue = '', validator) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);


    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (touched) {
            setError(validator ? validator(newValue) : '');
        }
    }

    const handleBlur = () => {
        setTouched(true);
        setTimeout(() => {
            setError(validator(value));
        }, 200);
    };

    const markAsTouched = () => {
        setTouched(true);
        setError(validator ? validator(value) : '');
    };

    const reset = () => {
        setValue(defaultValue);
        setError('');
        setTouched(false); //!!!!!!!!!!!
    }

    return {
        value,
        error,
        touched,
        handleChange,
        handleBlur,
        setTouched: markAsTouched,
        setError,
        reset
    };
};