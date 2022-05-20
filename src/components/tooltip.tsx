interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<Props> = ({ title, className, children }) => {
  return (
    <div className="relative w-min">
      <div className="peer">{children}</div>
      <div
        className={`b1 invisible absolute top-10 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md bg-primary-200 p-2 shadow-md peer-hover:visible peer-hover:w-max w-0 ${className}`}
      >
        {title}
      </div>
    </div>
  );
};

export default Tooltip;
