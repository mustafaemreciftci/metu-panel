"use client";

import React from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

// components
import Sidebar from "@root/components/Sidebar";

// utils
import "moment/locale/tr.js";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

export default function ClassSchedule() {
  const router = useRouter();
  const [loaded, setLoaded] = React.useState(false);
  const [events, setEvents] = React.useState<any>([]);
  const [rooms, setRooms] = React.useState<any>([]);
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Time slots exactly as in the image
  const timeSlots = [
    "08:40",
    "09:40",
    "10:40",
    "11:40",
    "12:40",
    "13:40",
    "14:40",
    "15:40",
    "16:40",
    "17:40",
    "18:40",
    "19:40",
    "20:40",
    "21:40",
  ];

  const handleAuth = async () => {
    const res = await API.handleAuth();
    if (res.loggedIn === false) {
      router.push("/login");
    }
  };

  const handleData = async () => {
    const _classRoomsResponse = await API.getClassRooms();
    const _classEventsResponse = await API.getClassEvents();

    if (_classRoomsResponse) {
      const roomList = _classRoomsResponse.map((room: any) => ({
        name: room.name,
        capacity: room.capacity,
        exam_capacity: room.exam_capacity,
      }));
      setRooms(roomList);
    }

    if (_classEventsResponse) {
      setEvents(_classEventsResponse);
    }

    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  };

  React.useEffect(() => {
    handleAuth();
    handleData();
  }, []);

  // Add useEffect to refresh data when currentDate changes
  React.useEffect(() => {
    if (loaded) {
      handleData();
    }
  }, [currentDate]);

  // Get event for specific time and room on the current date
  const getEventForSlot = (timeSlot: string, roomName: string) => {
    return events.find((event: any) => {
      const eventTime = event.start_time?.slice(0, 5);
      const eventDate = moment(event.start_date);
      const currentDateMoment = moment(currentDate);

      // Check if event is on the current date (considering recurrence)
      let isOnDate = false;

      if (event.recurrence === "w") {
        // For weekly recurrence, check if the day of week matches
        isOnDate =
          eventDate.day() === currentDateMoment.day() &&
          currentDateMoment.isBetween(
            eventDate,
            moment(event.end_date),
            "day",
            "[]"
          );
      } else if (event.recurrence === "d") {
        // For daily recurrence, check if current date is within the range
        isOnDate = currentDateMoment.isBetween(
          eventDate,
          moment(event.end_date),
          "day",
          "[]"
        );
      } else if (event.recurrence === "m") {
        // For monthly recurrence, check if the day of month matches
        isOnDate =
          eventDate.date() === currentDateMoment.date() &&
          currentDateMoment.isBetween(
            eventDate,
            moment(event.end_date),
            "day",
            "[]"
          );
      } else {
        // For one-time events (recurrence === 'o')
        isOnDate = eventDate.isSame(currentDateMoment, "day");
      }

      return eventTime === timeSlot && event.room === roomName && isOnDate;
    });
  };

  if (loaded) {
    return (
      <div className="w-full md:w-[88vw] md:pl-[14vw] bg-white min-h-screen">
        <Sidebar />

        {/* Header - responsive */}
        <div className="px-4 md:px-6 py-6 md:py-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-2xl text-gray-500 mb-2">
                Sınıf Takvimi
              </h2>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl md:text-4xl font-bold text-black">
                  {moment(currentDate).format("D MMMM dddd")}
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end space-x-2">
              <button
                className="p-2 hover:bg-gray-100 rounded"
                onClick={() => {
                  const newDate = moment(currentDate)
                    .subtract(1, "day")
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
              <button
                className="text-sm md:text-md px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 font-bold"
                onClick={() => setCurrentDate(new Date())}
              >
                Bugün
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded"
                onClick={() => {
                  const newDate = moment(currentDate).add(1, "day").toDate();
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
          </div>
        </div>

        {/* Responsive Timetable */}
        <div className="px-4 md:px-6">
          {/* Mobile Layout - Cards */}
          <div className="md:hidden space-y-4">
            {rooms.map((room: any) => (
              <div
                key={room.name}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-red-600 mb-3">
                  {room.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((timeSlot) => {
                    const event = getEventForSlot(timeSlot, room.name);
                    return (
                      <div
                        key={`${room.name}-${timeSlot}`}
                        className="flex flex-col items-center p-2 rounded"
                      >
                        <div className="text-xs text-gray-600 mb-1">
                          {timeSlot}
                        </div>
                        {event ? (
                          event.is_exam ? (
                            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium w-full text-center">
                              {event.class?.substring(0, 6) || "EEE221"}
                            </div>
                          ) : (
                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-medium w-full text-center">
                              {event.class?.substring(0, 6) || "EEE301"}
                            </div>
                          )
                        ) : (
                          <div className="bg-[#F0F0F0] text-[#878787] text-xs px-2 py-1 rounded font-medium w-full text-center">
                            Müsait
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - Table */}
          <div className="hidden md:block">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                {/* Header Row */}
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-3 font-semibold text-gray-700 w-32">
                      Sınıf
                    </th>
                    {timeSlots.map((timeSlot) => (
                      <th
                        key={timeSlot}
                        className="text-center p-3 font-semibold text-gray-700 min-w-[100px]"
                      >
                        {timeSlot}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Room Rows */}
                <tbody>
                  {rooms.map((room: any, roomIndex: number) => (
                    <tr key={room.name} className="border-b border-gray-300">
                      {/* Room Name */}
                      <td className="p-3 font-medium text-red-600">
                        {room.name}
                      </td>

                      {/* Time Slots */}
                      {timeSlots.map((timeSlot) => {
                        const event = getEventForSlot(timeSlot, room.name);

                        return (
                          <td
                            key={`${room.name}-${timeSlot}`}
                            className="p-3 text-center h-16"
                          >
                            {event ? (
                              event.is_exam ? (
                                <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                                  {event.class?.substring(0, 6) || "EEE221"}
                                </div>
                              ) : (
                                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-medium">
                                  {event.class?.substring(0, 6) || "EEE301"}
                                </div>
                              )
                            ) : (
                              <div className="bg-[#F0F0F0] text-[#878787] text-xs px-2 py-1 rounded font-medium">
                                Müsait
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full md:w-[88vw] h-[100vh] md:pl-[14vw]">
        <Sidebar />
        <div className="h-[88vh] flex items-center justify-center">
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }
}
