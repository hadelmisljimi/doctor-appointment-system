import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { specialties, doctorImages } from "../doctors/doctors_specialties";

import {
  Calendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";

import {
  format,
  parse,
  startOfWeek,
  getDay,
  isBefore,
  startOfToday,
  addDays,
  subDays,
  addMonths,
  subMonths,
} from "date-fns";

import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// =========================
// DATE FORMAT
// =========================

const formatDateBG = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return new Date();

  const cleanDate = dateStr.replace(/\.$/, "");

  const [day, month, year] =
    cleanDate.split(".");

  const [hours, minutes] =
    timeStr.split(":");

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes
  );
};

// =========================
// INITIALS
// =========================

const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.split(" ");

  return (
    (parts[0]?.[0] || "") +
    (parts[1]?.[0] || "")
  ).toUpperCase();
};


const renderDoctorAvatar = (doctorName, doctorExists = true) => {
  if (!doctorExists) {
    return (
      <div style={doctorInitials}>
        {getInitials(doctorName)}
      </div>
    );
  }

  return (
    <img
      src={
        doctorImages[doctorName] ||
        "/images/doctors/default.jpg"
      }
      alt="doctor"
      style={doctorAvatar}
    />
  );
};



// =========================
// COMPONENT
// =========================

const Appointments = () => {
    const navigate = useNavigate();
  const [events, setEvents] =
    useState([]);

  const [hoveredEvent, setHoveredEvent] =
    useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [view, setView] =
    useState(Views.MONTH);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [showFilters, setShowFilters] =
    useState(false);

  const [notification, setNotification] =
    useState("");

  // =========================
  // TEMP FILTERS
  // =========================

  const [
    tempSearchText,
    setTempSearchText,
  ] = useState("");

  const [
    tempSpecialty,
    setTempSpecialty,
  ] = useState("ALL");

  const [
    tempSelectedDate,
    setTempSelectedDate,
  ] = useState("");

  // =========================
  // ACTIVE FILTERS
  // =========================

  const [searchText, setSearchText] =
    useState("");

  const [specialty, setSpecialty] =
    useState("ALL");

  const [selectedDate, setSelectedDate] =
    useState("");

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  useEffect(() => {
    axios
      .get(
        "http://localhost:8080/api/appointments"
      )
      .then((res) => {
        const formatted = res.data.map(
          (app) => {
            const start = formatDateBG(
              app.date,
              app.time
            );

            const status = isBefore(
              start,
              startOfToday()
            )
              ? "COMPLETED"
              : app.status;

            return {
              id: app._id,

              title: status,

              start,

              end: new Date(
                start.getTime() +
                  30 * 60000
              ),

              doctorId: app.doctorId,

              patientId: app.patientId,

              doctorName:
                app.doctorName ||
                app.doctorId ||
                "Doctor",

              patientName:
                app.patientName ||
                app.patientId ||
                "Patient",

              specialty:
                app.specialization ||
                "GENERAL_PRACTITIONER",

              date: app.date,
              time: app.time,

              status,
            };
          }
        );

        setEvents(formatted);
      })
      .catch((err) =>
        console.log(err)
      );
  }, []);

  // =========================
  // FILTERED EVENTS
  // =========================

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const search =
        searchText.toLowerCase();

      const matchesSearch =
        !search ||
        event.doctorName
          ?.toLowerCase()
          .includes(search) ||
        event.patientName
          ?.toLowerCase()
          .includes(search) ||
        event.doctorId
          ?.toLowerCase()
          .includes(search) ||
        event.patientId
          ?.toLowerCase()
          .includes(search);

      const matchesSpecialty =
        specialty === "ALL" ||
        event.specialty === specialty;

      let matchesDate = true;

      if (selectedDate) {
        const eventDate = format(
          event.start,
          "yyyy-MM-dd"
        );

        matchesDate =
          eventDate === selectedDate;
      }

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesDate
      );
    });
  }, [
    events,
    searchText,
    specialty,
    selectedDate,
  ]);

  // =========================
  // APPLY FILTERS
  // =========================

  const applyFilters = () => {
    setSearchText(tempSearchText);

    setSpecialty(tempSpecialty);

    setSelectedDate(tempSelectedDate);

    // GO TO DATE
    if (tempSelectedDate) {
      setCurrentDate(
        new Date(tempSelectedDate)
      );
    }

    // CHECK RESULTS
    const results = events.filter(
      (event) => {
        const search =
          tempSearchText.toLowerCase();

        const matchesSearch =
          !search ||
          event.doctorName
            ?.toLowerCase()
            .includes(search) ||
          event.patientName
            ?.toLowerCase()
            .includes(search) ||
          event.doctorId
            ?.toLowerCase()
            .includes(search) ||
          event.patientId
            ?.toLowerCase()
            .includes(search);

        const matchesSpecialty =
          tempSpecialty === "ALL" ||
          event.specialty ===
            tempSpecialty;

        let matchesDate = true;

        if (tempSelectedDate) {
          const eventDate = format(
            event.start,
            "yyyy-MM-dd"
          );

          matchesDate =
            eventDate ===
            tempSelectedDate;
        }

        return (
          matchesSearch &&
          matchesSpecialty &&
          matchesDate
        );
      }
    );

    if (results.length === 0) {
      setNotification(
        "No appointments found for this day. Try another date using calendar arrows."
      );

      setTimeout(() => {
        setNotification("");
      }, 4500);
    }

    setShowFilters(false);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setTempSearchText("");
    setTempSpecialty("ALL");
    setTempSelectedDate("");

    setSearchText("");
    setSpecialty("ALL");
    setSelectedDate("");
  };

  // =========================
  // EVENT COLORS
  // =========================

  const eventStyleGetter = (event) => {
  let background = "#3b82f6";

  if (event.status === "BOOKED") {
    background = "#3b82f6";
  }

  if (event.status === "CANCELLED") {
    background = "#f59e0b";
  }

  if (event.status === "COMPLETED") {
    background = "#22c55e";
  }

  return {
    style: {
      background,
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontWeight: "700",
      fontSize: "10px",
      padding: "2px 4px",
      minHeight: "22px",
    },
  };
};

  // =========================
  // CUSTOM EVENT
  // =========================

  const CustomEvent = ({
    event,
  }) => (
    <div
      onMouseEnter={() =>
        setHoveredEvent(event)
      }
      onMouseLeave={() =>
        setHoveredEvent(null)
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "800",
        }}
      >
        {event.time}
      </div>

      <div
        style={{
          fontSize: "9px",
        }}
      >
        {event.status}
      </div>
    </div>
  );

  // =========================
  // HEADER LABEL
  // =========================

  const headerLabel = () => {
    if (view === Views.MONTH) {
      return format(
        currentDate,
        "MMMM yyyy"
      );
    }

    if (view === Views.DAY) {
      return format(
        currentDate,
        "dd MMMM yyyy"
      );
    }

    const start = format(
      currentDate,
      "dd MMM"
    );

    const end = format(
      addDays(currentDate, 6),
      "dd MMM yyyy"
    );

    return `${start} - ${end}`;
  };

  // =========================
  // NAVIGATION
  // =========================

  const goPrev = () => {
    if (view === Views.DAY) {
      setCurrentDate(
        subDays(currentDate, 1)
      );
    } else if (
      view === Views.WEEK
    ) {
      setCurrentDate(
        subDays(currentDate, 7)
      );
    } else {
      setCurrentDate(
        subMonths(currentDate, 1)
      );
    }
  };

  const goNext = () => {
    if (view === Views.DAY) {
      setCurrentDate(
        addDays(currentDate, 1)
      );
    } else if (
      view === Views.WEEK
    ) {
      setCurrentDate(
        addDays(currentDate, 7)
      );
    } else {
      setCurrentDate(
        addMonths(currentDate, 1)
      );
    }
  };

  return (
    <div
      style={{
        background: "#f5f9ff",
        minHeight: "100vh",
        padding: "18px",
      }}
    >
      {/* NOTIFICATION */}

      {notification && (
        <div style={notificationStyle}>
          {notification}
        </div>
      )}

      {/* TOP BAR */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <button
            style={arrowBtn}
            onClick={goPrev}
          >
            ←
          </button>

          <button
            style={arrowBtn}
            onClick={goNext}
          >
            →
          </button>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#1e3a8a",
                fontWeight: "800",
              }}
            >
              {headerLabel()}
            </h2>

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Clinic Appointment Calendar
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            style={
              view === Views.DAY
                ? activeViewBtn
                : viewBtn
            }
            onClick={() =>
              setView(Views.DAY)
            }
          >
            Day
          </button>

          <button
            style={
              view === Views.WEEK
                ? activeViewBtn
                : viewBtn
            }
            onClick={() =>
              setView(Views.WEEK)
            }
          >
            Week
          </button>

          <button
            style={
              view === Views.MONTH
                ? activeViewBtn
                : viewBtn
            }
            onClick={() =>
              setView(Views.MONTH)
            }
          >
            Month
          </button>

          <button
            style={filterBtn}
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
          >
            ☰
          </button>
        </div>
      </div>

      {/* FILTERS */}

      {showFilters && (
        <div style={filterPopup}>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "18px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#1e3a8a",
              }}
            >
              Filters
            </h3>

            <button
              onClick={() =>
                setShowFilters(false)
              }
              style={closeBtn}
            >
              ✕
            </button>
          </div>

          <label style={labelStyle}>
            Doctor / Patient Name or ID
          </label>

          <input
            type="text"
            value={tempSearchText}
            onChange={(e) =>
              setTempSearchText(
                e.target.value
              )
            }
            placeholder="Search..."
            style={inputStyle}
          />

          <label style={labelStyle}>
            Choose Specialty
          </label>

          <select
            value={tempSpecialty}
            onChange={(e) =>
              setTempSpecialty(
                e.target.value
              )
            }
            style={inputStyle}
          >
            {specialties.map((sp) => (
              <option
                key={sp}
                value={sp}
              >
                {sp}
              </option>
            ))}
          </select>

          <label style={labelStyle}>
            Choose Date
          </label>

          <input
            type="date"
            value={tempSelectedDate}
            onChange={(e) =>
              setTempSelectedDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <button
              style={applyBtn}
              onClick={applyFilters}
            >
              Apply Filters
            </button>

            <button
              style={clearBtn}
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* CALENDAR */}

      <div
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "8px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    height: "calc(100vh - 140px)",
    overflow: "hidden",
  }}
