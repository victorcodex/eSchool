import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

class Header extends Component {

    render() {
        return (
            <div>

                <div className="back-btn-container">
                    <NavLink to='/' className="back-btn"><span><i className='fa fa-long-arrow-left'></i> Back</span></NavLink>
                </div>

            </div>
        );
    }

}

export default  Header;