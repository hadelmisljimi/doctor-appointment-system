import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer } from '@coreui/react'

import bgImage from '../../assets/images/imggg.jpg'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="home-page">

      <div className="hero">

        <CContainer fluid>

          <div className="hero-content">

            <span className="subtitle">
              WELCOME TO MEDICAL SERVICES
            </span>

            <h1>
              Making Health<br />
              Care Better Together
            </h1>

            <p>
              We provide high quality medical services with experienced doctors,
              modern equipment and patient-focused care. Book appointments easily
              and get professional healthcare support anytime.
            </p>

            <div className="buttons">

              <button
                className="btn-primary"
                onClick={() => navigate('/appointments')}
              >
                Make an Appointment
              </button>

              <button
                className="btn-outline"
                onClick={() => navigate('/doctors')}
              >
                View Doctors
              </button>

            </div>

          </div>

        </CContainer>

      </div>

      {/* STYLE */}
      <style>{`

        .home-page {
          width: 100vw;
          height: 80vh;
          margin: 0;
          overflow: hidden;
        }
          html, body, #root {
  height: 100%;
  overflow: hidden;
  margin: 0;
}
          
        
        .hero {
          width: 100%;
          height: 100vh;
          margin-left: 0;
          margin-right: 0; 
          display: flex;
          align-items: center;
          

          background:
            linear-gradient(
              rgba(255,255,255,0.28),
              rgba(255,255,255,0.28)
            ),
            url(${bgImage});

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;


        .hero-content {
          max-width: 650px;
          transform: translateY(-30px);
        }

        .subtitle {
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 700;
          color: #2563eb;
        }

        .hero-content h1 {
          font-size: 48px; /* 🔥 slightly smaller */
          font-weight: 800;
          line-height: 1.1;
          margin-top: 12px;
          color: #111827;
        }

        .hero-content p {
          margin-top: 18px;
          font-size: 15px;
          line-height: 1.7;
          color: #6b7280;
          max-width: 550px;
        }

        .buttons {
          margin-top: 25px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: #60a5fa;
          color: white;
          border: none;
          padding: 12px 26px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-outline {
          background: transparent;
          color: #111827;
          border: 1px solid rgba(0,0,0,0.2);
          padding: 12px 26px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #3b82f6;
        }

        .btn-outline:hover {
          background: rgba(0,0,0,0.05);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hero {
            padding: 40px;
            height: calc(100vh - 80px);
          }

          .hero-content {
            transform: translateY(-10px);
            text-align: center;
          }

          .hero-content h1 {
            font-size: 34px;
          }

          .buttons {
            justify-content: center;
          }
        }

      `}</style>

    </div>
  )
}

export default Home