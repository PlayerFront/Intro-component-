import { renderHook } from '@testing-library/react';
import { useField } from './useField';
import { act } from '@testing-library/react';

const mockValidator = jest.fn();

describe('useField - Legacy Version', () => {
  beforeEach(() => {
    mockValidator.mockClear();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useField('initial value', mockValidator));

    expect(result.current.value).toBe('initial value');
    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(false);
  });

  test('should update value when handleChange is called', () => {
    const { result } = renderHook(() => useField('', mockValidator));

    act(() => {
      result.current.handleChange({ target: { value: 'new value' } });
    });

    expect(result.current.value).toBe('new value');
  });

  test('should validate on blur and set error', () => {
    mockValidator.mockReturnValue('Field is required');
    const { result } = renderHook(() => useField('', mockValidator));

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('Field is required');
  });

  test('should validate error in real-time after field is touched', () => {

    mockValidator
      .mockReturnValueOnce('Error for new value')
      .mockReturnValueOnce('Error for another');

    const { result } = renderHook(() => useField('', mockValidator));
 
    act(() => {
      result.current.handleChange({ target: { value: 'new value' } });
    });

    expect(result.current.value).toBe('new value');
    expect(result.current.touched).toBe(false);
    expect(result.current.error).toBe('');

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.value).toBe('new value');
    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('Error for new value');

    act(() => {
      result.current.handleChange({target: {value: 'another new value'}});
    });

    expect(result.current.value).toBe('another new value');
    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('Error for another');
  });

  test('should mark field as touched and validate when markAsTouched is caalled', () => {
    mockValidator.mockReturnValue('Field is required');

    const { result } = renderHook(() => useField('', mockValidator));

    act(() => {
      result.current.setTouched();
    });

    expect(result.current.touched).toBe(true);
    expect(mockValidator).toHaveBeenCalledWith('');
    expect(result.current.error).toBe('Field is required');
  });

  test('should reset field to initial when reset is called', () => {
    mockValidator.mockReturnValue('Error message');

    const initialValue = 'initial';
    const { result } = renderHook(() => useField(initialValue, mockValidator));

    act(() => {
      result.current.handleChange({ target: { value: 'change value' } });
      result.current.handleBlur();
    });

    expect(result.current.value).toBe('change value');
    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('Error message');

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe(initialValue);
    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(false);
  });
});
