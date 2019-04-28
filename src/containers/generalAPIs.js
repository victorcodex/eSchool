import localforage from "localforage";

class GeneralAPIs {
    // constructor() {

        // API_BASEURL = 'http://flipapi.com/';
        API_BASEURL = 'https://flipapi.com/';

        API_SCHOOL_ADMIN_BASEURL = this.API_BASEURL + 'school/';  // school Admin url

        API_SUPER_ADMIN_BASEURL = this.API_BASEURL + 'admin'; // super Admin url

        API_TEACHER_BASEURL = this.API_BASEURL + 'teacher/'; // Teacher base url

    // }
}

export default (new GeneralAPIs);