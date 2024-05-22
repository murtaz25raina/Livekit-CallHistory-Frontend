import { FC } from "react";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { SubmitHandler, UseFormReturn, FieldErrors } from "react-hook-form";
import Input from "../Input/Input";
import Loader from "../../Loader/Loader";
import "./LoginForm.css";

interface LoginFormFields {
  name: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormFields>;
  methods: UseFormReturn<LoginFormFields>;
  errors: FieldErrors<LoginFormFields>;
  isLoading: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  methods,
  errors,
  isLoading,
}) => {
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="login-form-container"
    >
      <div className="login-form-input-container">
        <Input
          Icon={AiOutlineUser}
          errors={errors}
          labelName="Username"
          name="name"
          register={methods.register}
          requiredMessage="Please enter your username"
        />
        <Input
          Icon={AiOutlineLock}
          errors={errors}
          labelName="Password"
          name="password"
          register={methods.register}
          requiredMessage="Please enter your password"
        />
      </div>
      <div className="mt-5">
        <button type="submit" className="login-submit-button">
          <span className="login-submit-button-text">Login</span>
          {isLoading && <Loader />}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
