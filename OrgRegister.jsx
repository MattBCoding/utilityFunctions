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


// regex pattern one lowercase letter or uppercase letter followed by 3 to 23 lowercase/uppercase letters or numbers and underscore characters
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,48}$/;
const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

// regex pattern one lowercase letter or uppercase letter followed by 2 to 63 characters
// \w allows uppercase or lowercase letters, numbers or underscores, . allows ., \-#& allows -#& \s allows whitespace
const ORG_REGEX = /^[a-zA-Z][\w.\-#&\s]{2,63}$/;

// regex pattern one lowercase letter one uppercase letter one number and one special character minimum, needs 8 to 24 characters total
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const REGISTER_URL = "/api/Register/RegisterOrg";

function OrgRegister() {
    const db = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orgRef = useRef();
    const blockRef = useRef();
    const deviceRef = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const firstRef = useRef();
    const lastRef = useRef();

    const [firstName, setFirstName] = useState("");
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState("");
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [blockchainName, setBlockchainName] = useState("");
    const [validBlockchainName, setValidBlockchainName] = useState(false);
    const [blockchainNameFocus, setBlockchainNameFocus] = useState(false);

    const [deviceName, setDeviceName] = useState("");
    const [validDeviceName, setValidDeviceName] = useState(false);
    const [deviceNameFocus, setDeviceNameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [orgName, setOrgName] = useState("");
    const [validOrg, setValidOrg] = useState(false);
    const [orgFocus, setOrgFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    //const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        orgRef.current.focus();
        // create/open database
        db.current = openDb();
    }, []);

    useEffect(() => {
        const result = ORG_REGEX.test(orgName);
        setValidOrg(result);
    }, [orgName]);

    // test blockchain name against regex
    useEffect(() => {
        const result = NAME_REGEX.test(blockchainName);
        setValidBlockchainName(result);
    }, [blockchainName]);

    // test device name against regex
    useEffect(() => {
        const result = NAME_REGEX.test(deviceName);
        setValidDeviceName(result);
    }, [deviceName]);

    // test first name against regex
    useEffect(() => {
        const result = NAME_REGEX.test(firstName);
        setValidFirstName(result);
    }, [firstName]);

    // test last name against regex
    useEffect(() => {
        const result = NAME_REGEX.test(lastName);
        setValidLastName(result);
    }, [lastName]);

    // test pwd against regex
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        setErrMsg("");
    }, [blockchainName, deviceName, orgName, firstName, lastName, password, matchPwd, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = ORG_REGEX.test(orgName);
        const v2 = NAME_REGEX.test(blockchainName);
        const v3 = NAME_REGEX.test(deviceName);
        const v4 = EMAIL_REGEX.test(email);
        const v5 = PWD_REGEX.test(password);
        const v6 = NAME_REGEX.test(firstName);
        const v7 = NAME_REGEX.test(lastName);

        if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7) {
            setErrMsg("Invalid Entry");
            return
        }

        const Code = "12345";
        let OrgID = generateID(); // change function to generateID
        let ChainID = generateID();
        let UsersID = generateID();
        let UserID = generateID();
        let DeviceID = generateID();
        let TransactionID = generateID();
        let OrgName = orgName;

        // create user name string
        let user = `${email},${firstName},${lastName}`
        console.log(user);

        try {
            // IV for wrapping userDHPriv is userID + deviceID
            let deviceIdIV = convertIdTo16ByteArray(DeviceID);

            //generation of signing key pair
            let deviceDSAKeyPair = await generateSigningKeyPair();
            let deviceDHKeyPair = await generateDeriveKeyPair();
            let userDHKeyPair = await generateDeriveKeyPair();

            // generation of encryption keys
            let orgAESKey = await generateWrapUnwrapKey();
            let deviceAESKey = await generateWrapUnwrapKey();
            let usersAESKey = await generateWrapUnwrapKey();
            let userAESKey = await generateWrapUnwrapKey();
            let blockchainAESKey = await generateWrapUnwrapKey();

            // extract public keys
            let deviceDSAPubAB = await exportDSAPub(deviceDSAKeyPair.publicKey);
            let deviceDHPubAB = await exportDHPub(deviceDHKeyPair.publicKey);
            let userDHPubAB = await exportDHPub(userDHKeyPair.publicKey);

            // encrypt data
            let ChainName = await encryptString(blockchainName, orgAESKey, ChainID);
            let UsersName = await encryptString("USERS", blockchainAESKey, UsersID);
            let DeviceName = await encryptString(deviceName, userAESKey, DeviceID);
            let combinedUserName = await encryptString(user, usersAESKey, UserID);

            // console.log the encrypted data
            console.log("ChainName: ", ChainName);
            console.log("UsersName: ", UsersName);
            console.log("DeviceName: ", DeviceName);
            console.log("UserName: ", combinedUserName);

            // wrap keys
            // derive a CBC shared key to wrap a private key with
            let userDHPrivEncDeviceDHPubWrapKey = await deriveCBCSharedKey(userDHKeyPair.privateKey, deviceDHKeyPair.publicKey);
            let userDhPrivWrapByDeriveDeviceDhPubUserDhPriv = await wrapKeyWithKey(userDHKeyPair.privateKey, userDHPrivEncDeviceDHPubWrapKey, deviceIdIV);
            // derive a KW key to wrap an AES key with
            let userDHPubEncDeviceDHPrivWrapKey = await deriveKWSharedKey(deviceDHKeyPair.privateKey, userDHKeyPair.publicKey);
            let orgNodeAesWrapByDeriveUserDhPubDeviceDhPriv = await wrapKeyWithKWKey(orgAESKey, userDHPubEncDeviceDHPrivWrapKey);
            // wrap AES key with another AES key
            let chainNodeAesWrapByOrgNodeAes = await wrapKeyWithKWKey(blockchainAESKey, orgAESKey);
            let usersNodeAesWrapByChainNodeAes = await wrapKeyWithKWKey(usersAESKey, blockchainAESKey);
            let userNodeAesWrapByUsersNodeAes = await wrapKeyWithKWKey(userAESKey, usersAESKey);
            let deviceNodeAesWrapByUserNodeAes = await wrapKeyWithKWKey(deviceAESKey, userAESKey);

            // wrap keys with password
            let salt = window.crypto.getRandomValues(new Uint8Array(16));
            // generate iv for wrapping deviceDSAPriv
            let userIdIV = convertIdTo16ByteArray(UserID);
            let wrappedDeviceDSAPriv = await wrapKeyWithPassword(password, deviceDSAKeyPair.privateKey, salt, userIdIV);
            let wrappedDeviceDHPriv = await wrapKeyWithPassword(password, deviceDHKeyPair.privateKey, salt, userIdIV);

            // constants for indexDB
            const DB_NAME = "endocloudDb";
            const DB_VERSION = 1;
            const DB_STORE_NAME = "keyStore";

            // check worker available

            if (window.Worker) {
                const myWorker = new Worker(new URL("../../utilities/workerAddToIndexDb.js", import.meta.url));
                // message to worker format
                // [ DB_NAME, DB_VERSION, DB_STORE_NAME, {email: email, }]
                myWorker.postMessage([
                    DB_NAME,
                    DB_VERSION,
                    DB_STORE_NAME,
                    {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        wrappedDeviceDSAPriv: wrappedDeviceDSAPriv,
                        wrappedDeviceDHPriv: wrappedDeviceDHPriv,
                        salt: salt,
                        deviceId: DeviceID,
                        userId: UserID,
                    },
                ]);
            }

            let DeviceDsaPub = await convertArrayBufferToBase64(deviceDSAPubAB);
            let DeviceDhPub = await convertArrayBufferToBase64(deviceDHPubAB);
            let UserDhPub = await convertArrayBufferToBase64(userDHPubAB);
            let UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv = await convertArrayBufferToBase64(userDhPrivWrapByDeriveDeviceDhPubUserDhPriv);
            let OrgNodeAesWrapByDeriveUserDhPubDeviceDhPriv = await convertArrayBufferToBase64(orgNodeAesWrapByDeriveUserDhPubDeviceDhPriv);
            let ChainNodeAesWrapByOrgNodeAes = await convertArrayBufferToBase64(chainNodeAesWrapByOrgNodeAes);
            let UsersNodeAesWrapByChainNodeAes = await convertArrayBufferToBase64(usersNodeAesWrapByChainNodeAes);
            let UserNodeAesWrapByUsersNodeAes = await convertArrayBufferToBase64(userNodeAesWrapByUsersNodeAes);
            let DeviceNodeAesWrapByUserNodeAes = await convertArrayBufferToBase64(deviceNodeAesWrapByUserNodeAes);

            // Build request structure
            let TYP = "RegisterOrg";
            let unsignedTransaction = {
                "bID": ChainID,
                "dID": DeviceID,
                "tID": TransactionID,
                "TS": generateTimestamp(),
                "RT": true,
                "REQ": [
                    {
                        "Code": Code,
                        "OrgID": OrgID,
                        "ChainID": ChainID,
                        "UsersID": UsersID,
                        "UserID": UserID,
                        "DeviceID": DeviceID,
                        "OrgName": OrgName,
                        "ChainName": ChainName,
                        "UsersName": UsersName,
                        "UserName": combinedUserName,
                        "DeviceName": DeviceName,
                        "DeviceDsaPub": DeviceDsaPub,
                        "DeviceDhPub": DeviceDhPub,
                        "UserDhPub": UserDhPub,
                        "UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv": UserDhPrivWrapByDeriveDeviceDhPubUserDhPriv,
                        "OrgNodeAesWrapByDeriveUserDhPubDeviceDhPriv": OrgNodeAesWrapByDeriveUserDhPubDeviceDhPriv,
                        "ChainNodeAesWrapByOrgNodeAes": ChainNodeAesWrapByOrgNodeAes,
                        "UsersNodeAesWrapByChainNodeAes": UsersNodeAesWrapByChainNodeAes,
                        "UserNodeAesWrapByUsersNodeAes": UserNodeAesWrapByUsersNodeAes,
                        "DeviceNodeAesWrapByUserNodeAes": DeviceNodeAesWrapByUserNodeAes,
                        "TYP": TYP,
                    }
                ],
            }
            // convert javascript object to JSON object
            let unsignedTransactionJSON = await JSON.stringify(unsignedTransaction);

            // convert unsigned transaction to array buffer
            let unsignedTransactionAB = new TextEncoder().encode(unsignedTransactionJSON);

            // sign transaction
            let signature = await generateSignature(unsignedTransactionAB, deviceDSAKeyPair.privateKey);
            let unsignedTransactionBase64 = await convertArrayBufferToBase64(unsignedTransactionAB);
            let request = await generateRegisterOrgRequest(unsignedTransactionBase64, signature);

            // test of signature timing
            console.log("transaction bytes: ", unsignedTransactionAB.byteLength);
            let start = performance.now();
            let storageArray = [];
            for (let i = 0; i < 1000; i++) {
                await generateSignature(unsignedTransactionAB, deviceDSAKeyPair.privateKey);
            }
            let end = performance.now();
            let timeTaken = end - start;
            console.log("signing took " + timeTaken + " milliseconds");
            console.log("average of " + timeTaken / 1000 + " milliseconds per signature");
            


            // send request to server to register org
            //const response = await axios.post(
            //    REGISTER_URL, request, {
            //    headers: { "Content-Type": "application/json" },
            //});

            setSuccess(true);
            //if (response.status === 200) {
            //    dispatch(loginUser({
            //        UserID: response.data.UserID,
            //        user: response.data.userName,
            //        firstName: response.data.firstName,
            //        lastName: response.data.lastName,
            //        token: response.data.token,
            //        refreshToken: response.data.refreshToken,
            //        OrgID: response.data.OrgID,
            //        orgName: response.data.orgName,
            //        ChainID: response.data.ChainID,
            //    }))
            //}
        } catch (error) {
            if (!error?.response) {
                setErrMsg("No server response");
            } else if (error.response?.status === 409) {
                setErrMsg("Server indicates organisation or username is already taken");
            } else {
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
            console.error("ERROR: ", error);
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
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register your organisation.</h2>
                    </div>
                    <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-4 org-form" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="org-name" className="block text-sm font-medium text-gray-700">
                                        Organisation Name
                                        <span className={validOrg ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validOrg || !orgName ? "hide" : "invalid"}>
                                            {/* <FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="org-name"
                                            name="org-name"
                                            type="text"
                                            ref={orgRef}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            required
                                            aria-invalid={validOrg ? "false" : "true"}
                                            aria-describedby="oidnote"
                                            onFocus={() => setOrgFocus(true)}
                                            onBlur={() => setOrgFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="oidnote" className={orgFocus && orgName && !validOrg ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            A valid organisation name is required <br />
                                            e.g. Sealstone Ltd
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="blockchain-name" className="block text-sm font-medium text-gray-700">
                                        Blockchain Name
                                        <span className={validBlockchainName ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validBlockchainName || !blockchainName ? "hide" : "invalid"}>
                                            {/*<FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="blockchain-name"
                                            name="blockchain-name"
                                            type="text"
                                            ref={blockRef}
                                            onChange={(e) => setBlockchainName(e.target.value)}
                                            required
                                            aria-invalid={validBlockchainName ? "false" : "true"}
                                            aria-describedby="fidnote"
                                            onFocus={() => setBlockchainNameFocus(true)}
                                            onBlur={() => setBlockchainNameFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="fidnote" className={blockchainNameFocus && blockchainName && !validBlockchainName ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            4 to 24 characters. <br />
                                            Must begin with a letter. <br />
                                            Letters, numbers, underscors, hypens allowed.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="device-name" className="block text-sm font-medium text-gray-700">
                                        Device Name
                                        <span className={validDeviceName ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validDeviceName || !deviceName ? "hide" : "invalid"}>
                                            {/*<FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="device-name"
                                            name="device-name"
                                            type="text"
                                            ref={deviceRef}
                                            onChange={(e) => setDeviceName(e.target.value)}
                                            required
                                            aria-invalid={validDeviceName ? "false" : "true"}
                                            aria-describedby="lidnote"
                                            onFocus={() => setDeviceNameFocus(true)}
                                            onBlur={() => setDeviceNameFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="lidnote" className={deviceNameFocus && deviceName && !validDeviceName ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            4 to 24 characters. <br />
                                            Must begin with a letter. <br />
                                            Letters, numbers, underscors, hypens allowed.
                                        </p>
                                    </div>
                                </div>
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
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        First Name
                                        <span className={validFirstName ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validFirstName || !firstName ? "hide" : "invalid"}>
                                            {/*<FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            ref={firstRef}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            aria-invalid={validFirstName ? "false" : "true"}
                                            aria-describedby="fidnote"
                                            onFocus={() => setFirstNameFocus(true)}
                                            onBlur={() => setFirstNameFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="fidnote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            4 to 24 characters. <br />
                                            Must begin with a letter. <br />
                                            Letters, numbers, underscores, hypens allowed.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                        <span className={validLastName ? "valid" : "hide"}>
                                            {/*<FaCheck />*/}
                                        </span>
                                        <span className={validLastName || !lastName ? "hide" : "invalid"}>
                                            {/*<FaTimes />*/}
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            ref={lastRef}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            aria-invalid={validLastName ? "false" : "true"}
                                            aria-describedby="lidnote"
                                            onFocus={() => setLastNameFocus(true)}
                                            onBlur={() => setLastNameFocus(false)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="lidnote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            4 to 24 characters. <br />
                                            Must begin with a letter. <br />
                                            Letters, numbers, underscores, hypens allowed.
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
                                    <label htmlFor="confirm_pwd" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                        {/*<FaCheck className={validMatch && matchPwd ? "valid" : "hide"} />*/}
                                        {/*<FaTimes className={validMatch || !matchPwd ? "hide" : "invalid"} />*/}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirm_pwd"
                                            name="confirm_pwd"
                                            type="password"
                                            onChange={(e) => setMatchPwd(e.target.value)}
                                            value={matchPwd}
                                            required
                                            aria-invalid={validMatch ? "false" : "true"}
                                            aria-describedby="confirmnote"
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)}
                                            autoComplete="new-password"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                            {/*<FaInfoCircle />*/}
                                            Must match the first password input field.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={!validOrg || !validEmail || !validPwd || !validMatch || !validFirstName || !validLastName ? true : false}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-gray-700"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}


export default OrgRegister;