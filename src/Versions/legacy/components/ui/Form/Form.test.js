import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

jest.mock('../../../hooks/useAuth');
jest.mock('../../../hooks/useField');

import { useAuth } from '../../../hooks/useAuth';
import { useField } from '../../../hooks/useField';

describe('form - legacy version', () => {
  const mockUseAuth = {
    user: null,
    isLoading: false,
    error: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  };

  const mockUseField = (defaultValue = '', validator) => ({
    value: defaultValue,
    error: '',
    touched: false,
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setTouched: jest.fn(),
    setError: jest.fn(),
    reset: jest.fn(),
  });

  beforeEach(() => {
    useAuth.mockReturnValue(mockUseAuth);
    useField.mockImplementation(mockUseField);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    }

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

  // it's test for finding eye-icon in DOM
  // test('debug FormField rendering', async () => {

  //   const mockPasswordField = {
  //     value: '123',
  //     error: '',
  //     touched: false,
  //     handleChange: jest.fn(),
  //     handleBlur: jest.fn(),
  //     setTouched: jest.fn(),
  //     setError: jest.fn(),
  //     reset: jest.fn(),
  //   };

  //   useField
  //     .mockReturnValueOnce({ ...}) 
  //     .mockReturnValueOnce({ ...}) 
  //     .mockReturnValueOnce({ ...}) 
  //     .mockReturnValueOnce(mockPasswordField); 

  //   render(<Form />);

  //   all components of form
  //   const formFields = screen.getAllByRole('textbox'); 
  //   console.log('Всего полей:', formFields.length);

  //   children of password's field
  //   const passwordContainer = screen.getByPlaceholderText('Password').parentElement;
  //   console.log('Children пароля:', passwordContainer.children.length);
  //   console.log('HTML пароля:', passwordContainer.innerHTML);
  // });
});