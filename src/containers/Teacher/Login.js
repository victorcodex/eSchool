import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import GeneralVariables from '../generalVariables';
import logo from '../../assets/img/logo.png' // logo
import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import Header from '../../Layouts/_Header';
import Footer from '../../Layouts/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import localforage from 'localforage';



class TeacherLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            animationLoader: false,
            isRedirect: false
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'teacher'); // check if User Token exist - redirects

        this.chechCurrentUserToken();

    }

    chechCurrentUserToken = () => {
        localforage.getItem('TeacherToken', (err, value) => {

            if(value) {
                this.setState({ isRedirect: true });
                // this.props.history.push('/SuperAdmin'); // redirect to Super Admin Dashboard
            } else {
                this.setState({ isRedirect: false });
            }

        })
    };

    processLogin = () => { // process login

        var payload = { // payload object
            email: this.state.email,
            password: this.state.password
        };

        // form validation

        if (payload.email === "") { // check email
            this.setState({ errorMessage: 'Email field is required' });
            this.email.focus();
            return false;
        }

        // if (!GeneralMethods.validateEmail(payload.email)) { // validate email
        //     this.setState({ errorMessage: 'Invalid Email Address' });
        //     this.email.focus();
        //     return false;
        // }

        if (payload.password === ""){ // check email
            this.setState({ errorMessage: 'Password field is required' });
            this.password.focus();
            return false;
        }

        // form validation

        this.setState({animationLoader: true}); // call loader animation

        fetch( GeneralApis.API_TEACHER_BASEURL + GeneralVariables.SCHOOL_ID, {  // HTTP POST REQUEST
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Kindly Contact the Admin or try again');
            }
        }).then((responseJson) => { // returned JSON

                if(responseJson) {

                    if(responseJson.status === 200) {

                        this.setState({animationLoader: false}); // call loader animation
                        this.setState({ errorMessage: responseJson.message });

                        localforage.setItem("TeacherToken", responseJson.token); // Store user Token

                        this.setState({ isRedirect: true });

                        // this.props.history.push('/Teacher'); // redirect to Teachers Dashboard

                    } else {
                        this.setState({animationLoader: false}); // call loader animation
                        this.setState({ errorMessage: responseJson.message });
                    }

                } else {
                    this.setState({animationLoader: false}); // call loader animation
                    this.setState({ errorMessage: 'Something went wrong. Kindly try again later' });
                }
        })
            .catch((error) => {

                this.setState({animationLoader: false}); // call loader animation
                this.setState({ errorMessage: 'Server ' + error });

            });


    };

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processLogin();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };


    render() {

        if(this.state.isRedirect) { // check login status
            return (
                <Redirect to="/Teacher" />
            );
        } else {
            // return (
            //     <Redirect to="/" />
            // );
        }


        if(this.state.animationLoader) { // loading animation
            return (
                <div>
                    <ProcessingAnimation/>
                </div>
            );
        }

        return(

            <div>

                <div className="bg">

                    <div className="loginColumns animated fadeInDown">
                        <div className="row">

                            <Header/>

                            <div className="col-md-6">
                                <img className="logo App" src={logo} alt="logo" />
                                <h2 className="font-bold">e-School System</h2>
                                <h4>Teachers Portal</h4>

                            </div>
                            <div className="col-md-6">
                                <div className="ibox-content">

                                    <p className="errorMessage">{this.state.errorMessage}</p>

                                    <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input autoFocus
                                                   ref={(input) => { this.email = input; }}
                                                   name="email"
                                                   type="text"
                                                   value={this.state.email}
                                                   onChange={this.handleInputChange}
                                                   placeholder="Email or Username or Phone number"
                                                   className="form-control"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input
                                                ref={(input) => { this.password = input; }}
                                                name="password"
                                                type="password"
                                                value={this.state.password}
                                                onChange={this.handleInputChange}
                                                placeholder="Password"
                                                className="form-control"
                                            />
                                        </div>
                                        <input type="submit" value="Login" className="btn btn-primary block full-width m-b" />

                                    </form>
                                </div>
                            </div>
                        </div>

                        <Footer/>

                    </div>

                </div>

            </div>
        );

    }

}

export default TeacherLogin;