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
  };

  const handleBlur = () => {
    setTouched(true);
    if (validator) {
      const validatorResult = validator(value);
      setError(validatorResult);
      return validatorResult;
    }
    return '';
  };

  const markAsTouched = () => {
    setTouched(true);
    if (validator) {
      setError(validator(value));
    }
  };

  const reset = () => {
    setValue(defaultValue);
    setError('');
    setTouched(false);
  };

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    setTouched: markAsTouched,
    setError,
    reset,
  };
};