// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from "./compo/Home";
// import Login from "./compo/Login";
// import Homeadmin from "./Admin/Homeadmin";
// import Homestudent from "./Student/Homestudent";
// import Hometutor from "./Tutor/Hometutor";
// import Register from "./compo/Register";
// import Createacount from "./Admin/Createacount";
// import Homeauthorized from "./Authorized/Homeauthorized";
// import Homestaff from "./Staff/Homestaff";
// import Liststaff from "./Admin/Liststaff";
// import Editstaff from "./Admin/Editstaff";
// import Createstudent from "./Authorized/Createstudent";
// import RequestUpgrade from "./Staff/RequestUpgrade";
// import AdminRequests from "./Admin/AdminRequests";
// import Imformation from "./Utils/Imformation";
// import StudentList from "./Authorized/StudentList";
// import EditStudent from "./Authorized/EditStudent";
// import Createtutor from "./Authorized/Createtutor";
// import AssignTutor from "./Authorized/AssignTutor ";
// import ChatTutor from "./Tutor/ChatTutor";
// import ChatStudent from "./Student/ChatStudent";
// // import Chat from "./Utils/Chat";
// import Meeting from "./Staff/Meeting";
// import CreateMeeting from "./Staff/CreateMeeting";
// import UpdateMeeting from "./Staff/UpdateMeeting";
// import RollCall from "./Staff/RollCall";
// import BlogList from './Tutor/BlogList';
// import CreateBlog from './Tutor/CreateBlog';
// import StudentBlogList from './Student/StudentBlogList';
// import CreateSubject from './Staff/CreateSubject';

// function App() {
//   // const userId = localStorage.getItem("userId");
//   // const authToken = localStorage.getItem("token");
//   return (
    
//     <div>
//       <Router>
//             <div>
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/homeadmin" element={<Homeadmin />} />
//                 <Route path="/homestudent" element={<Homestudent />} />
//                 <Route path="/hometutor" element={<Hometutor />} />
//                 <Route path="/createacount" element={<Createacount />} />
//                 <Route path="/homeauthorized" element={<Homeauthorized />} />
//                 <Route path="/homestaff" element={<Homestaff />} />
//                 <Route path="/liststaff" element={<Liststaff />} />
//                 <Route path="//editstaff/:id" element={<Editstaff />} />
//                 <Route path="/createstudent" element={<Createstudent />} />
//                 <Route path="/requestupgrade" element={<RequestUpgrade />} />
//                 <Route path="/adminrequests" element={<AdminRequests />} />
//                 <Route path="/imformation" element={<Imformation />} />
//                 <Route path="/studentList" element={<StudentList />} />
//                 <Route path="//editstudent/:id" element={<EditStudent />} />
//                 <Route path="/createtutor" element={<Createtutor />} />
//                 <Route path="/assigntutor" element={<AssignTutor />} />
//                 <Route path="/chatTutor" element={<ChatTutor />} />
//                 <Route path="/chatStudent" element={<ChatStudent />} />
//                 <Route path="/meeting" element={<Meeting />} />
//                 <Route path="/createMeeting" element={<CreateMeeting />} />
//                 <Route path="/rollCall" element={<RollCall />} />
//                 <Route path="/updatemeeting/:id" element={<UpdateMeeting />} />
//                 <Route path="/blog" element={<BlogList />} />
//                 <Route path="/createblog" element={<CreateBlog />} />
//                 <Route path="/studentblogs" element={<StudentBlogList />} />
//                 <Route path="/createsubject" element={<CreateSubject />} /> {/* Thêm route cho CreateSubject */}
//                 {/* <Route path="/chat" element={<Chat userId={userId} authToken={authToken} />} /> */}


//               </Routes>
//             </div>
//           </Router>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./compo/Home";
import Login from "./compo/Login";
import Register from "./compo/Register";
import Imformation from "./Utils/Imformation";

// Admin
import Homeadmin from "./Admin/Homeadmin";
import Createacount from "./Admin/Createacount";
import Liststaff from "./Admin/Liststaff";
import Editstaff from "./Admin/Editstaff";
import AdminRequests from "./Admin/AdminRequests";

// Authorized
import Homeauthorized from "./Authorized/Homeauthorized";
import Createstudent from "./Authorized/Createstudent";
import StudentList from "./Authorized/StudentList";
import EditStudent from "./Authorized/EditStudent";
import Createtutor from "./Authorized/Createtutor";
import AssignTutor from "./Authorized/AssignTutor ";

// Staff
import Homestaff from "./Staff/Homestaff";
import RequestUpgrade from "./Staff/RequestUpgrade";
import Meeting from "./Staff/Meeting";
import CreateMeeting from "./Staff/CreateMeeting";
import UpdateMeeting from "./Staff/UpdateMeeting";
import RollCall from "./Staff/RollCall";
import CreateSubject from "./Staff/CreateSubject";

// Tutor
import Hometutor from "./Tutor/Hometutor";
import ChatTutor from "./Tutor/ChatTutor";
import BlogList from './Tutor/BlogList';
import CreateBlog from './Tutor/CreateBlog';

// Student
import Homestudent from "./Student/Homestudent";
import ChatStudent from "./Student/ChatStudent";
import StudentBlogList from './Student/StudentBlogList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Common */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/homeadmin" element={<Homeadmin />} />
        <Route path="/createacount" element={<Createacount />} />
        <Route path="/liststaff" element={<Liststaff />} />
        <Route path="/editstaff/:id" element={<Editstaff />} />
        <Route path="/adminrequests" element={<AdminRequests />} />
        <Route path="imformation" element={<Imformation />} />

        {/* Authorized */}
        <Route path="/homeauthorized" element={<Homeauthorized />}>
          <Route path="createstudent" element={<Createstudent />} />
          <Route path="studentList" element={<StudentList />} />
          <Route path="editstudent/:id" element={<EditStudent />} />
          <Route path="createtutor" element={<Createtutor />} />
          <Route path="assigntutor" element={<AssignTutor />} />
          <Route path="imformation" element={<Imformation />} />
        </Route>

        {/* Staff */}
        <Route path="/homestaff" element={<Homestaff />}>
          <Route path="requestupgrade" element={<RequestUpgrade />} />
          <Route path="createmeeting" element={<CreateMeeting />} />
          <Route path="createsubject" element={<CreateSubject />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="rollcall" element={<RollCall />} />
          <Route path="updatemeeting/:id" element={<UpdateMeeting />} />
          <Route path="imformation" element={<Imformation />} />
        </Route>

        {/* Tutor */}
        <Route path="/hometutor" element={<Hometutor />}>
          <Route path="chattutor" element={<ChatTutor />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="createblog" element={<CreateBlog />} />
          <Route path="imformation" element={<Imformation />} />
        </Route>

        {/* Student */}
        <Route path="/homestudent" element={<Homestudent />}>
          <Route path="chatstudent" element={<ChatStudent />} />
          <Route path="studentblogs" element={<StudentBlogList />} />
          <Route path="imformation" element={<Imformation />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
