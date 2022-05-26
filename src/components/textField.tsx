interface Props {
  type: string;
  label: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

const TextField: React.FC<Props> = ({
  type,
  label,
  className,
  wrapperClassName,
  labelClassName,
  value,
  setValue,
  required,
  disabled,
  id,
}) => {
  return (
    <div className={`relative flex flex-col ${wrapperClassName}`}>
      <input
        id={id ?? label}
        type={type}
        value={value}
        className={`h5 peer w-full rounded border-none bg-primary-50 placeholder-transparent focus:border-0 focus:border-b-2 focus:border-solid focus:border-primary-600 focus:ring-0 focus:ring-offset-0 ${className}`}
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        disabled={disabled === true}
      />
      <label
        htmlFor={id ?? label}
        className={`s1 peer-placeholder-shown:h5 absolute -top-3.5 left-3 font-[ptsans] text-black peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-[ptsans] peer-placeholder-shown:text-gray ${labelClassName}`}
      >
        {label}
      </label>
    </div>
  );
};

export default TextField;
