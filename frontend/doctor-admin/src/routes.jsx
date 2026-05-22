import React from "react";
import PrivateRoute from "./routes/PrivateRoute";

const Home = React.lazy(() => import("./views/home/Home"));
const AboutUs = React.lazy(() => import("./views/about/AboutUs"));
const Services = React.lazy(() => import("./views/services/Services"));

// LAZY PAGES
const Doctors = React.lazy(() => import("./views/doctors/Doctors"));
const Patients = React.lazy(() => import("./views/patients/Patients"));
const Help = React.lazy(() => import("./views/help/Help"));

const Appointments = React.lazy(() =>
  import("./views/appointments/Appointments")
);

const BookAppointment = React.lazy(() =>
  import("./views/appointments/BookAppointment")
);

const DeleteAppointment = React.lazy(() =>
  import("./views/appointments/DeleteAppointment")
);

const CompleteAppointment = React.lazy(() =>
  import("./views/appointments/CompleteAppointment")
);

const CancelAppointment = React.lazy(() =>
  import("./views/appointments/CancelAppointment")
);

const DeletePatients = React.lazy(() =>
  import("./views/patients/DeletePatients")
);

const DeleteDoctors = React.lazy(() =>
  import("./views/doctors/DeleteDoctors")
);

const EditDoctors = React.lazy(() =>
  import("./views/doctors/EditDoctors")
);

const AddDoctors = React.lazy(() =>
  import("./views/doctors/AddDoctors")
);

const AddPatients = React.lazy(() =>
  import("./views/patients/AddPatients")
);
const EditPatients = React.lazy(() =>
  import("./views/patients/EditPatients")
);


// AUTH
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Authorize = React.lazy(() => import("./views/pages/authorize/Authorize"));

// WRAPPERS (ISPRAVNO)
const BookAppointmentGuard = () => (
  <PrivateRoute roles={["PATIENT", "ADMIN", "DOCTOR"]}>
    <BookAppointment />
  </PrivateRoute>
);

const DeleteAppointmentGuard = () => (
  <PrivateRoute roles={["ADMIN", "DOCTOR"]}>
    <DeleteAppointment />
  </PrivateRoute>
);

const CompleteAppointmentGuard = () => (
  <PrivateRoute roles={["ADMIN", "DOCTOR"]}>
    <CompleteAppointment />
  </PrivateRoute>
);

const CancelAppointmentGuard = () => (
  <PrivateRoute roles={["ADMIN", "DOCTOR"]}>
    <CancelAppointment />
  </PrivateRoute>
);

const DeletePatientsGuard = () => (
  <PrivateRoute roles={["ADMIN", "DOCTOR"]}>
    <DeletePatients />
  </PrivateRoute>
);

const DeleteDoctorsGuard = () => (
  <PrivateRoute roles={["ADMIN" ]}>
    <DeleteDoctors />
  </PrivateRoute>
);
const EditDoctorsGuard = () => (
  <PrivateRoute roles={["ADMIN" ]}>
    <EditDoctors />
  </PrivateRoute>
);
const AddDoctorsGuard = () => (
  <PrivateRoute roles={["ADMIN" ]}>
    <AddDoctors />
  </PrivateRoute>
);
const AddPatientsGuard = () => (
  <PrivateRoute roles={["PATIENT", "ADMIN", "DOCTOR"]}>
    <AddPatients />
  </PrivateRoute>
);
const EditPatientsGuard = () => (
  <PrivateRoute roles={[ "ADMIN", "DOCTOR"]}>
    <EditPatients />
  </PrivateRoute>
);

export const routes = [
 {
  path: "/",
  exact: true,
  name: "Home",
  element: Home,
},

{
  path: "/about",
  name: "About Us",
  element: AboutUs,
},
{
  path: "/services",
  name: "Services",
  element: Services,
},

  // CUSTOM
  { path: "/doctors", name: "Doctors", element: Doctors },
  { path: "/patients", name: "Patients", element: Patients },

//help
  { path: "/help", name: "Help", element: Help },

  // APPOINTMENTS
  { path: "/appointments", name: "All Appointments", element: Appointments },

  {
    path: "/appointments/book",
    name: "Book Appointment",
    element: BookAppointmentGuard,
  },

  {
    path: "/appointments/delete",
    name: "Delete Appointment",
    element: DeleteAppointmentGuard,
  },

  {
    path: "/appointments/completed",
    name: "Completed",
    element: CompleteAppointmentGuard,
  },

  {
    path: "/appointments/cancelled",
    name: "Cancelled",
    element: CancelAppointmentGuard,
  },

  {
    path: "/patients/delete",
    name: "Delete Patients",
    element: DeletePatientsGuard,
  },

  {
  path: "/doctors/delete",
  name: "Delete Doctors",
  element: DeleteDoctorsGuard,
},
{
  path: "/doctors/edit",
  name: "Edit Doctors",
  element: EditDoctorsGuard,
},

{
  path: "/doctors/add",
  name: "Add Doctors",
  element: AddDoctorsGuard,
},
{
  path: "/patients/add",
  name: "Add Patients",
  element: AddPatientsGuard,
},
{
  path: "/patients/edit",
  name: "Edit Patients",
  element: EditPatientsGuard,
},

  // AUTH
  { path: "/login", name: "Login", element: Login },
  { path: "/register", name: "Register", element: Register },
  { path: "/authorize", name: "Authorize", element: Authorize },
];

export default routes;