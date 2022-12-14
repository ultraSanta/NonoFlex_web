import { useState } from "react";
import PrimaryButton from "../../../components/common/button/PrimaryButton";
import TextField from "../../../components/login/TextField";
import RoundButton from "../../../components/common/button/RoundButton";

import { ToastContainer} from "react-toastify";
import "./Register.css"
import AuthenticationAPI from "../../../../apis/login/Authentication";
import NonoToast from "../../../components/common/toast/Toast.js";
import Utils from "../../../../features/utils/Utils.js";

const Register = (props) => {
    const [userName, setUserName] = useState("");
    const [isValidUserName, updateValidUserName] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [isValidUserEmail, updateValidUserEmail] = useState(true);
    const [enabledConfirm, updateEnabedConfirm] = useState(false);
    const [authorizationCode, setAuthorizationCode] = useState("");
    const [isValidAuthCode, updateValidAuthCode] = useState(true);
    const [isConfirmedAuthCode, updateConfirmAuthCode] = useState(false);
    const [password, setPassword] = useState("");
    const [isValidPassword, updateValidPassword] = useState(true);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isPasswordConfirm, updatePasswordConfirm] = useState(true);
    const [enableRequestRegister, updateEnableRegister] = useState(false);

    const regExpEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
    const regExpPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    const onChangeUserName = event => {
        console.log(event)
        setUserName(event);
        userNameValidation(event);
        checkRegisterValidation();
    }

    const userNameValidation = (event) => {
        const validUserName = event !== "";
        updateValidUserName(validUserName);
    }

    const onChangeUserEmail = event => {
        setUserEmail(event);
        userEmailValidation(event);
        updateEnabedConfirm(false);
        checkRegisterValidation();
    }

    const userEmailValidation = event => {
        var isValidUserEmail = regExpEmail.test(userEmail);
        if(event === "") {
            isValidUserEmail = false;
        }
        console.log(event + isValidUserEmail);
        updateValidUserEmail(isValidUserEmail);
    }

    const onClickCheckDuplication = async () => {
        const isValidUserEmail = regExpEmail.test(userEmail);
        if (!isValidUserEmail) {
            NonoToast.error("????????? ????????? ????????? ????????????.");
            updateValidUserEmail(isValidUserEmail);
            return;
        }

        updateValidUserEmail(true);
        //TODO: check duplication.
        const response = await AuthenticationAPI.checkDuplicateEmail(userEmail);
        if (response.isSuccess) {
            if (response.result.result) {
                const sendEmailResponse = await AuthenticationAPI.sendEmailAuthorization(userEmail, "JOIN");
                if (sendEmailResponse.isSuccess) {
                    if(sendEmailResponse.result.result) {
                        NonoToast.success("????????? ?????? ????????? ?????????????????????. \n???????????? ????????? ?????????.");
                        updateEnabedConfirm(true);
                    } else {
                        NonoToast.success("????????? ?????? ????????? ?????????????????????. \n????????? ?????? ????????? ?????????.");
                        updateEnabedConfirm(false);
                    }
                } else {
                    NonoToast.error(sendEmailResponse.result.message);
                    updateEnabedConfirm(false);
                }
            } else {
                NonoToast.error(response.result.message);
                updateEnabedConfirm(false);
            }
        } else {
            NonoToast.error(response.errorMessage);
            updateEnabedConfirm(false);
        }

        checkRegisterValidation();
    }

    const onChangeAuthorizationCode = event => {
        setAuthorizationCode(event);
        authorizationCodeValidation(event);
        checkRegisterValidation();
    }

    const authorizationCodeValidation = (event) => {
        const isValidAuthorizationCode = (event !== "");
        updateValidAuthCode(isValidAuthorizationCode);
    }

    const onClickConfirmAuthorization = async event => {
        const response = await AuthenticationAPI.verifyEmailAuthorization(userEmail, authorizationCode);
        if(response.isSuccess) {
            NonoToast.success("????????? ????????? ?????????????????????.")
            updateConfirmAuthCode(true)
        } else {
            NonoToast.error(response.errorMessage);
            updateConfirmAuthCode(false)
        }
    }

    const onChangePassword = event => {
        setPassword(event);
        passwordValidation(event);
        checkRegisterValidation();
    }

    const passwordValidation = (event) => {
        const isValidPassword = regExpPassword.test(event);
        updateValidPassword(isValidPassword);
        if (password === passwordConfirm) {
            updatePasswordConfirm(true);
        } else {
            updatePasswordConfirm(false);
        }
    }

    const onChanagePasswordConfirm = event => {
        setPasswordConfirm(event);
        if (event === password) {
            updatePasswordConfirm(true);
        } else {
            updatePasswordConfirm(false);
        }
        checkRegisterValidation();
    }

    const checkRegisterValidation = () => {
        const validation = (userName !== "") &&
            (regExpEmail.test(userEmail)) &&
            (authorizationCode !== "") &&
            (isConfirmedAuthCode) &&
            (regExpPassword.test(password));

            // password?????? ????????? click ?????? ??? ??????.
        updateEnableRegister(validation);
    }

    const onCLickedRegister = async () => {
        //TODO: Request Register
        const isConfirmedUserName = (userName !== "")
        if (!isConfirmedUserName) {
            NonoToast.error("????????? ????????? ???????????????.");
            updateValidUserName(false);
            return;
        }

        if(!regExpEmail.test(userEmail)) {
            NonoToast.error("????????? ????????? ???????????????.");
            updateValidUserEmail(false);
            updateConfirmAuthCode(false);
            return;
        }

        if(!isConfirmedAuthCode) {
            NonoToast.error("????????? ????????? ????????? ?????????.");
            updateValidAuthCode(false);
            return;
        }

        if(!regExpPassword.test(password)) {
            NonoToast.error("????????? ???????????? ????????? ????????????. \n???????????? ?????? 10?????? ?????? ????????? ?????????.");
            updateValidPassword(false);
            return;
        }

        if(!isPasswordConfirm) {
            NonoToast.error("?????? ????????? ??????????????? ????????????. \n????????? ??????????????? ?????? ????????? ?????????.")
            updatePasswordConfirm(false);
            return;
        }

        // ?????? ????????? ????????? ?????? -> ?????? ??????.
        const response = await AuthenticationAPI.regitser(userName, userEmail, password, authorizationCode);

        if(response.isSuccess) {
            NonoToast.success("?????? ????????? ?????????????????????. ????????? ???????????? ???????????????.");
            await Utils.timeout(2000); // 2?????????
            window.location.replace("/login");
        } else {
            NonoToast.error(response.errorMessage);
        }

    }

    return (
        <div className="register">
            <ToastContainer />
            <div className="registerBody">
                <div className="topSpace" />
                <h1 className="title">Register</h1>

                <ul className="bodyComponent">
                    <li>
                        <p className="componentTitle">??????</p>
                        <div className="textFieldBox">
                            <TextField
                                isValidData={isValidUserName}
                                type="text"
                                placeholder="User Name"
                                onChange={value => {
                                    onChangeUserName(value);
                                }} />
                        </div>
                    </li>
                    <li>
                        {
                            !isValidUserName ?
                                <p className="invalidDataInform">????????? ?????? ?????? ?????????.</p> : <p></p>
                        }
                    </li>
                    <li>
                        <p className="componentTitle">?????????</p>
                        <div className="emailTextFieldBox">
                            <TextField
                                isValidData={isValidUserEmail}
                                type="text"
                                placeholder="User E-mail"
                                readOnly={isConfirmedAuthCode}
                                onChange={value => {
                                    onChangeUserEmail(value);
                                }}  />
                        </div>
                        <div className="emailCheckButton">
                            <RoundButton value="?????? ??????"
                                onClick={onClickCheckDuplication} />
                        </div>
                    </li>
                    <li>
                        {
                            !isValidUserEmail ?
                                <p className="invalidDataInform">????????? ????????? ????????? ????????????.</p> : <p></p>
                        }
                    </li>
                    <li>
                        <p className="componentTitle">????????? ??????</p>
                        <div className="emailAuthTextFieldBox">
                            <TextField
                                isValidData={isValidAuthCode}
                                type="text"
                                placeholder="Authentication Code"
                                readOnly={isConfirmedAuthCode}
                                onChange={value => {
                                    onChangeAuthorizationCode(value);
                                }} />
                        </div>
                        <div className="emailAuthCheckButton">
                            <RoundButton value="?????? ??????"
                                disabled={!enabledConfirm}
                                onClick={onClickConfirmAuthorization} />
                        </div>
                    </li>
                    <li>
                        {
                            !isValidAuthCode ?
                                <p className="invalidDataInform">?????? ????????? ???????????????.</p> : <p></p>
                        }
                    </li>
                    <li>
                        <p className="componentTitle">????????????</p>
                        <div className="textFieldBox">
                            <TextField
                                isValidData={isValidPassword}
                                type="password"
                                placeholder="Enter Password"
                                onChange={value => {
                                    onChangePassword(value);
                                }} />
                        </div>
                    </li>
                    <li>
                        {
                            !isValidPassword ?
                                <p className="invalidDataInform">???????????? ?????? 8?????? ?????? ??????????????????.</p> : <p></p>
                        }
                    </li>
                    <li>
                        <p className="componentTitle">???????????? ??????</p>
                        <div className="textFieldBox">
                            <TextField
                                isValidData={isPasswordConfirm}
                                type="password"
                                placeholder="Re-Enter Password"
                                onChange={value => {
                                    onChanagePasswordConfirm(value);
                                }} />
                        </div>
                    </li>
                    <li>
                        {
                            !isPasswordConfirm ?
                                <span className="invalidDataInform">????????? ????????? ??????????????? ????????????.</span> : <p></p>
                        }
                    </li>
                    <li>
                        <div className="registerButton">
                            <PrimaryButton value="?????? ??????" disabled={!enableRequestRegister} onClick={onCLickedRegister} />
                        </div>
                    </li>
                </ul>
            </div>
        </div >
    );
}

export default Register;