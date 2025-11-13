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
        setError(validator ? validator(value) : '');
    }

    const markAsTouched = () => {
        setTouched(true);
        setError(validator ? validator(value) : '');
    };

    return {
        value,
        error,
        touched,
        handleChange,
        handleBlur,
        setTouched: markAsTouched,
        setError
    };
};