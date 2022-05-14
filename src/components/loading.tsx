interface Props {
  className?: string;
}

export default function Loading({ className }: Props) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div>
        <div className="border-primary h-24 w-24 animate-spin rounded-full border-8 border-solid text-primary-600 [border-top-color:transparent]"></div>
      </div>
    </div>
  );
}
