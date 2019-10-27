import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "../../sharedQueries.local";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";

const SocialLoginContainer = () => {
  const clickFacebookLogin = response => {
    FacebookLoginMutation({
      variables: {
        email: response.email,
        fbId: response.id,
        firstName: response.first_name,
        lastName: response.last_name
      }
    });
  };

  const [FacebookLoginMutation, {}] = useMutation(FACEBOOK_CONNECT, {
    onCompleted({ FacebookConnect }) {
      console.log(FacebookConnect);
      const { ok, error } = FacebookConnect;
      if (ok === false) {
        toast.error(`${error}`);
      } else if (ok) {
        callLoggedin(FacebookConnect.token);
        return;
      }
    },
    onError() {
      toast.error("server error, code : 404");
    }
  });

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
      <SocialLoginPresenter clickFacebookLogin={clickFacebookLogin} />;
    </div>
  );
};

export default SocialLoginContainer;
