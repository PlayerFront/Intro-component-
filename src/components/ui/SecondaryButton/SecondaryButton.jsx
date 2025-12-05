import './_secondary-button.scss';

const SecondaryButton  = ({
  children,
  onClick,
  type='button',
}) => {
  const className = 'secondary-button';

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}  
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
