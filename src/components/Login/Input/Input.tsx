import { IconType } from "react-icons";
import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import "./Input.css";

interface LoginFormFields {
  name: string;
  password: string;
}

interface InputProps {
  name: string;
  errors: FieldErrors<LoginFormFields>;
  register: UseFormRegister<LoginFormFields>;
  labelName: string;
  Icon: IconType;
  requiredMessage: string;
}

const Input: FC<InputProps> = ({
  name,
  errors,
  register,
  labelName,
  Icon,
  requiredMessage,
}) => {
  return (
    <div className="login-input-container">
      <label htmlFor={name} className="login-input-label">
        <span className="login-input-label-text">{labelName}</span>
        <div className="login-input-field-container">
          <span className="login-input-icon">
            <Icon className="login-input-icon-size" />
          </span>
          <input
            className="login-input-field"
            id={name}
            {...register(name as keyof LoginFormFields, {
              required: requiredMessage,
            })}
          />
        </div>
      </label>
      {errors[name as keyof LoginFormFields]?.message && (
        <span className="login-input-error">
          {errors[name as keyof LoginFormFields]?.message}
        </span>
      )}
    </div>
  );
};

export default Input;
