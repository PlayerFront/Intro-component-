import './_primary-button.scss';

const PrimaryButton = ({
  children,
  href,
  onClick,
  type = 'button',
  external = false,
  ...props
}) => {
  const className = 'primary-button';

  const linkProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer',
  } : {};

  if (href) {
    return (
      <a
        className={className}
        href={href}
        {...linkProps}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;