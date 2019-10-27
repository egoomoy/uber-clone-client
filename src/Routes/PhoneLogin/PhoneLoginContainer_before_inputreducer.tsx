import { useMutation } from "@apollo/react-hooks";
import React, { useReducer } from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
// import {
//   startPhoneVerification,
//   startPhoneVerificationVariables
// } from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries";
// tslint:disable-next-line: comment-format
//input hooks에 대해서 생각해 볼 것

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value
  };
}

const PhoneLoginContainer: React.FC<RouteComponentProps> = ({ history }) => {
  const [state, dispatch] = useReducer(reducer, {
    countryCode: "+82",
    phoneNumber: ""
  });

  const { phoneNumber, countryCode } = state;

  const [PhoneSignMutation, { loading: mutationLoading }] = useMutation(
    PHONE_SIGN_IN,
    {
      onCompleted({ StartPhoneVerification }) {
        // console.log(mutationLoading);
        const { ok, error } = StartPhoneVerification;
        if (ok === false) {
          toast.success("SMS Sent! Redirecting you...");
          setTimeout(() => {
            history.push({
              pathname: "/verify-phone",
              state: {
                phoneNumber: `${countryCode}${phoneNumber}`
              }
            });
          }, 2000);

          toast.error(`${error}`);
        } else if (ok) {
          return;
        }
      },
      onError() {
        toast.error("server error, code : 404");
      }
    }
  );

  const onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = e => {
    dispatch(e.target);
  };

  // const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
  //   event.preventDefault();
  //   PhoneSignMutation({});

  //   toast.error("TESTING....SUBMIT...");
  // };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const isValid = /^\+[1-9]{1}[0-9]{7,12}$/.test(
      `${countryCode}${phoneNumber}`
    );
    if (isValid) {
      PhoneSignMutation({
        variables: { phoneNumber: `${countryCode}${phoneNumber}` }
      });
      return;
    } else {
      toast.error("Please write a valid phone number");
    }
  };

  return (
    <div>
      <PhoneLoginPresenter
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        loading={mutationLoading}
      />
    </div>
  );
};

export default PhoneLoginContainer;