>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          selectable
onSelectSlot={(slotInfo) => {
    console.log("SLOT CLICKED:", slotInfo);
  setSelectedSlot({
    start: slotInfo.start,
    end: slotInfo.end,
    action: "create",
  });
}}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) =>
            setCurrentDate(date)
          }
          view={view}
          onView={(v) => setView(v)}
          toolbar={false}
          step={30}
          timeslots={1}
          min={
            new Date(
              2026,
              1,
              1,
              8,
              0,
              0
            )
          }
          max={
            new Date(
              2026,
              1,
              1,
              22,
              0,
              0
            )
          }
          style={{
  height: "calc(100vh - 180px)",
  fontSize: "12px",
}}
          views={[
            Views.MONTH,
            Views.WEEK,
            Views.DAY,
          ]}
          eventPropGetter={
            eventStyleGetter
          }
          components={{
            event: CustomEvent,
            dayLayoutAlgorithm :"no-overlap"
          }}
        />
      </div>

      {/* POPUP */}

      {hoveredEvent && !selectedSlot && (
        <div style={popupStyle}>
          {/* doctor */}

          <div style={popupRow}>
            {renderDoctorAvatar(
  hoveredEvent.doctorName,
  hoveredEvent.doctorExists !== false
)}

            <div>
              <div style={popupName}>
                {
                  hoveredEvent.doctorName
                }
              </div>

              <div style={popupLabel}>
                Doctor
              </div>
            </div>
          </div>

          {selectedSlot && !hoveredEvent && (
  <div style={popupStyle}>
    <div style={popupName}>Empty slot</div>

    <p style={{ fontSize: "13px", color: "#64748b" }}>
      {selectedSlot.start.toLocaleString()}
    </p>

    <button
      style={applyBtn}
      onClick={() => {
        navigate("/book-appointment", {
          state: {
            start: selectedSlot.start,
            end: selectedSlot.end,
          },
        });
      }}
    >
      Book appointment
    </button>

    <button
      style={clearBtn}
      onClick={() => setSelectedSlot(null)}
    >
      Close
    </button>
  </div>
)}

          {/* patient */}

          <div style={popupRow}>
            <div
              style={patientAvatar}
            >
              {getInitials(
                hoveredEvent.patientName
              )}
            </div>

            <div>
              <div style={popupName}>
                {
                  hoveredEvent.patientName
                }
              </div>

              <div style={popupLabel}>
                Patient
              </div>
            </div>
          </div>

          {/* INFO */}

          <div
            style={{
              borderTop:
                "1px solid #e5e7eb",
              paddingTop: "12px",
              marginTop: "10px",
            }}
          >
            <p>
              <b>Date:</b>{" "}
              {hoveredEvent.date}
            </p>

            <p>
              <b>Time:</b>{" "}
              {hoveredEvent.time}
            </p>

            <p>
  <b>Status:</b>{" "}
  <span
    style={{
      fontWeight: "700",
      color:
        hoveredEvent.status === "BOOKED"
          ? "#3b82f6"
          : hoveredEvent.status === "CANCELLED"
          ? "#f59e0b"
          : hoveredEvent.status === "COMPLETED"
          ? "#22c55e"
          : "#64748b",
    }}
  >
    {hoveredEvent.status}
  </span>
</p>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// STYLES
// =========================

const notificationStyle = {
  position: "fixed",
  top: "25px",
  left: "50%",
  transform: "translateX(-50%)",
  background:
    "linear-gradient(135deg,#ef4444,#dc2626)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "14px",
  fontWeight: "700",
  zIndex: 9999,
  boxShadow:
    "0 15px 40px rgba(0,0,0,0.2)",
};

const arrowBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "none",
  background:
    "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "white",
  fontSize: "20px",
  cursor: "pointer",
  fontWeight: "700",
};

const viewBtn = {
  border: "none",
  background: "#e2e8f0",
  color: "#1e293b",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const activeViewBtn = {
  ...viewBtn,
  background:
    "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "white",
};

const filterBtn = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  border: "none",
  background:
    "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const filterPopup = {
  position: "fixed",
  top: "90px",
  right: "25px",
  width: "320px",
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.18)",
  zIndex: 999,
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#334155",
  fontWeight: "700",
  fontSize: "13px",
};

