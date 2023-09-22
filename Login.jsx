import { useRef, useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';

import { Link, Navigate } from 'react-router-dom';

import { useNavigate } from "react-router-dom";


import { useDispatch } from 'react-redux';
import openDb from '../../utilities/db';
import generateID from '../../utilities/generateID';
import generateDeriveKeyPair from '../../utilities/generateDeriveKeyPair';
import generateSigningKeyPair from '../../utilities/generateSigningKeyPair';
import wrapKeyWithPassword from '../../utilities/wrapKeyWithPassword';
import wrapKeyWithKey from '../../utilities/wrapKeyWithKey';
import wrapKeyWithKWKey from '../../utilities/wrapKeyWithKWKey';
import deriveCBCSharedKey from '../../utilities/deriveCBCSharedKey';
import deriveKWSharedKey from '../../utilities/deriveKWSharedKey';
import generateWrapUnwrapKey from '../../utilities/generateWrapUnwrapKey';
import convertIdTo16ByteArray from '../../utilities/convertIdTo16ByteArray';
import exportDSAPub from '../../utilities/exportDSAPub';
import convertArrayBufferToBase64 from '../../utilities/convertArrayBufferToBase64';
import exportDHPub from '../../utilities/exportDHPub';
import generateSignature from '../../utilities/generateSignature';
import generateRegisterOrgRequest from '../../utilities/generateRegisterOrgRequest';
import generateTimestamp from '../../utilities/generateTimestamp';
import encryptString from '../../utilities/encryptString';
import getLoginVariablesFromDb from '../../utilities/getLoginVariablesFromDb';
import login from '../../utilities/login';
import { loginUser } from '../../redux/actionCreators/authActionCreator';


function Login() {

    // regex pattern one lowercase letter or uppercase letter followed by 3 to 23 lowercase/uppercase letters or numbers and underscore characters
    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,48}$/;
    const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

    // regex pattern one lowercase letter or uppercase letter followed by 2 to 63 characters
    // \w allows uppercase or lowercase letters, numbers or underscores, . allows ., \-#& allows -#& \s allows whitespace
    const ORG_REGEX = /^[a-zA-Z][\w.\-#&\s]{2,63}$/;

    // regex pattern one lowercase letter one uppercase letter one number and one special character minimum, needs 8 to 24 characters total
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const LOGIN_URL = "/api/Account/Login";

  /*  const db = useRef();*/
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orgRef = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    //const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        emailRef.current.focus();
        // create/open database
        /*db.current = openDb();*/
    }, []);

    // test pwd against regex
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
    }, [password]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        setErrMsg("");
    }, [password, email]);


    async function handleSubmit(e) {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(password);

        if (!v1 || !v2 ) {
            setErrMsg("Invalid Entry");
            return
        }

        let ChainID = generateID();
        let TransactionID = generateID();

        // constants for indexDB
        const DB_NAME = "endocloudDb";
        const DB_VERSION = 1;
        const DB_STORE_NAME = "keyStore";

        let request = await login(email, password, ChainID, TransactionID);
        console.log("request: ", request);

        // send request to server to register org
        const response = await axios.post(
            LOGIN_URL, request, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("response: ", response);
        console.log("response.data: ", response.data);
        console.log("response.data.UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv: ", response.data.UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv);
            setSuccess(true);
            if (response.status === 200) {
                dispatch(loginUser({
                    UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv: response.data.UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv,
                    bID: response.data.BlockchainID,
                }))
            }
    }

    return (
        <>
            {success ? (
                <section className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-6 justify-center items-center">
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Success!</h2>
                        <Link to="/home">
                            <span className="flex min-w-1/2 justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Home
                            </span>
                        </Link>
                    </div>
                </section>
            ) : (
                <section className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Login</h2>
                    </div>
                    <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-4 org-form" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                        <span className={validEmail ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validEmail || !email ? "hide" : "invalid"}>
                                            {/*<FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            ref={emailRef}
                                            autoComplete="off"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="eidnote"
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            A valid email address <br />
                                            in the format of name @ domain is required <br />
                                            e.g. info@sealstone.com
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                        {/*<FaCheck className={validPwd ? "valid" : "hide"} />*/}
                                        {/*<FaTimes className={validPwd || !password ? "hide" : "invalid"} />*/}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            aria-invalid={validPwd ? "false" : "true"}
                                            aria-describedby="pwdnote"
                                            onFocus={() => setPwdFocus(true)}
                                            onBlur={() => setPwdFocus(false)}
                                            autoComplete="new-password"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            8 to 24 characters.
                                            <br />
                                            Must include uppercase and lowercase letters, a number and a special character.
                                            <br />
                                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span>
                                            <span aria-label="percent">%</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={ !validEmail || !validPwd ? true : false}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-gray-700"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default Login;
