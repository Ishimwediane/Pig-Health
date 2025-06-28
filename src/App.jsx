import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Guide from './components/Guide'
import Services from './components/Services'
import CTABanner from './components/CTABanner'
import Features from './components/Features'
import Footer from './components/Footer'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import ForgotPasswordForm from './components/auth/ForgotPasswordForm'
import ChangePasswordForm from './components/auth/ChangePasswordForm'
import LargeWhite from './pages/pig-breeds/LargeWhite'
import Landrace from './pages/pig-breeds/Landrace'
import Duroc from './pages/pig-breeds/Duroc'
import Pietrain from './pages/pig-breeds/Pietrain'
import Camborough from './pages/pig-breeds/Camborough'
import Housing from './pages/farming-techniques/Housing'
import Feeding from './pages/farming-techniques/Feeding'
import ReproductionManagement from './pages/farming-techniques/ReproductionManagement'
import WasteManagement from './pages/farming-techniques/WasteManagement'
import FreeRangePigFarming from './pages/farming-techniques/FreeRangePigFarming'
import CommonDiseases from './pages/farming-techniques/CommonDiseases'
import HealthMonitoring from './pages/farming-techniques/HealthMonitoring'
import Vaccination from './pages/farming-techniques/Vaccination'
import VeterinaryServices from './pages/farming-techniques/VeterinaryServices'
import Biosecurity from './pages/farming-techniques/Biosecurity'
import PigFeedAndMedicine from './pages/medicine-supplies/PigFeedAndMedicine'
import VeterinaryMedicine from './pages/medicine-supplies/VeterinaryMedicine'
import EquipmentAndFarmSupplies from './pages/medicine-supplies/EquipmentAndFarmSupplies'
import NutritionalSupplements from './pages/medicine-supplies/NutritionalSupplements'
import PigHealthAndDevices from './pages/medicine-supplies/PigHealthAndDevices'
import MyDashboard from './components/memberdashboard/Dashboard'
import PigHealth from './components/memberdashboard/PigHealth'
import VetServices from './components/memberdashboard/VeterinaryService'
import Community from './components/memberdashboard/Community'
import Profile from './components/memberdashboard/Profile'
import DeviceManagement from './components/memberdashboard/DeviceManagement'
import AboutAndContact from './components/AboutUs'
import GovernmentPolicies from './pages/GovernmentPolicies'
// Vet Dashboard Components
import VetDashboard from './components/vetdashboard/VetDashboard'
import VetPigsManagement from './components/vetdashboard/VetPigsManagement'
import VetFarmers from './components/vetdashboard/VetFarmers'
//import VetAppointments from './components/vetdashboard/VetAppointments'
import VetRequests from './components/vetdashboard/VetRequests'
import VetChat from './components/vetdashboard/VetChat'
import VetVaccinations from './components/vetdashboard/VetVaccinations'
//import VetTreatments from './components/vetdashboard/VetTreatments'
import VetVisitNotes from './components/vetdashboard/VetVisitNotes'
//import VetHealthRecords from './components/vetdashboard/VetHealthRecords'
import VetReports from './components/vetdashboard/VetReports'
import VetProfile from './components/vetdashboard/VetProfile'
//import VetSettings from './components/vetdashboard/VetSettings'
import VetDataTest from './components/vetdashboard/VetDataTest'

import AdminDashboard from './components/admindashboard/AdminDashboard'
import AdminUsers from './components/admindashboard/AdminUsers'
import AdminLayout from './components/admindashboard/AdminLayout'
import AdminBreeds from './components/admindashboard/AdminBreeds'
import AdminDevices from './components/admindashboard/AdminDevices'
import AdminServiceRequests from './components/admindashboard/AdminServiceRequests'
import AdminVaccination from './components/admindashboard/AdminVaccination'
import AdminVisit from './components/admindashboard/AdminVisit'
import AdminPost from './components/admindashboard/AdminPost'
import AdminReport from './components/admindashboard/AdminReport'
import AdminVet from './components/admindashboard/AdminVet'

