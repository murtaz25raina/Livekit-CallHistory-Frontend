import { FC } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { useClientContext } from "../../providers/ClientProvider";
import LoginHeader from "./LoginHeader/LoginHeader";
import LoginForm from "./LoginForm/LoginForm";
import "./Login.css";
import { setLocalStorage } from "helpers/localStorage";
import { useNavigate } from "react-router";
import { createClient } from "matrix-js-sdk";
import { toast } from "react-toastify";
import environment from "environments/environments";

interface LoginFormFields {
  name: string;
  password: string;
}

const Login: FC = () => {
  const methods: UseFormReturn<LoginFormFields> = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const { errors } = methods.formState;
  const navigate = useNavigate();
  const { startClient, setupSync } = useClientContext();
  const client = createClient({
    baseUrl: environment.baseURL,
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (
    data: LoginFormFields
  ) => {
    try {
      const { name, password } = data;
      const response = await client.login("m.login.password", {
        user: name,
        password: password,
      });
      const { user_id, access_token, device_id } = response;
      setLocalStorage([
        { key: "user_id", value: user_id },
        { key: "access_token", value: access_token },
        { key: "device_id", value: device_id },
      ]);
      await startClient();
      setupSync();
      navigate("/chat");
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="login-container">
      <LoginHeader />
      <LoginForm
        onSubmit={onSubmit}
        methods={methods}
        errors={errors}
        isLoading={false}
      />
    </div>
  );
};

export default Login;
