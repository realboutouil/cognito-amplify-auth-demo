import React, {useEffect, useReducer, useState} from "react";
import {Auth, Hub} from "aws-amplify";
import {FaSignOutAlt} from "react-icons/fa";
import Header from "./Header";
import Buttons from "./Buttons";
import Form from "./Form";
import "./App.css";

const initialUserState = {user: null, loading: true};

function App() {

    const [session, setSession] = useState(null);
    const [userState, dispatch] = useReducer(reducer, initialUserState);
    const [formState, updateFormState] = useState("base");

    useEffect(() => {
        // set listener for auth events
        Hub.listen("auth", (data) => {
            const {payload} = data;
            if (payload.event === "signIn") {
                dispatch({type: "setUser", user: payload.data})
                setImmediate(() => dispatch({type: 'setUser', user: payload.data}));
                setImmediate(() => window.history.pushState({}, null, process.env.REACT_APP_WEB_CLIENT_REDIRECT_URL));
                updateFormState("base");
            }
            // this listener is needed for form sign ups since the OAuth will redirect & reload
            if (payload.event === "signOut") {
                setTimeout(() => dispatch({type: "setUser", user: null}), 350);
            }
        });
        // we check for the current user unless there is a redirect to ?signedIn=true
        if (!window.location.search.includes("?signedin=true")) {
            checkUser(dispatch);
        }
        // Refresh session when component mounts
        refreshSession();
    }, []);

    async function refreshSession() {
        try {
            const session = await Auth.currentSession();
            const idTokenExpire = session.getIdToken().getExpiration();
            const refreshToken = session.getRefreshToken();
            const currentTimeSeconds = Math.round(+new Date() / 1000);
            if (idTokenExpire < currentTimeSeconds) {
                const user = await Auth.currentAuthenticatedUser();
                user.refreshSession(refreshToken, (err, session) => {
                    if (err) {
                        console.log(err);
                        if (err === 'Token expired') {
                            Auth.signOut();
                        }
                    } else {
                        console.log('Session refreshed with ID token: ', session.getIdToken());
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // This renders the custom form
    if (formState === "email") {
        return (
            <div style={styles.appContainer}>
                <Header updateFormState={updateFormState}/>
                <Form/>
            </div>
        );
    }

    async function checkUser(dispatch) {
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log("User: ", user);
            setSession(user.storage);
            dispatch({type: "setUser", user});
        } catch (err) {
            console.log("err: ", err);
            dispatch({type: "loaded"});
        }
    }

    return (
        <div style={styles.appContainer}>
            <Header updateFormState={updateFormState}/>
            {userState.loading && (
                <div style={styles.body}>
                    <p>Loading...</p>
                </div>
            )}
            {!userState.user && !userState.loading && (
                <Buttons updateFormState={updateFormState}/>
            )}
            {userState.user && userState.user.signInUserSession && (
                <div style={styles.body}>
                    <h4>
                        Welcome {userState.user.signInUserSession.idToken.payload.email}
                    </h4>
                    <div>
                        <h5>
                            Access Token:
                        </h5>
                        <code>
                            {userState.user.signInUserSession.accessToken.jwtToken}
                        </code>
                    </div>
                    <div>
                        <h5>
                            Refresh Token:
                        </h5>
                        <code>
                            {userState.user.signInUserSession.refreshToken.token}
                        </code>
                    </div>
                    <button
                        style={{...styles.button, ...styles.signOut}}
                        onClick={signOut}
                    >
                        <FaSignOutAlt color="white"/>
                        <p style={{...styles.text}}>Sign Out</p>
                    </button>
                </div>
            )}
            <Footer/>
        </div>
    );
}

function reducer(state, action) {
    switch (action.type) {
        case "setUser":
            return {...state, user: action.user, loading: false};
        case "loaded":
            return {...state, loading: false};
        default:
            return state;
    }
}

function signOut() {
    Auth.signOut()
        .then((data) => {
            console.log("signed out: ", data);
        })
        .catch((err) => console.log(err));
}

function Footer() {
    return (
        <div>
            <p style={styles.footer}>
                To view the code for this app, click{" "}
                <a
                    href="https://github.com/mohammedamineboutouil/cognito-amplify-auth-demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.anchor}
                >
                    here
                </a>
                . To learn more about AWS Amplify, click{" "}
                <a
                    href="https://aws-amplify.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.anchor}
                >
                    here.
                </a>
            </p>
        </div>
    );
}

const styles = {
    appContainer: {
        paddingTop: 85,
    },
    loading: {},
    button: {
        marginTop: 15,
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
    text: {
        color: "white",
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "bold",
    },
    signOut: {
        backgroundColor: "black",
    },
    footer: {
        fontWeight: "600",
        padding: "0px 25px",
        textAlign: "right",
        color: "rgba(0, 0, 0, 0.6)",
    },
    anchor: {
        color: "rgb(255, 153, 0)",
        textDecoration: "none",
    },
    body: {
        padding: "0px 30px",
        height: "78vh",
    },
};

export default App;
