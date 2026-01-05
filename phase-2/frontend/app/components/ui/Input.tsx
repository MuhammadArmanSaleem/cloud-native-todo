// Input component with props interface - following nextjs-frontend skill patterns
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full 
          px-3 py-2 
          border rounded-md 
          text-gray-900 
          placeholder-gray-400
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

