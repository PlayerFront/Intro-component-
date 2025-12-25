import { useState } from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import errorIcon from '../../../assets/icons/icon-error.svg';
import FormField from '../FormField/FormField';
import EyeIcon from '../EyeIcon/EyeIcon';
import { useField } from '../../../hooks/useField';
import { useAuth } from '../../../hooks/useAuth';
import { testUsers } from '../../../mocks/test-users';
import { validateName, validateEmail, validatePassword } from '../../../utils/validation';
import './_form.scss';

const FORM_TEXTS = {
  login: {
    button: 'LOG IN',
    switchText: 'Do not have an account?',
    switchLink: 'Sing Up',
  },
  register: {
    button: 'CLAIM YOUR FREE TRIAL',
    switchText: 'Already have an account?',
    switchLink: 'Log In',
  },
};

const Form = () => {
  // state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  // auth
  const { login, register, isLoading } = useAuth();

  //form fields
  const firstName = useField('', (value) => validateName(value, 'First Name'));
  const lastName = useField('', (value) => validateName(value, 'Last Name'));
  const email = useField('', (value) => validateEmail(value, 'Email'));
  const password = useField('', (value) => validatePassword(value, 'Password'));

  // handlers
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const switchFormMode = () => {
    [firstName, lastName, email, password].forEach(field => {
      field.setTouched?.(false);
      field.setError?.('');
    });
    setIsLoginMode(!isLoginMode);
  };

  const getFieldsToValidate = () => {
    return isLoginMode ? [email, password] : [firstName, lastName, email, password];
  };

  const validateForm = () => {
    const fieldsToValidate = getFieldsToValidate();
    let hasErrors = false;

    fieldsToValidate.forEach((field, index) => {

      console.log(`Field ${index} before handleBlur:`, {
        value: field.value,
        error: field.error,
        touched: field.touched,
      });
      const error = field.handleBlur();

      if (error) {
        hasErrors = true;
      }

      console.log(`Field ${index} after handleBlur:`, {
        value: field.value,
        error: field.error,
        touched: field.touched,
      });
    });
    return hasErrors;
  };

  const getFormData = () => ({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });

  const handleAuthSuccess = (result, formData) => {

    alert(`${result.data.message}\n\nWelcome, ${result.data.user.firstName}`);

    if (!isLoginMode) {
      setIsLoginMode(true);
    }
  };

  const handleAuthError = (result) => {
    alert(`Error: ${result.error}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmiting) return;

    setIsSubmiting(true);

    try {
      const hasErrors = validateForm();
      if (hasErrors) return;

      const formData = getFormData();
      const result = isLoginMode
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);

      result.success
        ? handleAuthSuccess(result, formData)
        : handleAuthError(result);
    } catch (error) {
      alert('Error, try it later');
    } finally {
      setIsSubmiting(false);
    }
  };

  const currentTexts = FORM_TEXTS[isLoginMode ? 'login' : 'register'];

  return (
    <div className='intro-component__form'>
      <PrimaryButton>
        <p>
          <span className='intro-component__span'>Try it free 7 days
          </span>
          then $20/mo. thereafter
        </p>
      </PrimaryButton>

      <form className='form' onSubmit={handleSubmit}>
        <div className='form__container'>
          {!isLoginMode && (
            <>
              <FormField
                field={firstName}
                type='text'
                name='firstName'
                placeholder='First Name'
              />
              <FormField
                field={lastName}
                type='text'
                name='lastName'
                placeholder='Last Name'
              />
            </>
          )}
          <FormField
            field={email}
            type='email'
            name='email'
            placeholder='Email Address'
          />
          <FormField
            field={password}
            type={isPasswordVisible ? 'text' : 'password'}
            name='password'
            placeholder='Password'
            className='form__field--password'
          >
            {password.value && (
              <div
                className='form__password-toggle'
                onClick={togglePasswordVisibility}
              >
                <EyeIcon
                  className='form__eye-icon'
                />
              </div>
            )}
          </FormField>
          <SecondaryButton
            type='submit'
            disabled={isSubmiting}
          >
            {isSubmiting ? 'Loading' : currentTexts.button}
          </SecondaryButton>
        </div>
        <div className='form__addition'>
          <p className='form__conditions'>
            By clicking the button, you are agreeing to our
            <a className='form__conditions-link' href='#'> Terms and Services</a>
          </p>
          <p className='form__login'> {isLoginMode ? 'Do not have an account? ' : 'Already have an account? '}
            <a
              className='form__login-link'
              href='#'
              onClick={switchFormMode}
            >
              {currentTexts.switchLink}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Form;