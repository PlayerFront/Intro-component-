import './_form-field.scss';

const FormField = ({
  field,
  type = 'text',
  name,
  placeholder,
  children,
  className = '',
}) => (
  <div className={`form__field ${field.error ? 'form__field--error' : ''} ${className}`}>
    <input
      className={`form__input ${field.error ? 'form__input--error' : ''}`}
      type={type}
      name={name}
      placeholder={placeholder}
      value={field.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
    {children}
    {field.error && (
      <div className='form__error'>
        <span className='form__error-text'>{field.error}</span>
      </div>
    )}
  </div>
);

export default FormField;