import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react"

interface InputProps {
  errors?: string[]
  name: string
}

const Input = (
  {
    name,
    errors = [],
    ...rest
  }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        ref={ref}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  )
}

export default forwardRef(Input)

/* const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, type, placeholder, errors = [], ...rest }: InputProps, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          name={name}
          type={type}
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          placeholder={placeholder}
          ref={ref}
          {...rest}
        />
        {errors.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input */
