import './Button.css';

function Button({ children, variant = 'primary', type = 'button', onClick, disabled, fullWidth }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
