import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

// General HomePage
import MainHome from './Home';

// SchoolAdmin Routes
import SchoolAdminHome from './containers/SchoolAdmin/Home';
import SchoolAdminLogin from './containers/SchoolAdmin/Login';
import AddaSubject from './containers/SchoolAdmin/AddaSubject';
import AddaTeacher from './containers/SchoolAdmin/AddaTeacher';
import UploadTeachers from './containers/SchoolAdmin/UploadTeachers';
import AddStudentsRecord from './containers/SchoolAdmin/AddStudentsRecord';
import ListofSubjectsSchoolAdmin from './containers/SchoolAdmin/ListofSubjects';
import ListOfTeachers from './containers/SchoolAdmin/ListOfTeachers';
import ListofStudents from './containers/SchoolAdmin/ListofStudents';
import SubjectDetails from './containers/SchoolAdmin/SubjectDetails';
import TeacherDetails from './containers/SchoolAdmin/TeacherDetails';
import UpdateSchoolLogo from './containers/SchoolAdmin/UpdateSchoolLogo';
import UpdateSchoolSignature from './containers/SchoolAdmin/UpdateSchoolSignature';
import UpdateGrade from './containers/SchoolAdmin/UpdateGrade';
// SchoolAdmin Routes

// SuperAdmin Routes
import SuperAdminHome from './containers/SuperAdmin/Home';
import SuperAdminLogin from './containers/SuperAdmin/Login';
import AddNewSchool from './containers/SuperAdmin/AddNewSchool';
import ViewSchools from './containers/SuperAdmin/ViewSchools';
import CreatePinCodes from './containers/SuperAdmin/CreatePinCodes';
import ViewPinCodes from './containers/SuperAdmin/ViewPinCodes';
// SuperAdmin Routes

// Result Checking
import ResultCheckingHome from './containers/CheckResult/Home';
import StudentResult from './containers/CheckResult/StudentResult';
// Result Checking


// Teacher Routes
import TeacherHome from './containers/Teacher/Home';
import TeacherLogin from './containers/Teacher/Login';
import ListofSubjectsTeacher from './containers/Teacher/ListofSubjects';
import UploadStudentResults from './containers/Teacher/UploadStudentResults';
import ListofResults from './containers/Teacher/ListofResults';
// Teacher Routes


import jquery from 'jquery';
window.$ = window.jQuery = jquery;

// require('bootstrap');
// require('metismenu');
// require('jquery-slimscroll');
// require('datatables');
// require('inspinia');
// require('pace');
// require('select2');

class App extends Component {

  render() {
    return (
        <Router>
            <div>

              {/*General HomePage*/}
              <Route exact path="/" component={MainHome}/>

              {/*SchoolAdmin Routes*/}

              <Route path="/SchoolAdmin" component={SchoolAdminHome}/>
              <Route path="/SchoolAdminPage/Login/:school_id" component={SchoolAdminLogin}/>
              <Route path="/SchoolAdminPage/AddaSubject" component={AddaSubject}/>
              <Route path="/SchoolAdminPage/AddaTeacher" component={AddaTeacher}/>
              <Route path="/SchoolAdminPage/UploadTeachers" component={UploadTeachers}/>
              <Route path="/SchoolAdminPage/AddStudentsRecord" component={AddStudentsRecord}/>
              <Route path="/SchoolAdminPage/ListofSubjects" component={ListofSubjectsSchoolAdmin}/>
              <Route path="/SchoolAdminPage/ListOfTeachers" component={ListOfTeachers}/>
              <Route path="/SchoolAdminPage/ListofStudents" component={ListofStudents}/>
              <Route path="/SchoolAdminPage/SubjectDetails" component={SubjectDetails}/>
              <Route path="/SchoolAdminPage/TeacherDetails" component={TeacherDetails}/>
              <Route path="/SchoolAdminPage/UpdateSchoolLogo" component={UpdateSchoolLogo}/>
              <Route path="/SchoolAdminPage/UpdateSchoolSignature" component={UpdateSchoolSignature}/>
              <Route path="/SchoolAdminPage/UpdateGrade" component={UpdateGrade}/>

              {/*SchoolAdmin Routes*/}


              {/*SuperAdmin Routes*/}

              <Route path="/SuperAdmin" component={SuperAdminHome}/>
              <Route path="/SuperAdminPage/Login" component={SuperAdminLogin}/>
              <Route path="/SuperAdminPage/AddNewSchool" component={AddNewSchool}/>
              <Route path="/SuperAdminPage/ViewSchools" component={ViewSchools}/>
              <Route path="/SuperAdminPage/CreatePinCodes" component={CreatePinCodes}/>
              <Route path="/SuperAdminPage/ViewPinCodes" component={ViewPinCodes}/>

              {/*SuperAdmin Routes*/}


              {/*Teacher Routes*/}

              <Route path="/Teacher" component={TeacherHome}/>
              <Route path="/TeacherPage/Login/:school_id" component={TeacherLogin}/>
              <Route path="/TeacherPage/ListofSubjects" component={ListofSubjectsTeacher}/>
              <Route path="/TeacherPage/UploadStudentResults" component={UploadStudentResults}/>
              <Route path="/TeacherPage/ListofResults" component={ListofResults}/>

              {/*Teacher Routes*/}


              {/*Result Checking*/}

              <Route path="/CheckResult" component={ResultCheckingHome}/>
              <Route path="/CheckResultPage/StudentResult" component={StudentResult}/>

              {/*Result Checking*/}

            </div>
        </Router>

    );
  }
}

export default App;