const inputStyle = {
  width: "100%",
  marginBottom: "14px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #dbeafe",
  outline: "none",
};

const applyBtn = {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const clearBtn = {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const popupStyle = {
  position: "fixed",
  right: "30px",
  top: "140px",
  width: "320px",
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.15)",
  zIndex: 999,
};

const popupRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
};

const popupName = {
  fontWeight: "700",
  color: "#0f172a",
};

const popupLabel = {
  fontSize: "13px",
  color: "#64748b",
};

const doctorAvatar = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  border: "3px solid #2563eb",
};

const patientAvatar = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg,#2563eb,#1e3a8a)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "20px",
};

const calendarStyles = `
.rbc-calendar {
  height: 100% !important;
  font-size: 12px !important;
}

.rbc-month-row {
  min-height: 90px !important;
}

.rbc-date-cell {
  padding-right: 4px !important;
  font-size: 11px !important;
}

.rbc-event {
  min-height: 18px !important;
  padding: 1px 4px !important;
}

.rbc-time-view {
  height: 100% !important;
}

.rbc-time-content {
  overflow: hidden !important;
}

.rbc-timeslot-group {
  min-height: 38px !important;
}

.rbc-day-slot .rbc-event {
  border-radius: 6px !important;
}

.rbc-toolbar {
  display: none !important;
}
`;
<style>{calendarStyles}</style>
export default Appointments;