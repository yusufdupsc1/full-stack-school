import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type InputError =
  | FieldError
  | FieldErrorsImpl<any>
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: InputError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
}: InputFieldProps) => {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? (error as FieldError).message
      : undefined;

  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {message && (
        <p className="text-xs text-red-400">{message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
