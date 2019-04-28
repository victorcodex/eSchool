import React, { Component } from 'react';
import PageHeader from '../../Layouts/SuperAdmin/_Header';
import PageFooter from '../../Layouts/SuperAdmin/_Footer';

import { Jumbotron } from 'react-bootstrap';

class SuperAdminHome extends Component {

    constructor(props) {
        super(props);

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

    }

    render() {

        return (
            <div>

                <div className="bg-mainpage container">

                    {/*import page header*/}
                        <PageHeader />
                    {/*import page header*/}

                    <div className="Jumbotron-Dashboard">
                        <Jumbotron>
                            <h1>Super Admin Dashboard!</h1>
                            <p>
                                You can add school, generate pins, etc.
                            </p>
                        </Jumbotron>
                    </div>


                    {/*import page footer*/}
                    <PageFooter />
                    {/*import page footer*/}

                </div>

            </div>
        );
    }

}

export default SuperAdminHome;
