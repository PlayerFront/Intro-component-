import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';
import { waitFor } from '@testing-library/react';

jest.mock('../../../hooks/useAuth');
jest.mock('../../../hooks/useField');

import { useAuth } from '../../../hooks/useAuth';
import { useField } from '../../../hooks/useField';

const mockUseField = (value = '', error = '', touched = false) => ({
  value,
  error,
  touched,
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setTouched: jest.fn(),
  setError: jest.fn(),
  reset: jest.fn(),
});

const mockUseAuth = {
  user: null,
  isLoading: false,
  error: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
};

beforeEach(() => {
  useAuth.mockReturnValue(mockUseAuth);
  useField.mockImplementation(mockUseField);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('form - legacy version, unit tests', () => {

  // Test for register mode and rendering all fields
  test('should render all form fields in register mode', () => {
    render(<Form />);

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('CLAIM YOUR FREE TRIAL')).toBeInTheDocument();

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  // TEST for login mode and rendering only two fields
  test('should render only email and password fields in login mode', async () => {
    render(<Form />);

    await userEvent.click(screen.getByText('Log In'));

    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Last Name')).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('LOG IN')).toBeInTheDocument();

    expect(screen.getByText(/Do not have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Sing Up/i)).toBeInTheDocument();
  });

  // test for switching modes 
  test('should switch register and login modes', async () => {

    render(<Form />);

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('CLAIM YOUR FREE TRIAL')).toBeInTheDocument();

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Log In'));

    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Last Name')).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('LOG IN')).toBeInTheDocument();

    expect(screen.getByText(/Do not have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Sing Up/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/Sing Up/i));

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('CLAIM YOUR FREE TRIAL')).toBeInTheDocument();

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('should find eye icon when password has value', async () => {
    useField
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce({
        value: '123',
        error: '',
        touched: false,
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        setTouched: jest.fn(),
        setError: jest.fn(),
        reset: jest.fn(),
      });

    render(<Form />);

    const eyeIcon = document.querySelector('.form__password-toggle');
    expect(eyeIcon).toBeInTheDocument();
  });

  // test for password visibility or hiding
  test('should toggle password visibility', async () => {
    const mockPasswordField = {
      value: 'mypassword',
      error: '',
      touched: false,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      setTouched: jest.fn(),
      setError: jest.fn(),
      reset: jest.fn(),
    };

    useField
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce(mockUseField())
      .mockReturnValueOnce(mockPasswordField);

    render(<Form />);

    const passwordInput = screen.getByPlaceholderText('Password');

    await userEvent.type(passwordInput, 'mypassword');

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const passwordFieldContainer = passwordInput.closest('.form__field');
    const children = Array.from(passwordFieldContainer.children);

    const eyeIcon = children[1];

    expect(eyeIcon.className).toContain('form__password-toggle');
    fireEvent.click(eyeIcon);

    expect(passwordInput).toHaveAttribute('type', 'text');

  });

  // test for empty form
  test('should show validation errors before submit', async () => {

    useField.mockImplementation((defaultValue, validator) => ({
      value: defaultValue,
      error: 'Field is required',
      touched: true,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      setTouched: jest.fn(),
      setError: jest.fn(),
      reset: jest.fn(),
    }));

    render(<Form />);

    await userEvent.click(screen.getByText('CLAIM YOUR FREE TRIAL'));

    const errorMessages = screen.getAllByText(/required/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  //test for successful registration
  test('should call register with form data on submit', async () => {

    // for mock useAuth
    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      user: { id: 1, email: 'John@doe.com' },
      message: 'Registration successful',
    });
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      register: mockRegister,
      login: jest.fn(),
      logout: jest.fn(),
    });

    // mocks useField with value
    useField
      .mockReturnValueOnce({ ...mockUseField(), value: 'John' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Doe' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'John@doe.com' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'John123!' });

    render(<Form />);
    await userEvent.click(screen.getByText('CLAIM YOUR FREE TRIAL'));

    expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@doe.com',
      password: 'John123!',
    });

    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});

// integration tests
describe('Form-legacy version, integration tests', () => {
  test('User can register and form switches to login Mode', async () => {
    // моки
    const mockAlert = jest.fn();
    global.alert = mockAlert;

    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      data: {
        user: { id: 1, email: 'John@doe.com', firstName: 'John' },
        message: 'Registration successful! You can now login',
      },
    });

    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      register: mockRegister,
      login: jest.fn(),
      logout: jest.fn(),
    });

    useField
      .mockReturnValueOnce({ ...mockUseField(), value: 'John' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Doe' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'John@doe.com' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Password123!' });

    render(<Form />);

    userEvent.type(screen.getByPlaceholderText('First Name'), 'John');
    userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    userEvent.type(screen.getByPlaceholderText('Email Address'), 'John@doe.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'Password123!');

    await userEvent.click(screen.getByText('CLAIM YOUR FREE TRIAL'));

    expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@doe.com',
      password: 'Password123!',
    });


    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining('Registration successful'),
    );

    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Last Name')).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('LOG IN')).toBeInTheDocument();

    expect(screen.getByText(/Do not have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Sing Up/i)).toBeInTheDocument();

  });

  test('Validation error - correction - success', async () => {
    const mockAlert = jest.fn();
    global.alert = mockAlert;

    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      data: {
        user: { id: 2, email: 'correct@email.com', firstName: 'John' },
        message: 'Registration successful',
      },
    });

    useAuth.mockReturnValue({
      register: mockRegister,
      login: jest.fn(),
      logout: jest.fn(),
    });

    useField
      .mockReturnValueOnce({ ...mockUseField(), value: 'John' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Doe' })
      .mockReturnValueOnce({
        ...mockUseField(),
        value: 'invalid-email',
        error: 'Looks like this is not an Email',
      })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Password123!' });

    const { rerender } = render(<Form />);
    expect(screen.getByText(/Looks like this is not an Email/i)).toBeInTheDocument();

    useField.mockReset();
  
    let callCount = 0;
    useField.mockImplementation((defaultValue, validator) => {
      callCount++;
      const baseMock = mockUseField();
    
      switch (callCount) {
      case 1: return { ...baseMock, value: 'John' };
      case 2: return { ...baseMock, value: 'Doe' };
      case 3: return { ...baseMock, value: 'correct@email.com', error: '' };
      case 4: return { ...baseMock, value: 'Password123!' };
      default: return baseMock;
      }
    });

    await act(async () => {
      rerender(<Form />);
    });

    expect(screen.queryByText(/Looks like this is not an Email/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('CLAIM YOUR FREE TRIAL'));

    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining('Registration successful'),
    );
  
    expect(screen.getByText('LOG IN')).toBeInTheDocument();
  });

  test('user handels network error and retries successfully', async () => {
    const mockAlert = jest.fn();
    global.alert = mockAlert;

    let callCount = 0;
    const mockRegister = jest.fn()
      .mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        } else {
          return Promise.resolve({
            success: true,
            data: {
              user: { id: 3, email: 'test@retry.com', firstName: 'Retry' },
              message: 'Registration successful after retry',
            },
          });
        }
      });

    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      register: mockRegister,
      login: jest.fn(),
      logout: jest.fn(),
    });

    useField
      .mockReturnValueOnce({ ...mockUseField(), value: 'Retry' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'User' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'test@retry.com' })
      .mockReturnValueOnce({ ...mockUseField(), value: 'Retry123!' });

    const { rerender } = render(<Form />);

    const submitButton = screen.getByText('CLAIM YOUR FREE TRIAL');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error, try it later');
    });

    expect(submitButton).toHaveTextContent('CLAIM YOUR FREE TRIAL');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('Registration successful'),
      );
    });

    expect(mockRegister).toHaveBeenCalledTimes(2);

    expect(screen.getByText('LOG IN')).toBeInTheDocument();
  });
});