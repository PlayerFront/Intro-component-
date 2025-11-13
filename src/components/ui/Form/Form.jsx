import { useState } from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import errorIcon from '../../../assets/icons/icon-error.svg';
import FormField from '../FormField/FormField';
import { useField } from '../../../hooks/useField';
import './_form.scss';
import EyeIcon from '../EyeIcon/EyeIcon';

const Form = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    // messages is truly better for all inputs
    const getvalidationMessages = (fieldName = 'This field') => ({
        required: `${fieldName} is required`,
        empty: `${fieldName} cannot be empty`,
        tooShort: `${fieldName} must be at least 2 characters long`,
        tooLong: `${fieldName} cannot  exceed 50 characters`,
        invalidChars: `${fieldName} can only contain letters, hyphens, and astrophes`,
        multipleSpaces: `${fieldName} cannot contain multiple spaces`,
        invalidFormat: `${fieldName} cannot start/end with hyphen/astrophe or have consecutive special characters`,
        invalidEmail: `Looks like this is not an ${fieldName}`,
        invalidPassword: `${fieldName} should contain at least one number and one special character`
    });

    // common function for firstName and lastName
    const validateName = (value, fieldName = 'Name') => {
        const messages = getvalidationMessages(fieldName);

        if (!value || typeof value !== 'string') {
            return messages.required;
        }

        const trimmedValue = value.trim();

        if (!trimmedValue) return messages.empty;
        if (trimmedValue.length < 2) return messages.tooShort;
        if (trimmedValue.length > 50) return messages.tooLong;

        const validNameRegex = /^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/;
        if (!validNameRegex.test(trimmedValue)) return messages.invalidChars;
        if (/\s{2,}/.test(trimmedValue)) return messages.multipleSpaces;
        if (/^[-']|[-']$|[-']{2,}/.test(trimmedValue)) return messages.invalidFormat;

        return '';
    }

    // function for email validation
    const validateEmail = (value, fieldName = 'Email') => {
        const messages = getvalidationMessages(fieldName);

        if (!value || typeof value !== 'string') {
            return messages.required;
        }

        const trimmedValue = value.trim();
        if (!trimmedValue) return messages.empty;
        if (trimmedValue.length < 2) return messages.tooShort;

        const validEmailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!validEmailRegex.test(trimmedValue)) return messages.invalidEmail;

        return '';
    }

    // function for password validation
    const validatePassword = (value, fieldName = 'Password') => {
        const messages = getvalidationMessages(fieldName);

        if (!value || typeof value !== 'string') {
            return messages.required;
        }

        const trimmedValue = value.trim();
        if (!trimmedValue) return messages.empty;
        if (trimmedValue.length < 2) return messages.tooShort;
        if (trimmedValue.length > 50) return messages.tooLong;

        const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{2,50}$/;
        if (!validPasswordRegex.test(trimmedValue)) return messages.invalidPassword;
    }

    const firstName = useField('', (value) => validateName(value, 'First Name'));
    const lastName = useField('', (value) => validateName(value, 'Last Name'));
    const email = useField('', (value) => validateEmail(value, 'Email'));
    const password = useField('', (value) => validatePassword(value, 'Password'));

    // common function for sending data
    const handleSubmit = (e) => {
        e.preventDefault();

        [firstName, lastName, email, password].forEach(field => {
            field.setTouched(true);
        });

        const hasErrors = [firstName, lastName, email, password].some(field => field.error);

        if (!hasErrors) {
            console.log('Form Submitted:', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            });
        }

        // TODO: callback API or Mock-server
    }

    return (
        <div className='intro-component__form'>
            <PrimaryButton>
                <p><span className='intro-component__span'>Try it free 7 days</span>  then $20/mo. thereafter</p>
            </PrimaryButton>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form__container'>
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
                    >
                        {password.value && !password.error && (
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
                    <SecondaryButton type='submit'>
                        CLAIM YOUR FREE TRIAL
                    </SecondaryButton>
                </div>
                <div className='form__addition'>
                    <p className='form__conditions'>By clicking the button, you are agreeing to our <a className='form__conditions-link' href='#'>Terms and Services</a></p>
                    <p className='form__login' >Do you have an account? <a className='form__login-link' href='#'>Log In</a></p>
                </div>
            </form>
        </div >
    );
};

export default Form;