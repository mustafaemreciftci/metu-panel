"use client";

import React from "react";
import moment from "moment";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { FaRegSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import Creatable from "react-select/creatable";
import { OrbitProgress } from "react-loading-indicators";
import { Calendar, momentLocalizer } from "react-big-calendar";

// components
import Sidebar from "@root/components/Sidebar";

// utils
import "moment/locale/tr.js";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

// library styles
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const rooms: any = [];
const courses: any = [];
const roomsExtra: any = [];
const instructors: any = [];

const localizer = momentLocalizer(moment);

export default function Class() {
  const router = useRouter();

  const [loaded, setLoaded] = React.useState(false);

  const [filterRoom, setFilterRoom] = React.useState(null);
  const [filterClass, setFilterClass] = React.useState(null);
  const [filterInstructor, setFilterInstructor] = React.useState(null);

  const [events, setEvents] = React.useState<any>([]);
  const [filterEvents, setFilterEvents] = React.useState(null);

  const [eventDeleteID, setEventDeleteID] = React.useState(null);
  const [eventDeleteDate, setEventDeleteDate] = React.useState(null);

  const [room, setRoom] = React.useState(null);
  const [_class, setClass] = React.useState(null);
  const [isExam, setIsExam] = React.useState(false);
  const [endTime, setEndTime] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(new Date());
  const [instructor, setInstructor] = React.useState(null);
  const [recurrence, setRecurrence] = React.useState(null);
  const [startDate, setStartDate] = React.useState(new Date());

  const [updateRoom, setUpdateRoom] = React.useState(null);
  const [_updateClass, setUpdateClass] = React.useState(null);
  const [updateIsExam, setUpdateIsExam] = React.useState(false);
  const [updateEndTime, setUpdateEndTime] = React.useState(null);
  const [updateStartTime, setUpdateStartTime] = React.useState(null);
  const [updateEndDate, setUpdateEndDate] = React.useState(new Date());
  const [updateInstructor, setUpdateInstructor] = React.useState(null);
  const [updateRecurrence, setUpdateRecurrence] = React.useState(null);
  const [updateStartDate, setUpdateStartDate] = React.useState(new Date());

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);

  const handleData = async () => {
    const _classResponse = await API.getClasses();
    const _instructorsResponse = await API.getInstructors();
    const _classRoomsResponse = await API.getClassRooms();

    if (_instructorsResponse) {
      for (
        let _instructorIndex = 0;
        _instructorIndex < _instructorsResponse.length;
        _instructorIndex++
      ) {
        instructors.push({
          value: JSON.stringify(_instructorIndex),
          label: _instructorsResponse[_instructorIndex].name,
        });
      }
    }

    if (_classResponse) {
      for (
        let _classIndex = 0;
        _classIndex < _classResponse.length;
        _classIndex++
      ) {
        courses.push({
          value: JSON.stringify(_classIndex),
          label: _classResponse[_classIndex].name,
        });
      }
    }

    if (_classRoomsResponse) {
      for (
        let _classRoomsIndex = 0;
        _classRoomsIndex < _classRoomsResponse.length;
        _classRoomsIndex++
      ) {
        rooms.push({
          value: JSON.stringify(_classRoomsIndex),
          label: _classRoomsResponse[_classRoomsIndex].name,
        });

        roomsExtra.push({
          value: JSON.stringify(_classRoomsIndex),
          label:
            _classRoomsResponse[_classRoomsIndex].name +
            " | Kapasite: " +
            _classRoomsResponse[_classRoomsIndex].capacity +
            ", Sınav Kapasitesi: " +
            _classRoomsResponse[_classRoomsIndex].exam_capacity,
        });
      }
    }
  };

  const handleClassEvents = async () => {
    const _events = [];
    const response = await API.getClassEvents();

    if (response && response.length > 0) {
      for (let _event of response) {
        const daysInBetween = moment(_event.end_date).diff(
          _event.start_date,
          "days"
        );

        const exclude_dates = [];

        if (_event.exclude_dates !== null) {
          for (const _date of _event.exclude_dates) {
            exclude_dates.push(moment(_date).format("YYYY-MM-DD"));
          }
        }

        if (_event.recurrence === "d" || _event.recurrence === "o") {
          for (let i = 0; i <= parseInt(daysInBetween.toString()); i += 1) {
            if (
              !exclude_dates.includes(
                moment(_event.start_date).add(i, "days").format("YYYY-MM-DD")
              )
            ) {
              _events.push({
                id: _event.id,
                title:
                  _event.class +
                  " - " +
                  _event.instructor +
                  " - " +
                  _event.room,
                start: moment(_event.start_date)
                  .add(i, "days")
                  .set({
                    hours: _event.start_time.slice(0, 2),
                    minutes: _event.start_time.slice(3, 5),
                  })
                  .toDate(),
                end: moment(_event.start_date)
                  .add(i, "days")
                  .set({
                    hour: parseInt(_event.end_time.slice(0, 2)),
                    minute: parseInt(_event.end_time.slice(3, 5)),
                  })
                  .toDate(),
                class: _event.class,
                room: _event.room,
                instructor: _event.instructor,
                is_exam: _event.is_exam,
              });
            }
          }
        } else if (_event.recurrence === "w") {
          for (let i = 0; i < Math.ceil(daysInBetween / 7); i++) {
            if (
              !exclude_dates.includes(
                moment(_event.start_date)
                  .add(i * 7, "days")
                  .format("YYYY-MM-DD")
              )
            ) {
              _events.push({
                id: _event.id,
                title:
                  _event.class +
                  " - " +
                  _event.instructor +
                  " - " +
                  _event.room,
                start: moment(_event.start_date)
                  .add(i * 7, "days")
                  .set({
                    hours: _event.start_time.slice(0, 2),
                    minutes: _event.start_time.slice(3, 5),
                  })
                  .toDate(),
                end: moment(_event.start_date)
                  .add(i * 7, "days")
                  .set({
                    hour: parseInt(_event.end_time.slice(0, 2)),
                    minute: parseInt(_event.end_time.slice(3, 5)),
                  })
                  .toDate(),
                class: _event.class,
                room: _event.room,
                instructor: _event.instructor,
                is_exam: _event.is_exam,
              });
            }
          }
        } else if (_event.recurrence === "m") {
          for (let i = 0; i < Math.ceil(daysInBetween / 30); i++) {
            if (
              !exclude_dates.includes(
                moment(_event.start_date)
                  .add(i * 30, "days")
                  .format("YYYY-MM-DD")
              )
            ) {
              _events.push({
                id: _event.id,
                title:
                  _event.class +
                  " - " +
                  _event.instructor +
                  " - " +
                  _event.room,
                start: moment(_event.start_date)
                  .add(i * 30, "days")
                  .set({
                    hours: _event.start_time.slice(0, 2),
                    minutes: _event.start_time.slice(3, 5),
                  })
                  .toDate(),
                end: moment(_event.start_date)
                  .add(i * 30, "days")
                  .set({
                    hour: parseInt(_event.end_time.slice(0, 2)),
                    minute: parseInt(_event.end_time.slice(3, 5)),
                  })
                  .toDate(),
                class: _event.class,
                room: _event.room,
                instructor: _event.instructor,
                is_exam: _event.is_exam,
              });
            }
          }
        }
      }
    }

    setEvents(_events);

    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  };

  const handleAuth = async () => {
    const res = await API.handleAuth();

    if (res.loggedIn === false) {
      router.push("/login");
    }
  };

  React.useEffect(() => {
    handleAuth();
    handleData();
    handleClassEvents();
  }, []);

  const handleFilterEvents = () => {
    const _filterEvents: any = [];

    if (
      filterRoom !== null ||
      filterClass !== null ||
      filterInstructor !== null
    ) {
      if (
        filterRoom !== null &&
        filterClass !== null &&
        filterInstructor !== null
      ) {
        for (let _event of events) {
          if (
            (_event as any).room === filterRoom &&
            (_event as any).class === filterClass &&
            (_event as any).instructor === filterInstructor
          ) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom === null &&
        filterClass !== null &&
        filterInstructor !== null
      ) {
        for (let _event of events) {
          if (
            (_event as any).class === filterClass &&
            (_event as any).instructor === filterInstructor
          ) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom !== null &&
        filterClass === null &&
        filterInstructor !== null
      ) {
        for (let _event of events) {
          if (
            (_event as any).room === filterRoom &&
            (_event as any).instructor === filterInstructor
          ) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom !== null &&
        filterClass !== null &&
        filterInstructor === null
      ) {
        for (let _event of events) {
          if (
            (_event as any).room === filterRoom &&
            (_event as any).class === filterClass
          ) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom !== null &&
        filterClass === null &&
        filterInstructor === null
      ) {
        for (let _event of events) {
          if ((_event as any).room === filterRoom) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom === null &&
        filterClass !== null &&
        filterInstructor === null
      ) {
        for (let _event of events) {
          if ((_event as any).class === filterClass) {
            _filterEvents.push(_event);
          }
        }
      } else if (
        filterRoom === null &&
        filterClass === null &&
        filterInstructor !== null
      ) {
        for (let _event of events) {
          if ((_event as any).instructor === filterInstructor) {
            _filterEvents.push(_event);
          }
        }
      }

      setFilterEvents(_filterEvents);
    } else {
      setFilterEvents(null);
    }
  };

  React.useEffect(() => {
    handleFilterEvents();
  }, [filterRoom, filterClass, filterInstructor]);

  const onSelectEvent = (event: { id: string; start: Date }) => {
    setEventDeleteID(event.id as any);
    setEventDeleteDate(moment(event.start).format("YYYY-MM-DD") as any);

    setEditModalVisible(true);
  };

  const [currentView, setCurrentView] = React.useState("month");
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showFilters, setShowFilters] = React.useState(false);

  if (loaded) {
    return (
      <div className="w-full md:w-[88vw] md:pl-[14vw] bg-white min-h-screen">
        <Sidebar />

        {/* Header - responsive */}
        <div className="px-4 md:px-6 py-8 md:py-16 pt-16 md:pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-baseline">
                <h1 className="text-lg md:text-2xl text-gray-500">
                  {moment(currentDate).format("YYYY")}
                </h1>

                <h1 className="text-2xl md:text-4xl text-black font-bold">
                  {moment(currentDate).format("MMMM")}
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setModalVisible(true)}
                className="text-sm bg-[#22C2BA] text-white px-4 py-2 rounded-xl w-full sm:w-auto"
              >
                + Ders Ekle
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm bg-[#7C3AED] text-white px-4 py-2 rounded-xl space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span>Filtrele</span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#F0F0F0] rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label className="block text-lg font-medium text-black">
                          Yer
                        </label>
                        <Creatable
                          onChange={(data) => {
                            if (data?.label === "Hepsi") {
                              setFilterRoom(null);
                            } else {
                              setFilterRoom(data?.label as any);
                            }
                          }}
                          value={{
                            label: filterRoom === null ? "Hepsi" : filterRoom,
                          }}
                          placeholder={"Yer seçin"}
                          options={[{ value: "all", label: "Hepsi" }, ...rooms]}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "#E4E1F4",
                              minHeight: "36px",
                              border: "1px solid #7057DD",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }),
                            input: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            singleValue: (styles, { data }) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 99,
                              maxHeight: "150px",
                            }),
                            menuList: (base) => ({
                              ...base,
                              maxHeight: "150px",
                              overflowY: "auto",
                            }),
                          }}
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="block text-lg font-medium text-black">
                          Ders
                        </label>
                        <Creatable
                          onChange={(data) => {
                            if (data?.label === "Hepsi") {
                              setFilterClass(null);
                            } else {
                              setFilterClass(data?.label as any);
                            }
                          }}
                          value={{
                            label: filterClass === null ? "Hepsi" : filterClass,
                          }}
                          placeholder={"Ders seçin"}
                          options={[
                            { value: "all", label: "Hepsi" },
                            ...courses,
                          ]}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "#E4E1F4",
                              minHeight: "36px",
                              border: "1px solid #7057DD",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }),
                            input: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            singleValue: (styles, { data }) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 99,
                              maxHeight: "150px",
                            }),
                            menuList: (base) => ({
                              ...base,
                              maxHeight: "150px",
                              overflowY: "auto",
                            }),
                          }}
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="block text-lg font-medium text-black">
                          Hoca
                        </label>
                        <Creatable
                          onChange={(data) => {
                            if (data?.label === "Hepsi") {
                              setFilterInstructor(null);
                            } else {
                              setFilterInstructor(data?.label as any);
                            }
                          }}
                          value={{
                            label:
                              filterInstructor === null
                                ? "Hepsi"
                                : filterInstructor,
                          }}
                          placeholder={"Hoca seçin"}
                          options={[
                            { value: "all", label: "Hepsi" },
                            ...instructors,
                          ]}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "#E4E1F4",
                              minHeight: "36px",
                              border: "1px solid #7057DD",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }),
                            input: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            singleValue: (styles, { data }) => ({
                              ...styles,
                              color: "#7057DD",
                            }),
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 99,
                              maxHeight: "150px",
                            }),
                            menuList: (base) => ({
                              ...base,
                              maxHeight: "150px",
                              overflowY: "auto",
                            }),
                          }}
                        />
                      </div>

                      <div className="flex justify-around space-x-2 pt-2">
                        <button
                          onClick={() => {
                            setFilterRoom(null);
                            setFilterClass(null);
                            setFilterInstructor(null);
                            setFilterEvents(null);
                          }}
                          className="text-md text-[#7057DD] bg-[#E4E1F4] px-3 py-1 flex-1 rounded hover:bg-[#7057DD] hover:text-[#E4E1F4]"
                        >
                          Temizle
                        </button>

                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-md bg-[#7057DD] text-white px-3 py-1 flex-1 rounded hover:bg-[#E4E1F4] hover:text-[#7057DD]"
                        >
                          Uygula
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid - responsive */}
        <div className="px-2 md:p-2 flex justify-center items-center min-h-[calc(100vh-300px)]">
          <div className="bg-white w-full">
            {/* Calendar Toolbar - responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0 px-2">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    const newDate = moment(currentDate)
                      .subtract(1, "month")
                      .toDate();
                    setCurrentDate(newDate);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-base md:text-lg font-medium text-gray-900 min-w-[150px] md:min-w-[200px] text-center">
                  {moment(currentDate).format("MMMM YYYY")}
                </span>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    const newDate = moment(currentDate)
                      .add(1, "month")
                      .toDate();
                    setCurrentDate(newDate);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1">
                <button
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded font-medium ${
                    currentView === "month"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentView("month")}
                >
                  Ay
                </button>
                <button
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded font-medium ${
                    currentView === "week"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentView("week")}
                >
                  Hafta
                </button>
                <button
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded font-medium ${
                    currentView === "day"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentView("day")}
                >
                  Gün
                </button>
              </div>
            </div>

            {/* Conditional rendering based on view */}
            {currentView === "month" ? (
              /* Calendar Grid - responsive */
              <div className="border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-320px)] min-h-[400px]">
                {/* Days of week header - responsive */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {[
                    { full: "Pazartesi", short: "Pzt" },
                    { full: "Salı", short: "Sal" },
                    { full: "Çarşamba", short: "Çar" },
                    { full: "Perşembe", short: "Per" },
                    { full: "Cuma", short: "Cum" },
                    { full: "Cumartesi", short: "Cmt" },
                    { full: "Pazar", short: "Paz" },
                  ].map((day) => (
                    <div
                      key={day.full}
                      className="p-2 md:p-4 text-center text-xs md:text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                    >
                      <span className="hidden sm:inline">{day.full}</span>
                      <span className="sm:hidden">{day.short}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar weeks - responsive */}
                {[...Array(6)].map((_, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="grid grid-cols-7 border-t border-gray-200"
                    style={{
                      height: `calc((100vh - 380px) / 6)`,
                      minHeight: "60px",
                    }}
                  >
                    {[...Array(7)].map((_, dayIndex) => {
                      const startOfMonth = moment(currentDate).startOf("month");
                      const startOfWeek = startOfMonth
                        .clone()
                        .startOf("week")
                        .add(1, "day"); // Monday start
                      const dayDate = startOfWeek
                        .clone()
                        .add(weekIndex * 7 + dayIndex, "days");
                      const dayNumber = dayDate.date();
                      const isCurrentMonth =
                        dayDate.month() === moment(currentDate).month();
                      const isToday = dayDate.isSame(moment(), "day");

                      return (
                        <div
                          key={dayIndex}
                          className={`p-1 md:p-3 border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 flex flex-col ${
                            !isCurrentMonth ? "bg-gray-50" : ""
                          } ${isToday ? "bg-yellow-50" : ""}`}
                          onClick={() => setModalVisible(true)}
                        >
                          <div className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 text-center">
                            {dayNumber}
                          </div>

                          {/* Render actual events - responsive */}
                          <div className="space-y-1 flex-1 flex flex-col justify-start md:justify-center">
                            {(filterEvents !== null ? filterEvents : events)
                              .filter((event: any) => {
                                return moment(event.start).isSame(
                                  dayDate,
                                  "day"
                                );
                              })
                              .slice(0, 3) // Limit events on mobile
                              .map((event: any, index: number) => {
                                const classCode =
                                  event.class?.substring(0, 6) || "UNKNOWN";
                                const shortCode = classCode.substring(0, 4); // Shorter for mobile
                                const coursePrefix = classCode.substring(0, 3);

                                const colorMap: { [key: string]: string } = {
                                  EEE: "bg-blue-100 text-blue-800",
                                  MATH: "bg-yellow-100 text-yellow-800",
                                  PHYS: "bg-purple-100 text-purple-800",
                                  CHEM: "bg-pink-100 text-pink-800",
                                  ME: "bg-green-100 text-green-800",
                                  CE: "bg-orange-100 text-orange-800",
                                  IE: "bg-indigo-100 text-indigo-800",
                                };

                                const colorClass =
                                  colorMap[coursePrefix] ||
                                  "bg-gray-100 text-gray-800";

                                if (event.is_exam) {
                                  return (
                                    <div
                                      key={index}
                                      className="text-xs px-1 md:px-2 py-1 rounded-sm cursor-pointer hover:opacity-80 bg-red-100 text-red-800"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectEvent(event);
                                      }}
                                    >
                                      <span className="hidden md:inline">
                                        {classCode} (Sınav)
                                      </span>
                                      <span className="md:hidden">
                                        {shortCode}
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`text-xs px-1 md:px-2 py-1 rounded-sm cursor-pointer hover:opacity-80 ${colorClass}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectEvent(event);
                                    }}
                                  >
                                    <span className="hidden md:inline">
                                      {classCode}
                                    </span>
                                    <span className="md:hidden">
                                      {shortCode}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              /* Use original Calendar component for week/day views - responsive */
              <div className="flex justify-center items-center h-[60vh] md:h-[75vh]">
                <Calendar
                  className="h-full w-full text-xs md:text-sm"
                  messages={{
                    date: "Tarih",
                    time: "Zaman",
                    event: "Ders",
                    allDay: "Tüm Gün",
                    week: "Hafta",
                    work_week: "İş Günü",
                    day: "Gün",
                    month: "Ay",
                    previous: "‹",
                    next: "›",
                    yesterday: "Dün",
                    tomorrow: "Yarın",
                    today: "Bugün",
                    agenda: "Ajanda",
                    showMore: (count) => "+" + count + " etkinlik",
                    noEventsInRange: "Bu aralıkta dolu gün bulunamadı.",
                  }}
                  events={filterEvents !== null ? filterEvents : events}
                  selectable={true}
                  startAccessor="start"
                  localizer={localizer}
                  date={currentDate}
                  onNavigate={(date) => setCurrentDate(date)}
                  view={currentView as any}
                  onView={(view) => setCurrentView(view)}
                  onSelectSlot={() => {
                    setModalVisible(true);
                  }}
                  onSelectEvent={onSelectEvent}
                  eventPropGetter={(event: {
                    id: string;
                    start: Date;
                    class: any;
                    is_exam: boolean;
                  }) => {
                    const classCode = event.class?.substring(0, 6) || "UNKNOWN";

                    let backgroundColor;
                    let textColor = "#000000";

                    if (event.is_exam) {
                      backgroundColor = "#fca5a5"; // Red for exams
                    } else {
                      // Different colors based on course code
                      const colorMap: { [key: string]: string } = {
                        EEE: "#DD052B", // Blue
                        MATH: "#000", // Indigo
                        PHYS: "#DD052B", // Purple
                        CHEM: "#000", // Yellow
                        ME: "#DD052B", // Green
                        CE: "#000", // Orange
                        IE: "#DD052B", // Light purple
                      };

                      const coursePrefix = classCode.substring(0, 3);
                      backgroundColor = colorMap[coursePrefix] || "#e5e7eb";
                    }

                    return {
                      className: "",
                      style: {
                        backgroundColor,
                        color: textColor,
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "2px 6px",
                        margin: "1px",
                      },
                    };
                  }}
                  components={{
                    event: ({ event }: { event: any }) => (
                      <div className="text-xs font-medium truncate">
                        {event.class?.substring(0, 6) || "UNKNOWN"}
                      </div>
                    ),
                    toolbar: () => null, // Hide default toolbar since we have custom one
                  }}
                  views={["month", "week", "day"]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modals - responsive */}
        {/* Add Modal - Enhanced responsive */}
        <ReactModal
          style={{
            overlay: {
              zIndex: 99,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "min(600px, 95vw)",
              height: "min(700px, 90vh)",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "none",
              padding: "20px",
              overflow: "auto",
            },
          }}
          ariaHideApp={false}
          isOpen={modalVisible}
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                Ders ekleme
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setModalVisible(false)}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {/* Form fields - responsive layout */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Yer</label>
                <Creatable
                  onChange={(data: any) =>
                    setRoom(data?.label?.split("|")[0].trim())
                  }
                  placeholder={"Seçiniz"}
                  options={roomsExtra}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Ders</label>
                <Creatable
                  onChange={(data: any) => setClass(data?.label)}
                  placeholder={"Seçiniz"}
                  options={courses}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Hoca</label>
                <Creatable
                  onChange={(data: any) => setInstructor(data?.label)}
                  placeholder={"Seçiniz"}
                  options={instructors}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Tekrar sıklığı
                </label>
                <Creatable
                  onChange={(data: any) => setRecurrence(data?.value)}
                  placeholder={"Seçiniz"}
                  options={[
                    { value: "o", label: "Tek sefer" },
                    { value: "d", label: "Her gün" },
                    { value: "w", label: "Her hafta" },
                    { value: "m", label: "Her ay" },
                  ]}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Başlangıç Tarihi
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date!)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-sm focus:outline-none"
                    placeholderText="Seçiniz"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Bitiş Tarihi
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date!)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-sm focus:outline-none"
                    placeholderText="Seçiniz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Başlangıç
                  </label>
                  <Creatable
                    onChange={(data: any) => setStartTime(data?.value)}
                    placeholder={"Seçiniz"}
                    menuPortalTarget={document.body}
                    options={[
                      { value: "8:40:00", label: "8:40" },
                      { value: "9:40:00", label: "9:40" },
                      { value: "10:40:00", label: "10:40" },
                      { value: "11:40:00", label: "11:40" },
                      { value: "12:40:00", label: "12:40" },
                      { value: "13:40:00", label: "13:40" },
                      { value: "14:40:00", label: "14:40" },
                      { value: "15:40:00", label: "15:40" },
                      { value: "16:40:00", label: "16:40" },
                      { value: "17:40:00", label: "17:40" },
                      { value: "18:40:00", label: "18:40" },
                      { value: "19:40:00", label: "19:40" },
                      { value: "20:40:00", label: "20:40" },
                      { value: "21:40:00", label: "21:40" },
                      { value: "22:40:00", label: "22:40" },
                      { value: "23:40:00", label: "23:40" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#F5F5F5",
                        minHeight: "48px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#999999",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Bitiş
                  </label>
                  <Creatable
                    onChange={(data: any) => setEndTime(data?.value)}
                    placeholder={"Seçiniz"}
                    menuPortalTarget={document.body}
                    options={[
                      { value: "8:40:00", label: "8:40" },
                      { value: "9:40:00", label: "9:40" },
                      { value: "10:40:00", label: "10:40" },
                      { value: "11:40:00", label: "11:40" },
                      { value: "12:40:00", label: "12:40" },
                      { value: "13:40:00", label: "13:40" },
                      { value: "14:40:00", label: "14:40" },
                      { value: "15:40:00", label: "15:40" },
                      { value: "16:40:00", label: "16:40" },
                      { value: "17:40:00", label: "17:40" },
                      { value: "18:40:00", label: "18:40" },
                      { value: "19:40:00", label: "19:40" },
                      { value: "20:40:00", label: "20:40" },
                      { value: "21:40:00", label: "21:40" },
                      { value: "22:40:00", label: "22:40" },
                      { value: "23:40:00", label: "23:40" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#F5F5F5",
                        minHeight: "48px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#999999",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <input
                  type="checkbox"
                  id="isExam"
                  checked={isExam}
                  onChange={() => setIsExam(!isExam)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isExam"
                  className="text-sm text-black leading-relaxed"
                >
                  Bu etkinlik bir sınav mı?
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 sticky bottom-0 bg-white">
              <button
                onClick={async () => {
                  if (
                    _class !== null &&
                    instructor !== null &&
                    startDate !== null &&
                    endDate !== null &&
                    startTime !== null &&
                    endTime !== null &&
                    recurrence !== null &&
                    room !== null
                  ) {
                    if (recurrence === "o") {
                      if (
                        startDate.getDate() !== undefined &&
                        endDate.getDate() !== undefined &&
                        startDate.getDate() === endDate.getDate()
                      ) {
                        await API.createClassEvent(
                          _class,
                          instructor,
                          startDate,
                          endDate,
                          startTime,
                          endTime,
                          recurrence,
                          room,
                          isExam
                        );
                        handleClassEvents();
                        setModalVisible(false);
                      } else {
                        toast.error(
                          "Tek seferlik işlemlerde tarihler aynı gün olmalıdır!",
                          {
                            theme: "light",
                            autoClose: 3000,
                            draggable: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            progress: undefined,
                            hideProgressBar: false,
                            position: "bottom-center",
                          }
                        );
                      }
                    } else {
                      await API.createClassEvent(
                        _class,
                        instructor,
                        startDate,
                        endDate,
                        startTime,
                        endTime,
                        recurrence,
                        room,
                        isExam
                      );
                      handleClassEvents();
                      setModalVisible(false);
                    }
                  }
                }}
                className="w-full md:w-auto bg-[#22C2BA] text-white px-6 py-3 rounded-lg hover:bg-[#1da39a] flex items-center justify-center space-x-2"
              >
                <span>+ Kaydet</span>
              </button>
            </div>
          </div>
        </ReactModal>

        {/* Edit Modal - Enhanced responsive */}
        <ReactModal
          style={{
            overlay: {
              zIndex: 99,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "min(600px, 95vw)",
              height: "min(700px, 90vh)",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "none",
              padding: "20px",
              overflow: "auto",
            },
          }}
          ariaHideApp={false}
          isOpen={editModalVisible}
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                Ders - Etkinlik Düzenle
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditModalVisible(false)}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {/* Form fields - responsive layout */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Yer</label>
                <Creatable
                  onChange={(data: any) =>
                    setUpdateRoom(data?.label?.split("|")[0].trim())
                  }
                  placeholder={"Seçiniz"}
                  options={roomsExtra}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Ders</label>
                <Creatable
                  onChange={(data: any) => setUpdateClass(data?.label)}
                  placeholder={"Seçiniz"}
                  options={courses}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">Hoca</label>
                <Creatable
                  onChange={(data: any) => setUpdateInstructor(data?.label)}
                  placeholder={"Seçiniz"}
                  options={instructors}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Tekrar sıklığı
                </label>
                <Creatable
                  onChange={(data: any) => setUpdateRecurrence(data?.value)}
                  placeholder={"Seçiniz"}
                  options={[
                    { value: "o", label: "Tek sefer" },
                    { value: "d", label: "Her gün" },
                    { value: "w", label: "Her hafta" },
                    { value: "m", label: "Her ay" },
                  ]}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#F5F5F5",
                      minHeight: "48px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#999999",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99,
                      maxHeight: "150px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Başlangıç Tarihi
                  </label>
                  <DatePicker
                    selected={updateStartDate}
                    onChange={(date) => setUpdateStartDate(date!)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-sm focus:outline-none"
                    placeholderText="Seçiniz"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Bitiş Tarihi
                  </label>
                  <DatePicker
                    selected={updateEndDate}
                    onChange={(date) => setUpdateEndDate(date!)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-sm focus:outline-none"
                    placeholderText="Seçiniz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Başlangıç
                  </label>
                  <Creatable
                    onChange={(data: any) => setUpdateStartTime(data?.value)}
                    placeholder={"Seçiniz"}
                    menuPortalTarget={document.body}
                    options={[
                      { value: "8:40:00", label: "8:40" },
                      { value: "9:40:00", label: "9:40" },
                      { value: "10:40:00", label: "10:40" },
                      { value: "11:40:00", label: "11:40" },
                      { value: "12:40:00", label: "12:40" },
                      { value: "13:40:00", label: "13:40" },
                      { value: "14:40:00", label: "14:40" },
                      { value: "15:40:00", label: "15:40" },
                      { value: "16:40:00", label: "16:40" },
                      { value: "17:40:00", label: "17:40" },
                      { value: "18:40:00", label: "18:40" },
                      { value: "19:40:00", label: "19:40" },
                      { value: "20:40:00", label: "20:40" },
                      { value: "21:40:00", label: "21:40" },
                      { value: "22:40:00", label: "22:40" },
                      { value: "23:40:00", label: "23:40" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#F5F5F5",
                        minHeight: "48px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#999999",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Bitiş
                  </label>
                  <Creatable
                    onChange={(data: any) => setUpdateEndTime(data?.value)}
                    placeholder={"Seçiniz"}
                    menuPortalTarget={document.body}
                    options={[
                      { value: "8:40:00", label: "8:40" },
                      { value: "9:40:00", label: "9:40" },
                      { value: "10:40:00", label: "10:40" },
                      { value: "11:40:00", label: "11:40" },
                      { value: "12:40:00", label: "12:40" },
                      { value: "13:40:00", label: "13:40" },
                      { value: "14:40:00", label: "14:40" },
                      { value: "15:40:00", label: "15:40" },
                      { value: "16:40:00", label: "16:40" },
                      { value: "17:40:00", label: "17:40" },
                      { value: "18:40:00", label: "18:40" },
                      { value: "19:40:00", label: "19:40" },
                      { value: "20:40:00", label: "20:40" },
                      { value: "21:40:00", label: "21:40" },
                      { value: "22:40:00", label: "22:40" },
                      { value: "23:40:00", label: "23:40" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#F5F5F5",
                        minHeight: "48px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#999999",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <input
                  type="checkbox"
                  id="updateIsExam"
                  checked={updateIsExam}
                  onChange={() => setUpdateIsExam(!updateIsExam)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="updateIsExam"
                  className="text-sm text-black leading-relaxed"
                >
                  Bu etkinlik bir sınav mı?
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-4 space-y-3 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full md:w-auto"
                  onClick={async () => {
                    await API.deleteClassEvent(eventDeleteID, eventDeleteDate);
                    handleClassEvents();
                    setEditModalVisible(false);
                  }}
                >
                  Sadece Bunu Sil
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full md:w-auto"
                  onClick={async () => {
                    await API.deleteClassEvents(eventDeleteID);
                    handleClassEvents();
                    setEditModalVisible(false);
                  }}
                >
                  Hepsini Sil
                </button>
              </div>

              <button
                onClick={async () => {
                  if (
                    _updateClass !== null &&
                    updateInstructor !== null &&
                    updateStartDate !== null &&
                    updateEndDate !== null &&
                    updateStartTime !== null &&
                    updateEndTime !== null &&
                    updateRecurrence !== null &&
                    updateRoom !== null
                  ) {
                    if (recurrence === "o") {
                      if (
                        startDate.getDate() !== undefined &&
                        endDate.getDate() !== undefined &&
                        startDate.getDate() === endDate.getDate()
                      ) {
                        await API.updateClassEvent(
                          eventDeleteID,
                          _updateClass,
                          updateInstructor,
                          updateStartDate,
                          updateEndDate,
                          updateStartTime,
                          updateEndTime,
                          updateRecurrence,
                          updateRoom,
                          updateIsExam
                        );
                        handleClassEvents();
                        setEditModalVisible(false);
                      } else {
                        toast.error(
                          "Tek seferlik işlemlerde tarihler aynı gün olmalıdır!",
                          {
                            theme: "light",
                            autoClose: 3000,
                            draggable: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            progress: undefined,
                            hideProgressBar: false,
                            position: "bottom-center",
                          }
                        );
                      }
                    } else {
                      await API.updateClassEvent(
                        eventDeleteID,
                        _updateClass,
                        updateInstructor,
                        updateStartDate,
                        updateEndDate,
                        updateStartTime,
                        updateEndTime,
                        updateRecurrence,
                        updateRoom,
                        updateIsExam
                      );
                      handleClassEvents();
                      setEditModalVisible(false);
                    }
                  }
                }}
                className="bg-[#22C2BA] text-white px-6 py-2 rounded-lg hover:bg-[#1da39a] flex items-center justify-center space-x-2 w-full md:w-auto"
              >
                <span>Güncelle</span>
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  } else {
    return (
      <div className="w-[88vw] h-[100vh] pl-[14vw]">
        <Sidebar />

        <div className="h-[88vh] flex items-center justify-center">
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }
}
