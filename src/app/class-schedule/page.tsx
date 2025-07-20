"use client";

import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";
import Header from "@root/components/Header";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

// Types
interface Room {
  value: string;
  label: string;
}

interface ClassEvent {
  start: number;
  end: number;
  room: string;
  class: string;
  instructor: string;
  is_exam?: boolean;
}

const HOURS = [
  "08.40",
  "09.40",
  "10.40",
  "11.40",
  "12.40",
  "13.40",
  "14.40",
  "15.40",
  "16.40",
  "17.40",
  "18.40",
  "19.40",
  "20.40",
  "21.40",
  "22.40",
  "23.40",
];

export default function Schedule() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<ClassEvent[]>([]);
  const [date, setDate] = useState(moment());
  const [loaded, setLoaded] = useState(false);

  // Fetch rooms data
  const fetchRooms = useCallback(async () => {
    try {
      const classRoomsResponse = await API.getClassRooms();
      const formattedRooms = classRoomsResponse.map(
        (room: any, index: number) => ({
          value: String(index),
          label: room.name,
        })
      );
      setRooms(formattedRooms);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  // Fetch and process events
  const fetchEvents = useCallback(async () => {
    try {
      const response = await API.getClassEvents();
      const processedEvents: ClassEvent[] = [];

      response.forEach((event: any) => {
        const daysInBetween = moment(event.end_date).diff(
          event.start_date,
          "days"
        );
        const excludeDates =
          event.exclude_dates?.map((d: string) =>
            moment(d).format("YYYY-MM-DD")
          ) || [];

        const processEvent = (currentDate: moment.Moment) => {
          if (
            !excludeDates.includes(currentDate.format("YYYY-MM-DD")) &&
            currentDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
          ) {
            processedEvents.push({
              start: parseInt(event.start_time.slice(0, 2)),
              end: parseInt(event.end_time.slice(0, 2)),
              room: event.room,
              class: event.class,
              instructor: event.instructor,
              is_exam: event.is_exam,
            });
          }
        };

        switch (event.recurrence) {
          case "d":
            for (let i = 0; i <= daysInBetween; i++) {
              processEvent(moment(event.start_date).add(i, "days"));
            }
            break;
          case "w":
            for (let i = 0; i < Math.ceil(daysInBetween / 7); i++) {
              processEvent(moment(event.start_date).add(i * 7, "days"));
            }
            break;
          case "m":
            for (let i = 0; i < Math.ceil(daysInBetween / 30); i++) {
              processEvent(moment(event.start_date).add(i * 30, "days"));
            }
            break;
        }
      });

      setEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [date]);

  // Auth check
  const checkAuth = useCallback(async () => {
    try {
      const res = await API.handleAuth();
      if (!res.loggedIn) router.push("/login");
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchRooms();
  }, [checkAuth, fetchRooms]);

  useEffect(() => {
    fetchEvents();
  }, [date, fetchEvents]);

  const handleDateChange = (days: number) => {
    setDate(moment(date).add(days, "days"));
  };

  const getEventForCell = (roomLabel: string, hourIndex: number) => {
    const hour = hourIndex + 8; // Convert to 24-hour format
    return events.find(
      (event) =>
        event.room === roomLabel && event.start <= hour && event.end >= hour
    );
  };

  if (!loaded) {
    return (
      <div className="w-screen h-screen">
        <Header />
        <div className="h-[88vh] flex items-center justify-center">
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-full flex flex-col">
      <Header />

      <div className="gap-8 flex ml-10 mt-8 items-center">
        <div className="badge badge-soft badge-xl badge-primary">
          <button
            className="btn btn-ghost btn-xs btn-primary"
            onClick={() => handleDateChange(-1)}
          >
            <p className="text-lg">Geri</p>
          </button>

          <p className="font-bold">Tarih: {date.format("DD/MM/yyyy")}</p>

          <button
            className="btn btn-ghost btn-xs btn-primary"
            onClick={() => handleDateChange(1)}
          >
            <p className="text-lg">İleri</p>
          </button>
        </div>
      </div>

      <div className="w-[96%] max-h-[70vh] mt-4 mx-[2%] overflow-y-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="h-[6vh] w-[5.88vw]">Saat / Yer</th>
              {HOURS.map((hour, index) => (
                <th className="h-[6vh] w-[5.88vw]" key={index}>
                  {hour}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.value}>
                <td className="h-[6vh] text-center w-[5.88vw]">{room.label}</td>

                {HOURS.map((_, hourIndex) => {
                  const event = getEventForCell(room.label, hourIndex);
                  return (
                    <td
                      className={`h-[6vh] w-[5.88vw] ${
                        event?.is_exam ? "bg-red-100" : ""
                      }`}
                      key={hourIndex}
                    >
                      {event
                        ? `${event.class} - ${event.instructor}`
                        : "Müsait"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
