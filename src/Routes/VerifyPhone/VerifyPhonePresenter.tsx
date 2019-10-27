import React from "react";
import Helmet from "react-helmet";
import Button from "../../Components/Button";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import styled from "../../typed-components";

const Container = styled.div``;

const Form = styled.form`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface IProps {
  verifykey: string;
  loading: boolean;
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const VerifyPhonePresenter: React.SFC<IProps> = ({
  verifykey,
  loading,
  onInputChange,
  onSubmit
}) => (
  <Container>
    <Helmet>
      <title>Verify Phone | Number</title>
    </Helmet>
    <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
    <Form>
      <ExtendedInput
        placeholder={"Enter Verification Code"}
        value={verifykey}
        name={"verifykey"}
        onChange={onInputChange}
      />
      <Button
        disabled={loading}
        value={loading ? "Loading" : "Submit"}
        onClick={onSubmit}
      />
    </Form>
  </Container>
);

export default VerifyPhonePresenter;
