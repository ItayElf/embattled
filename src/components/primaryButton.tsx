interface Props {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({
  children,
  className,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`h4 rounded bg-primary-600 px-5 py-2 text-white hover:bg-primary-500 disabled:bg-gray ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
