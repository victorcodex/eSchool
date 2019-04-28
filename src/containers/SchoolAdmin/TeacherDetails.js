import React, { Component } from 'react';
import { Route, NavLink, HashRouter } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import logo from '../../assets/img/logo.png' // logo
import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import localforage from 'localforage';

class TeacherDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        };

        GeneralMethods.chechCurrentUserToken(this.props, 'schooladmin'); // check if User Token exist - redirects

    }

    render() {

        return (
            <div className="bg-mainpage">

                <div className="loginColumns animated fadeInDown">
                    <div className="row">

                        <div className="col-md-6">

                            <img className="logo App" src={logo} alt="logo"/>
                            <h2 className="font-bold">e-School System</h2>
                            <h4>School Admin - Teachers Details</h4>

                        </div>

                    </div>
                </div>

            </div>

        );
    }
}

export default TeacherDetails;