import React from "react";

interface Props {
  email: string;
  url: string;
}

const LoginRequest = ({ email, url }: Props) => {
  return (
    <div>
      <p>
        Your email address <b>{email}</b> was used to initiate a log in request
        on <b>OnchainWizard</b>, follow the link below to continue.
      </p>
      <br />
      <p>{url}</p>
    </div>
  );
};

export default LoginRequest;
