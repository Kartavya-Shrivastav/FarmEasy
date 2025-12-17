const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
