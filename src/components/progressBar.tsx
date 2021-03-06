interface Props {
  max: number;
  current: number;
  className?: string;
}

const ProgressBar: React.FC<Props> = ({ max, current, className }) => {
  return (
    <div className={`border border-primary-600 bg-primary-200 ${className}`}>
      <div
        className="h-full bg-primary-600"
        style={{ width: `${(current * 100) / max}%` }}
      />
    </div>
  );
};

export default ProgressBar;
