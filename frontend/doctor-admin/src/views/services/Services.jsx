import React from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody } from '@coreui/react'

const Services = () => {
  return (
    <div className="services-page">

      {/* TITLE */}
      <div className="top-title">
        <h1>Medical Specialties</h1>
        <p>Professional healthcare services with experienced doctors</p>
      </div>

      {/* SPECIALTIES */}
      <div className="section specialties">
        <CContainer>
          <CRow className="g-4">

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>General Practitioner</h4>
                  <p>Primary healthcare, diagnosis and preventive care for all patients.</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>Cardiologist</h4>
                  <p>Heart disease diagnosis, treatment and cardiovascular monitoring.</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>Neurologist</h4>
                  <p>Brain, nerve and spinal cord disorders treatment and diagnostics.</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>Orthopedic Surgeon</h4>
                  <p>Bone, joint and musculoskeletal system treatment and surgery.</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>Pediatrician</h4>
                  <p>Medical care for infants, children and adolescents.</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4} md={6}>
              <CCard className="service-card">
                <CCardBody>
                  <div className="line"></div>
                  <h4>ENT Specialist</h4>
                  <p>Treatment of ear, nose and throat conditions and infections.</p>
                </CCardBody>
              </CCard>
            </CCol>

          </CRow>
        </CContainer>
      </div>

      {/* FEATURES */}
      <div className="features">
        <CContainer>
          <CRow className="g-4">

            <CCol md={4}>
              <div className="feature-card">
                <h3>24/7 Support</h3>
                <p>We are always available for emergency care anytime.</p>
              </div>
            </CCol>

            <CCol md={4}>
              <div className="feature-card">
                <h3>Online Appointment</h3>
                <p>Book appointments quickly from your phone or computer.</p>
              </div>
            </CCol>

            <CCol md={4}>
              <div className="feature-card">
                <h3>Expert Doctors</h3>
                <p>Highly trained professionals with years of experience.</p>
              </div>
            </CCol>

          </CRow>
        </CContainer>
      </div>

      {/* STYLE */}
      <style>{`
        .services-page {
          background: #f8fafc;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        .top-title {
          text-align: center;
          padding: 20px 10px 10px;
        }

        .top-title h1 {
          color: #2563eb;
          font-size: 36px;
          font-weight: 800;
          margin: 0;
        }

        .top-title p {
          color: #64748b;
          margin-top: 5px;
        }

        .specialties {
          padding: 20px 20px 40px;
        }

        .service-card {
          border: none;
          border-radius: 16px;
          background: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transition: 0.3s;
          height: 100%;
          text-align: left;
        }

        .service-card:hover {
          transform: translateY(-6px);
        }

        .line {
          width: 45px;
          height: 4px;
          background: #2563eb;
          border-radius: 10px;
          margin-bottom: 12px;
        }

        .service-card h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .service-card p {
          font-size: 14px;
          color: #64748b;
          margin-top: 8px;
          line-height: 1.6;
        }

        .features {
          padding: 30px 20px 50px;
          background: #f8fafc;
        }

        .feature-card {
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          color: white;
          padding: 14px 18px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(37,99,235,0.2);
          transition: 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .feature-card p {
          font-size: 13px;
          opacity: 0.9;
        }
      `}</style>

    </div>
  )
}

export default Services