function App() {
  const contactRef = React.useRef(null);
  const faqRef = React.useRef(null);
  React.useEffect(() => {
    window.scrollToContactUs = () => {
      if (contactRef.current) {
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.scrollToFAQ = () => {
      if (faqRef.current) {
        faqRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    return () => { 
      delete window.scrollToContactUs;
      delete window.scrollToFAQ;
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Routes - No Navbar/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="pig-breeds" element={<AdminBreeds/>}/>
          <Route path="veterinarians" element={<AdminVet/>} />
          <Route path="devices" element={< AdminDevices/>}/>
          <Route path="service-requests" element={<AdminServiceRequests/>} />
          <Route path="vaccinations" element={<AdminVaccination/>} />
          <Route path="visit-records" element={<AdminVisit/>} />
          <Route path="posts" element={<AdminPost/>} />
          <Route path="reports" element={<AdminReport/>} />
        </Route>

        {/* Vet Dashboard Routes - No Navbar/Footer */}
        <Route path="/vet-dashboard" element={<VetDashboard />} />
        <Route path="/vet-dashboard/pigs" element={<VetPigsManagement />} />
        <Route path="/vet-dashboard/farmers" element={<VetFarmers />} />
        
        <Route path="/vet-dashboard/requests" element={<VetRequests />} />
        <Route path="/vet-dashboard/chat" element={<VetChat />} />
        <Route path="/vet-dashboard/vaccinations" element={<VetVaccinations />} />
   
        <Route path="/vet-dashboard/visit-notes" element={<VetVisitNotes />} />
        
        <Route path="/vet-dashboard/reports" element={<VetReports />} />
        <Route path="/vet-dashboard/profile" element={<VetProfile />} />
        {/*<Route path="/vet-dashboard/settings" element={<VetSettings />} />*/}
        <Route path="/vet-dashboard/test" element={<VetDataTest />} />

        {/* All other routes with Navbar and Footer */}
        <Route path="/*" element={
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Stats />
                  <Guide />
                  <Services />
                  <CTABanner />
                  <Features />
                </>
              } />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/change-password" element={<ChangePasswordForm />} />
              <Route path="/pig-breeds/large-white" element={<LargeWhite />} />
              <Route path="/pig-breeds/landrace" element={<Landrace />} />
              <Route path="/pig-breeds/duroc" element={<Duroc />} />
              <Route path="/pig-breeds/pietrain" element={<Pietrain />} />
              <Route path="/pig-breeds/camborough" element={<Camborough />} />
              <Route path="/farming-techniques/housing" element={<Housing />} />
              <Route path="/farming-techniques/feeding" element={<Feeding />} />
              <Route path="/farming-techniques/reproduction-management" element={<ReproductionManagement />} />
              <Route path="/farming-techniques/waste-management" element={<WasteManagement />} />
              <Route path="/farming-techniques/free-range-pig-farming" element={<FreeRangePigFarming />} />
              <Route path="/farming-techniques/common-diseases" element={<CommonDiseases />} />
              <Route path="/farming-techniques/health-monitoring" element={<HealthMonitoring />} />
              <Route path="/farming-techniques/vaccination" element={<Vaccination />} />
              <Route path="/farming-techniques/veterinary-services" element={<VeterinaryServices />} />
              <Route path="/farming-techniques/biosecurity" element={<Biosecurity />} />
              <Route path="/medicine-supplies/pig-feed-and-medicine" element={<PigFeedAndMedicine />} />
          <Route path="/medicine-supplies/veterinary-medicine" element={<VeterinaryMedicine />} />
          <Route path="/medicine-supplies/equipment-and-farm-supplies" element={<EquipmentAndFarmSupplies />} />
          <Route path="/medicine-supplies/nutritional-supplements" element={<NutritionalSupplements />} />
          <Route path="/medicine-supplies/pig-health-and-devices" element={<PigHealthAndDevices />} />
          <Route path="/about" element={<AboutAndContact contactRef={contactRef} faqRef={faqRef} />} />
          <Route path="/government-policies" element={<GovernmentPolicies />} />
              <Route path="/community" element={<Community />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/FarmerDashboard" element={<MyDashboard />} />
              <Route path="/pighealth" element={<PigHealth />} />
              <Route path="/vetservices" element={<VetServices />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
