interface Props {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<Props> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={
        "h4 rounded bg-primary-600 px-5 py-2 text-white hover:bg-primary-500" +
        " " +
        className
      }
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
