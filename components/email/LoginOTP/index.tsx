import React from "react";

interface Props {
  email: string;
  otp: string;
}

const LoginOTP = ({ email, otp }: Props) => {
  return (
    <div>
      <p>
        Your email address <b>{email}</b> was used to initiate a log in request
        on <b>OnchainWizard</b>, use to OTP below to continue
      </p>
      <br />
      <h1>{otp}</h1>
    </div>
  );
};

export default LoginOTP;
