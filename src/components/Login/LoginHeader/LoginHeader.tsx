import { FC } from "react";
import "./LoginHeader.css";
import logo from "../../../assets/img/logo.svg";

const LoginHeader: FC = () => {
  return (
    <div className="login-header-container">
      <img src={logo} alt="copper" />
      <h1 className="login-header-title">
        <b>Sign In</b>
      </h1>
    </div>
  );
};

export default LoginHeader;
