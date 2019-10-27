import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "../../sharedQueries.local";
import useInputs from "../../utill/useInputs";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";

const VerifyPhoneContainer: React.FC<RouteComponentProps> = props => {
  if (!props.location.state) {
    toast.error("잘못된 접근입니다.");
    props.history.push("/");
  }
  const [state, onChange] = useInputs({
    verifykey: ""
  });

  const { verifykey } = state;

  const [VerifyPhoneMutation, { loading: mutationLoading }] = useMutation(
    VERIFY_PHONE,
    {
      onCompleted({ CompletePhoneVerification }) {
        const { ok, error } = CompletePhoneVerification;
        if (ok === false) {
          toast.error(`${error}`);
        } else if (ok) {
          // console.log(CompletePhoneVerification);
          callLoggedin(CompletePhoneVerification.token);
          return;
        }
      }
    }
  );

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    VerifyPhoneMutation({
      variables: {
        key: `${verifykey}`,
        phoneNumber: props.location.state.phoneNumber
      }
    });
  };

  const [LoggedInMutation, {}] = useMutation(LOG_USER_IN, {
    onCompleted() {
      toast.success("You are verified, logged in now");
    }
  });

  const callLoggedin = token => {
    LoggedInMutation({
      variables: { token }
    });
  };

  return (
    <div>
      <VerifyPhonePresenter
        onInputChange={onChange}
        onSubmit={onSubmit}
        verifykey={verifykey}
        loading={mutationLoading}
      />
    </div>
  );
};

export default VerifyPhoneContainer;
