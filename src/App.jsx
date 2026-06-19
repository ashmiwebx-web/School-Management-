import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import AppToast from "./components/Toast/AppToast";

import BlocksClassRooms from "./pages/BlocksClassRooms/BlocksClassRooms";
import StandardSections from "./pages/StandardSections/StandardSections";
import ClassAllocation from "./pages/ClassAllocation/ClassAllocation";

import AddStudent from "./pages/Students/AddStudent";
import StudentList from "./pages/Students/StudentList";
import StudentView from "./pages/Students/StudentView";

import Subjects from "./pages/Subjects/Subjects";
import AlloteSubject from "./pages/Subjects/AlloteSubject";

import TeacherList from "./pages/Teachers/TeacherList";
import AddTeacher from "./pages/Teachers/AddTeacher";
import TeacherView from "./pages/Teachers/TeacherView";

import Vehicles from "./pages/Transport/Vehicles";
import TransportRoutes from "./pages/Transport/Routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppToast />

      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <Sidebar />

        <div className="ml-[260px] min-h-screen">
          <Navbar />

          <main className="p-6">
            <RouterRoutes>
              <Route path="/" element={<Navigate to="/student-list" replace />} />

              <Route path="/student-list" element={<StudentList />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/edit-student/:id" element={<AddStudent />} />
              <Route path="/student-view/:id" element={<StudentView />} />

              <Route path="/blocks-classrooms" element={<BlocksClassRooms />} />
              <Route path="/standard-sections" element={<StandardSections />} />
              <Route path="/class-allocation" element={<ClassAllocation />} />

              <Route path="/subjects" element={<Subjects />} />
              <Route path="/allote-subject" element={<AlloteSubject />} />

              <Route path="/teacher-list" element={<TeacherList />} />
              <Route path="/add-teacher" element={<AddTeacher />} />
              <Route path="/edit-teacher/:id" element={<AddTeacher />} />
              <Route path="/teacher-view/:id" element={<TeacherView />} />

              <Route path="/transport/routes" element={<TransportRoutes />} />
              <Route path="/transport/vehicles" element={<Vehicles />} />
            </RouterRoutes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}