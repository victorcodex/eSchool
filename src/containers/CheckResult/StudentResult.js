import React, { Component } from 'react';
import { Route, NavLink, HashRouter } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import logo from '../../assets/img/logo.png'; // logo
import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import localforage from 'localforage';

class StudentResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'schooladmin'); // check if User Token exist - redirects
    }

    render() {
        return (
            <div>

                <h4>Result Checking Home Page</h4>

            </div>
        );
    }

}

export default  StudentResult;