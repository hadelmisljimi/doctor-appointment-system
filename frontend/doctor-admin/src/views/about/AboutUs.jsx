import React from "react"
import { CContainer, CRow, CCol, CCard, CCardBody } from "@coreui/react"
import {
  cilPhone,
  cilEnvelopeOpen,
  cilLocationPin,
  cilPeople,
  cilMedicalCross,
  cilStar,
} from "@coreui/icons"
import CIcon from "@coreui/icons-react"

const AboutUs = () => {
  return (
    <div className="about-page">

      {/* HERO */}
      <div className="hero">
        <div className="overlay">
          <CContainer>
            <div className="hero-content">
              <h1>About Our Medical Clinic</h1>
              <p>
                Modern healthcare center dedicated to patient care,
                advanced treatment and 24/7 medical support.
              </p>
            </div>
          </CContainer>
        </div>
      </div>

      {/* INFO WIDE */}
      <CContainer fluid className="section">

        <CCard className="wide-card white-card">
          <CCardBody>
            <h2>Who We Are</h2>
            <p>
              We are a modern clinic in Sofia, Bulgaria providing high-quality
              healthcare services with experienced doctors, advanced technology
              and a patient-first approach.
            </p>
          </CCardBody>
        </CCard>

      </CContainer>

      {/* STATS BLUE WHITE CARDS */}
      <CContainer fluid className="section">

        <CRow className="g-4 align-items-stretch">

          <CCol md={3}>
            <CCard className="blue-card">
              <CCardBody>
                <CIcon icon={cilPeople} size="xl" />
                <h4>50+ Doctors</h4>
                <p>Certified specialists</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="blue-card">
              <CCardBody>
                <CIcon icon={cilMedicalCross} size="xl" />
                <h4>24/7 Care</h4>
                <p>Always available emergency help</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="blue-card">
              <CCardBody>
                <CIcon icon={cilStar} size="xl" />
                <h4>15+ Years</h4>
                <p>Medical experience</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="blue-card">
              <CCardBody>
                <CIcon icon={cilPeople} size="xl" />
                <h4>10K+ Patients</h4>
                <p>Successfully treated</p>
              </CCardBody>
            </CCard>
          </CCol>

        </CRow>
      </CContainer>

      {/* MISSION / VISION */}
      <CContainer fluid className="section">

        <CCard className="wide-card white-card">
          <CCardBody>
            <h2>Our Mission</h2>
            <p>
              To deliver high-quality, safe and accessible healthcare services
              for every patient.
            </p>
          </CCardBody>
        </CCard>

        <CCard className="wide-card white-card mt-3">
          <CCardBody>
            <h2>Our Vision</h2>
            <p>
              To become a leading medical institution in Bulgaria known for trust,
              innovation and care.
            </p>
          </CCardBody>
        </CCard>

      </CContainer>

      {/* CONTACT */}
      <CContainer fluid className="section contact">

        <h2>Contact Us</h2>

        <CRow className="g-4 mt-3">

          <CCol md={4}>
            <div className="contact-box">
              <CIcon icon={cilPhone} size="lg" />
              <h5>Phone</h5>
              <p>+359 88 123 4567</p>
            </div>
          </CCol>

          <CCol md={4}>
            <div className="contact-box">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
              <h5>Email</h5>
              <p>info@clinic.bg</p>
            </div>
          </CCol>

          <CCol md={4}>
            <div className="contact-box">
              <CIcon icon={cilLocationPin} size="lg" />
              <h5>Address</h5>
              <p>Sofia, Bulgaria</p>
            </div>
          </CCol>

        </CRow>
      </CContainer>

      {/* STYLE */}
      <style>{`
        .about-page {
          width: 100%;
          background: #f8fafc;
        }

        /* HERO */
        .hero {
          width: 100%;
          height: 200px;
          background: url("https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1500&q=80");
          background-size: cover;
          background-position: center;
        }

        .overlay {
          width: 100%;
          height: 100%;
          background: rgba(37,99,235,0.75);
          display: flex;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 30px;
          font-weight: 800;
          color: white;
        }

        .hero-content p {
          color: #e5e7eb;
        }

        /* SECTIONS */
        .section {
          padding: 25px 20px;
        }

        /* 🔥 WHITE CARD FIXED (ONLY THIS CHANGED) */
        .white-card {
          background: white !important;
          border: none;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .white-card h2 {
          color: #2563eb;
          font-weight: 800;
        }

        .white-card p {
          color: #2563eb;
          line-height: 1.7;
        }

        /* BLUE CARDS */
        .blue-card {
          border: none;
          border-radius: 16px;
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          color: white;
          box-shadow: 0 10px 25px rgba(37,99,235,0.25);
          transition: 0.3s;
        }

        .blue-card:hover {
          transform: translateY(-6px);
        }

        .blue-card h4 {
          margin-top: 10px;
          font-weight: 700;
        }

        .blue-card p {
          color: #e0f2fe;
        }

        svg {
          color: white;
        }

        /* CONTACT */
        .contact {
          text-align: center;
        }

        .contact h2 {
          font-size: 26px;
          font-weight: 800;
          color: #2563eb;
        }

        .contact-box {
          background: white;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
          transition: 0.3s;
        }

        .contact-box:hover {
          transform: translateY(-4px);
        }

        .contact-box h5 {
          margin-top: 8px;
          font-weight: 700;
        }

        .contact-box p {
          color: #6b7280;
        }

        .blue-card {
  height: 100%;
  min-height: 170px; /* isto za sve kartice */
  display: flex;
  align-items: center;
  justify-content: center;
}

.blue-card .card-body {
  width: 100%;
}

      `}</style>

    </div>
  )
}

export default AboutUs