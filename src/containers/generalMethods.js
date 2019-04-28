import localforage from "localforage";
import GeneralVariables from './generalVariables';

class GeneralMethods {

        LoadingAnimation = () => { // loading animation

                    // return (
                    //     <div className="loginColumns animated fadeInDown">
                    //     <div className="row">
                    //
                    //         <div className="sk-fading-circle">
                    //             <div className="sk-circle1 sk-circle"></div>
                    //             <div className="sk-circle2 sk-circle"></div>
                    //             <div className="sk-circle3 sk-circle"></div>
                    //             <div className="sk-circle4 sk-circle"></div>
                    //             <div className="sk-circle5 sk-circle"></div>
                    //             <div className="sk-circle6 sk-circle"></div>
                    //             <div className="sk-circle7 sk-circle"></div>
                    //             <div className="sk-circle8 sk-circle"></div>
                    //             <div className="sk-circle9 sk-circle"></div>
                    //             <div className="sk-circle10 sk-circle"></div>
                    //             <div className="sk-circle11 sk-circle"></div>
                    //             <div className="sk-circle12 sk-circle"></div>
                    //         </div>
                    //
                    //     </div>
                    // </div>
                    // );

        }

        logOut = (props, usertype) => {

        }

        chechCurrentUserToken = (props, usertype) => { // check if User Token exist

            // usertypes => superadmin, schooladmin and teacher

            if(usertype === 'superadmin') {

                localforage.getItem('SuperAdminToken', function(err, data) { // get Super Admin Token
                    if(data) {

                        // return props.history.push('/SuperAdmin');  // redirect to Super Admin dashboard

                    } else {

                        // return props.history.push('/SuperAdmin/Login');  // redirect to Super Admin login

                    }

                });

            } else if(usertype === 'schooladmin'){

                localforage.getItem('SchoolAdminToken', function(err, data) { // School Admin Token
                    if(data) {

                        // return props.history.push('/SchoolAdmin');  // redirect to School Admin dashboard

                    } else {

                        // return props.history.push('/SchoolAdmin/Login/' + GeneralVariables.SCHOOL_ID);  // redirect to School Admin login

                    }

                });

            } else if(usertype === 'teacher') {

                localforage.getItem('TeacherToken', function(err, data) { // get Teacher Token
                    if(data) {

                        // return props.history.push('/Teacher');  // redirect to Teacher dashboard

                    } else {

                        // return props.history.push('/Teacher/Login/' + GeneralVariables.SCHOOL_ID);  // redirect to Teacher login

                    }

                });

            }
        }


        validateEmail = (email) => { // email validation reg-exp
            var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regexp.test(email);
        }



}

export default (new GeneralMethods);