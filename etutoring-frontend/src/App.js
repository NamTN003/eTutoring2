// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from "./compo/Home";
// import Login from "./compo/Login";
// import Homeadmin from "./Admin/Homeadmin";
// import Homestudent from "./Student/Homestudent";
// import Hometutor from "./Tutor/Hometutor";
// import Createacount from "./Admin/Createacount";
// import Register from "./compo/Register";
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
// import Meeting from "./Staff/Meeting";
// import CreateMeeting from "./Staff/CreateMeeting";
// import UpdateMeeting from "./Staff/UpdateMeeting";
// import RollCall from "./Staff/RollCall";
// import CreateBlog from './Tutor/CreateBlog';
// import CreateSubject from './Staff/CreateSubject';
// import ProtectedRoute from "./Utils/ProtectedRoute";
// import NotFound from "./Utils/NotFound";
// import SendEmail from "./Authorized/SendEmail";
// import StudentEmail from "./Student/StudentEmail";
// import TutorEmail from "./Tutor/TutorEmail";
// import AdminDashboard from "./Admin/AdminDashborad";

// function App() {
//   return (
//     <div>
//       <Router>
//         <div>
//           <Routes>
//             <Route path="*" element={<NotFound />} />
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Protected routes */}
//             <Route
//               path="/homeadmin"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Homeadmin />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createacount"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Createacount />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admindashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   < AdminDashboard/>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/homestudent"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <Homestudent />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/hometutor"
//               element={
//                 <ProtectedRoute allowedRoles={["tutor"]}>
//                   <Hometutor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/tutoremail"
//               element={
//                 <ProtectedRoute allowedRoles={["tutor"]}>
//                   <TutorEmail />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/homeauthorized"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <Homeauthorized />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/sendemail"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <SendEmail />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/homestaff"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <Homestaff />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/liststaff"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Liststaff />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/editstaff/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <Editstaff />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createstudent"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <Createstudent />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/requestupgrade"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <RequestUpgrade />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/adminrequests"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminRequests />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/imformation"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "staff", "authorized", "student", "tutor"]}>
//                   <Imformation />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/studentlist"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <StudentList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/editstudent/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <EditStudent />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createtutor"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <Createtutor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/assigntutor"
//               element={
//                 <ProtectedRoute allowedRoles={["authorized"]}>
//                   <AssignTutor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chatTutor"
//               element={
//                 <ProtectedRoute allowedRoles={["tutor"]}>
//                   <ChatTutor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chatstudent"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <ChatStudent />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/studentemail"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <StudentEmail />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/meeting"
//               element={
//                 <ProtectedRoute allowedRoles={["staff", "tutor","student"]}>
//                   <Meeting />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createmeeting"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <CreateMeeting />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/rollcall"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <RollCall />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/updatemeeting/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <UpdateMeeting />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createblog"
//               element={
//                 <ProtectedRoute allowedRoles={["tutor"]}>
//                   <CreateBlog />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/createsubject"
//               element={
//                 <ProtectedRoute allowedRoles={["staff"]}>
//                   <CreateSubject />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
          
