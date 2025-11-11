import PrimaryButton from '../PrimaryButton/PrimaryButton';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import './_form.scss';

const Form = () => {
    return (
        <div className='intro-component__form'>
            <PrimaryButton>
                <p><span className='intro-component__span'>Try it free 7 days</span>  then $20/mo. thereafter</p>
            </PrimaryButton>
            <form className='form'>
                <div className='form__container'>
                    <input className='form__input ' type='text' name='firstname' placeholder='First Name'></input>
                    <input className='form__input' type='text' name='lastname' placeholder='Last Name'></input>
                    <input className='form__input' type='email' name='email' placeholder='Email Address'></input>
                    <input className='form__input' type='password' name='password' placeholder='Password'></input>
                    <SecondaryButton>
                        CLAIM YOUR FREE TRIAL
                    </SecondaryButton>
                </div>
                <div className='form__addition'>
                    <p className='form__conditions'>By clicking the button, you are agreeing to our <a className='form__conditions-link' href='#'>Terms and Services</a></p>
                    <p className='form__login' >Do you have an account? <a className='form__login-link' href='#'>Log In</a></p>
                </div>
            </form>
        </div>
    );
};

export default Form;