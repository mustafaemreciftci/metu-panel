"use client";

import React from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

// components
import Header from "@root/components/Header";

// utils
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

const hours = [
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

  const [rooms, setRooms] = React.useState([]);
  const [events, setEvents] = React.useState<any>([]);
  const [date, setDate] = React.useState(moment(new Date()));

  const [loaded, setLoaded] = React.useState(false);

  const handleData = async () => {
    const _classRoomsResponse = await API.getClassRooms();

    const newRooms: any = [];

    for (
      let _classRoomsIndex = 0;
      _classRoomsIndex < _classRoomsResponse.length;
      _classRoomsIndex++
    ) {
      newRooms.push({
        value: JSON.stringify(_classRoomsIndex),
        label: _classRoomsResponse[_classRoomsIndex].name,
      });
    }

    setRooms(newRooms);

    setTimeout(() => {
      setLoaded(true);
    }, 500);
  };

  const handleClassEvents = async () => {
    const _events = [];
    const response = await API.getClassEvents();

    if (response.length > 0) {
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

        if (_event.recurrence === "d") {
          for (let i = 0; i <= parseInt(daysInBetween.toString()); i += 1) {
            if (
              !exclude_dates.includes(
                moment(_event.start_date).add(i, "days").format("YYYY-MM-DD")
              ) &&
              moment(date).format("YYYY-MM-DD") ===
                moment(_event.start_date).add(i, "days").format("YYYY-MM-DD")
            ) {
              _events.push({
                start: parseInt(_event.start_time.slice(0, 2)),
                end: parseInt(_event.end_time.slice(0, 2)),
                room: _event.room,
                class: _event.class,
                instructor: _event.instructor,
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
              ) &&
              moment(date).format("YYYY-MM-DD") ===
                moment(_event.start_date)
                  .add(i * 7, "days")
                  .format("YYYY-MM-DD")
            ) {
              _events.push({
                start: parseInt(_event.start_time.slice(0, 2)),
                end: parseInt(_event.end_time.slice(0, 2)),
                room: _event.room,
                class: _event.class,
                instructor: _event.instructor,
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
              ) &&
              moment(date).format("YYYY-MM-DD") ===
                moment(_event.start_date)
                  .add(i * 30, "days")
                  .format("YYYY-MM-DD")
            ) {
              _events.push({
                start: parseInt(_event.start_time.slice(0, 2)),
                end: parseInt(_event.end_time.slice(0, 2)),
                room: _event.room,
                class: _event.class,
                instructor: _event.instructor,
              });
            }
          }
        }
      }
    }

    setEvents(_events);
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
  }, []);

  React.useEffect(() => {
    handleClassEvents();
  }, [date]);

  if (loaded) {
    return (
      <div className="w-[100vw] h-full flex flex-col justify-center">
        <Header />

        <div className="gap-8 flex ml-10 mt-8 items-center">
          <div className="badge badge-soft badge-xl badge-primary">
            <button
              className="btn btn-ghost btn-xs btn-primary"
              onClick={() => {
                setDate(moment(date.subtract(1, "day")));
              }}
            >
              <p className="text-lg">Geri</p>
            </button>

            <p className="font-bold">
              Tarih: {date.format("DD/MM/yyyy").toString()}
            </p>

            <button
              className="btn btn-ghost btn-xs btn-primary"
              onClick={() => {
                setDate(moment(date.add(1, "day")));
              }}
            >
              <p className="text-lg">İleri</p>
            </button>
          </div>
        </div>

        <div className="w-[96%] max-h-[70vh] mt-4 ml-[2%] mr-[2%] overflow-y-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="h-[6vh] w-[5.88vw]">Saat / Yer</th>

                {hours.map((hour, index) => (
                  <th className="h-[6vh] w-[5.88vw]" key={index}>
                    {hour}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rooms.map((room: any, index) => {
                return (
                  <tr key={index}>
                    <td className="h-[6vh] text-center w-[5.88vw]">
                      {room.label}
                    </td>

                    {hours.map((_, index) => {
                      {
                        for (let i = 0; i < events.length; i++) {
                          const event = events[i];

                          if (
                            room.label === event.room &&
                            event.start <= index + 8 &&
                            event.end >= index + 8
                          ) {
                            return (
                              <td className="h-[6vh] w-[5.88vw]" key={index}>
                                {event.class} - {event.instructor}
                              </td>
                            );
                          }
                        }

                        return (
                          <td className="h-[6vh] w-[5.88vw]" key={index}>
                            Müsait
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full">
        <Header />

        <div className="min-h-[88%] flex items-center justify-center">
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }
}