//         </div>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./compo/Home";
import Login from "./compo/Login";
import Homeadmin from "./Admin/Homeadmin";
import Homestudent from "./Student/Homestudent";
import Hometutor from "./Tutor/Hometutor";
import Createacount from "./Admin/Createacount";
import Register from "./compo/Register";
import Homeauthorized from "./Authorized/Homeauthorized";
import Homestaff from "./Staff/Homestaff";
import Liststaff from "./Admin/Liststaff";
import Editstaff from "./Admin/Editstaff";
import Createstudent from "./Authorized/Createstudent";
import RequestUpgrade from "./Staff/RequestUpgrade";
import AdminRequests from "./Admin/AdminRequests";
import Imformation from "./Utils/Imformation";
import StudentList from "./Authorized/StudentList";
import EditStudent from "./Authorized/EditStudent";
import Createtutor from "./Authorized/Createtutor";
import AssignTutor from "./Authorized/AssignTutor ";
import ChatTutor from "./Tutor/ChatTutor";
import ChatStudent from "./Student/ChatStudent";
import Meeting from "./Staff/Meeting";
import CreateMeeting from "./Staff/CreateMeeting";
import UpdateMeeting from "./Staff/UpdateMeeting";
import RollCall from "./Staff/RollCall";
import CreateBlog from './Tutor/CreateBlog';
import CreateSubject from './Staff/CreateSubject';
import ProtectedRoute from "./Utils/ProtectedRoute";
import NotFound from "./Utils/NotFound";
import SendEmail from "./Authorized/SendEmail";
import StudentEmail from "./Student/StudentEmail";
import TutorEmail from "./Tutor/TutorEmail";
import AdminDashboard from "./Admin/AdminDashborad";
import BlogList from "./compo/BlogList";
import MeetingStudent from "./Student/MeetingStudent";
import MeetingTutor from "./Tutor/MeetingTutor";
import ListTutor from "./Authorized/ListTutor";
import RollCallTutor from "./Tutor/RollCallTutor";
import UpdateMeetingTutor from "./Tutor/UpdateMeetingTutor";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Admin */}
          <Route path="/homeadmin" element={<ProtectedRoute allowedRoles={["admin"]}><Homeadmin /></ProtectedRoute>}>
            <Route index element={<div><h1>Welcome to eTutoring</h1></div>} />
            <Route path="createacount" element={<Createacount />} />
            <Route path="admindashboard" element={<AdminDashboard />} />
            <Route path="liststaff" element={<Liststaff />} />
            <Route path="editstaff/:id" element={<Editstaff />} />
            <Route path="adminrequests" element={<AdminRequests />} />
            <Route path="imformation" element={<Imformation />} />
          </Route>

          {/* 🔒 Authorized */}
          <Route path="/homeauthorized" element={<ProtectedRoute allowedRoles={["authorized"]}><Homeauthorized /></ProtectedRoute>}>
            <Route index element={<div className="bloglist-wrapper"><BlogList /></div>} />
            <Route path="createstudent" element={<Createstudent />} />
            <Route path="createtutor" element={<Createtutor />} />
            <Route path="imformation" element={<Imformation />} />
            <Route path="studentlist" element={<StudentList />} />
            <Route path="listtutor" element={<ListTutor />} />
            <Route path="editstudent/:id" element={<EditStudent />} />
            <Route path="assigntutor" element={<AssignTutor />} />
            <Route path="sendemail" element={<SendEmail />} />
          </Route>

          {/* 🔒 Staff */}
          <Route path="/homestaff" element={<ProtectedRoute allowedRoles={["staff"]}><Homestaff /></ProtectedRoute>}>
            <Route index element={<div className="bloglist-wrapper"><BlogList /></div>} />
            <Route path="imformation" element={<Imformation />} />
            <Route path="rollcall" element={<RollCall />} />
            <Route path="meeting" element={<Meeting />} />
            <Route path="createmeeting" element={<CreateMeeting />} />
            <Route path="requestupgrade" element={<RequestUpgrade />} />
            <Route path="createsubject" element={<CreateSubject />} />
          </Route>

          {/* 🔒 Student */}
          <Route path="/homestudent" element={<ProtectedRoute allowedRoles={["student"]}><Homestudent /></ProtectedRoute>}>
            <Route index element={<div className="bloglist-wrapper"><BlogList /></div>} />
            <Route path="imformation" element={<Imformation />} />
            <Route path="chatstudent" element={<ChatStudent />} />
            <Route path="meetingstudent" element={<MeetingStudent />} />
            <Route path="studentemail" element={<StudentEmail />} />
          </Route>

          {/* 🔒 Tutor */}
          <Route path="/hometutor" element={<ProtectedRoute allowedRoles={["tutor"]}><Hometutor /></ProtectedRoute>}>
            <Route index element={<div className="bloglist-wrapper"><BlogList /></div>} />
            <Route path="imformation" element={<Imformation />} />
            <Route path="chattutor" element={<ChatTutor />} />
            <Route path="rollcalltutor" element={<RollCallTutor/>} />
            <Route path="meetingtutor" element={<MeetingTutor />} />
            <Route path="createblog" element={<CreateBlog />} />
            <Route path="tutoremail" element={<TutorEmail />} />
          </Route>
          <Route
                    path="homestaff/updatemeeting/:id"
                    element={
                        <ProtectedRoute allowedRoles={["staff", "tutor"]}>
                            <UpdateMeeting />
                        </ProtectedRoute>
                    }
                />
        </Routes>
      </Router>
    </div>
  );
}

export default App;