import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PrimaryButton from '../../../../../components/ui/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../../../components/ui/SecondaryButton/SecondaryButton';
import EyeIcon from '../../../../../components/ui/EyeIcon/EyeIcon';
import './_form.scss';
import { useEffect, useState } from 'react';
import { realAuthService } from '../../../services/real-auth-service';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Looks like this is not an email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'),
});
const loginSchema = z.object({
  email: z.string().email('Looks like this is not an email'),
  password: z.string().min(1, 'Password is required'),
});

const Form = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(isLoginMode ? loginSchema : registerSchema),
    mode: 'onBlur',
  });

  const switchFormMode = () => {
    reset();
    setIsLoginMode(!isLoginMode);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data) => {
    console.log('Sending to real API', data); //!!!!!!!!!!!

    const result = isLoginMode
      ? await realAuthService.login(data)
      : await realAuthService.register(data);

    console.log('API response:', result); //!!!!!!!!
    if (result.success) {
      alert(`${result.message}`);
      if (!isLoginMode) setIsLoginMode(true);
    } else {
      alert(`${result.error}`);
    }
  };

  return (
    <div className='intro-component__form'>
      <PrimaryButton>
        <p>
          <span className='intro-component__span'>Try it free 7 days
          </span>
          then $20/mo. thereafter
        </p>
      </PrimaryButton>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className='form__container'>
          {!isLoginMode && (
            <>
              <div className='form__field'>
                <input
                  className={`form__input ${errors.firstName ? 'form__input--error' : ''}`}
                  type='text'
                  placeholder='First Name'
                  {...register('firstName', {
                    onBlur: () => trigger('firstName'),
                  })}
                />
                {errors.firstName && (
                  <div className='form__error'>
                    <span className='form__error-text'>{errors.firstName.message}</span>
                  </div>
                )}
              </div>
              <div className='form__field'>
                <input
                  className={`form__input ${errors.lastName ? 'form__input--error' : ''}`}
                  type='text'
                  placeholder='Last Name'
                  {...register('lastName', {
                    onBlur: () => trigger('lastName'),
                  })}
                />
                {errors.lastName && (
                  <div className='form__error'>
                    <span className='form__error-text'>{errors.lastName.message}</span>
                  </div>
                )}
              </div>
            </>
          )}
          <div className='form__field'>
            <input
              className={`form__input ${errors.email ? 'form__input--error' : ''}`}
              type='email'
              placeholder='Email Address'
              {...register('email', {
                onBlur: () => trigger('email'),
              })}
            />
            {errors.email && (
              <div className='form__error'>
                <span className='form__error-text'>{errors.email.message}</span>
              </div>
            )}
          </div>
          <div className='form__field form__field--password'>
            <input
              className={`form__input ${errors.password ? 'form__input--error' : ''}`}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder='Password'
              {...register('password', {
                onBlur: () => trigger('password'),
              })}
            />
            {watch('password') && (
              <div
                className="form__password-toggle"
                onClick={togglePasswordVisibility}
              >
                <EyeIcon className="form__eye-icon" />
              </div>
            )}
            {errors.password && (
              <div className='form__error'>
                <span className='form__error-text'>{errors.password.message}</span>
              </div>
            )}
          </div>
          <SecondaryButton
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading' : (isLoginMode ? 'LOG IN' : 'CLAIM YOUR FREE TRIAL')}
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
              {isLoginMode ? 'Sign Up' : 'Log In'}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Form;