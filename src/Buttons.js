import React from "react";
import {Auth} from "aws-amplify";
import {FcGoogle} from "react-icons/fc";
import {FaEnvelope} from "react-icons/fa";
import {CgFacebook} from "react-icons/cg";
import {IoLogoAmplify} from "react-icons/io5";
import {SiOkta} from "react-icons/si";
import "./App.css";

function Buttons(props) {
    return (
        <div>
            <div style={styles.container}>
                <button
                    style={{...styles.button, ...styles.facebook}}
                    onClick={() => Auth.federatedSignIn({provider: "Okta"})}
                >
                    <SiOkta color="#3C5997" size="1.8em" style={{...styles.social_logo}}/>
                    <p style={styles.text}>Sign in with Okta</p>
                </button>
                <button
                    style={{...styles.button, ...styles.facebook}}
                    onClick={() => Auth.federatedSignIn({provider: "Facebook"})}
                >
                    <CgFacebook color="#3C5997" size="1.8em" style={{...styles.social_logo}}/>
                    <p style={styles.text}>Sign in with Facebook</p>
                </button>
                <button
                    style={{...styles.button, ...styles.google}}
                    onClick={() => Auth.federatedSignIn({provider: "Google"})}
                >
                    <FcGoogle size="1.8em" style={{...styles.social_logo}}/>
                    <p style={{...styles.text}}>
                        Sign in with Google
                    </p>
                </button>
                <button
                    style={{...styles.button, ...styles.hostedUI}}
                    onClick={() => Auth.federatedSignIn()}
                >
                    <IoLogoAmplify color="orange" size="1.8em" style={{...styles.social_logo}}/>
                    <p style={{...styles.text}}>
                        Sign in with Hosted UI
                    </p>
                </button>
                <button
                    style={{...styles.button, ...styles.email}}
                    onClick={() => props.updateFormState("email")}
                >
                    <FaEnvelope color="white" size="1.8em" style={{...styles.social_logo1}}/>
                    <p style={{...styles.text}}>Sign in with Email</p>
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "80vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    button: {
        width: "100%",
        maxWidth: 250,
        marginBottom: 10,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "0px 16px",
        borderRadius: 2,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, .3)",
        cursor: "pointer",
        outline: "none",
        border: "none",
        minHeight: 40,
    },
    facebook: {
        backgroundColor: "#3b5998",
    },
    google: {
        backgroundColor: "#4285F4",
    },
    social_logo: {
        backgroundColor: "#FFF",
        borderRadius: "2px",
        display: "inline-block",
        marginRight: "12px",
        padding: "4px",
        textAlign: "center",
        verticalAlign: "middle"
    },
    social_logo1: {
        borderRadius: "2px",
        display: "inline-block",
        marginRight: "12px",
        padding: "4px",
        textAlign: "center",
        verticalAlign: "middle"
    },

    email: {
        backgroundColor: "#db4437",
    },
    checkAuth: {
        backgroundColor: "#02bd7e",
    },
    hostedUI: {
        backgroundColor: "rgba(0, 0, 0, .6)",
    },
    signOut: {
        backgroundColor: "black",
    },
    withAuthenticator: {
        backgroundColor: "#FF9900",
    },
    icon: {
        height: 16,
        marginLeft: -1,
    },
    text: {
        color: "white",
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "bold",
    },
    blackText: {
        color: "black",
    },
    grayText: {
        color: "rgba(0, 0, 0, .75)",
    },
    orangeText: {
        color: "#FF9900",
    },
};

export default Buttons;
