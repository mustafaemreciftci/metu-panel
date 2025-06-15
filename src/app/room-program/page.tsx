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
import Header from "@root/components/Header";

// utils
import "moment/locale/tr.js";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

// library styles
import "react-big-calendar/lib/css/react-big-calendar.css";

const rooms: any = [];
const roomsExtra: any = [];
const instructors: any = [];

const localizer = momentLocalizer(moment);

export default function Room() {
  const router = useRouter();

  const [loaded, setLoaded] = React.useState(false);

  const [filterRoom, setFilterRoom] = React.useState(null);
  const [filterInstructor, setFilterInstructor] = React.useState(null);

  const [events, setEvents] = React.useState([]);
  const [filterEvents, setFilterEvents] = React.useState(null);

  const [eventDeleteID, setEventDeleteID] = React.useState(null);
  const [eventDeleteDate, setEventDeleteDate] = React.useState<any>(null);
  const [deleteEventModalVisible, setDeleteEventModalVisible] =
    React.useState(false);

  const [room, setRoom] = React.useState(null);
  const [isMain, setIsMain] = React.useState(false);
  const [endTime, setEndTime] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(new Date());
  const [description, setDescription] = React.useState("");
  const [instructor, setInstructor] = React.useState(null);
  const [recurrence, setRecurrence] = React.useState(null);
  const [startDate, setStartDate] = React.useState(new Date());

  const [updateRoom, setUpdateRoom] = React.useState(null);
  const [updateIsMain, setUpdateIsMain] = React.useState(false);
  const [updateEndTime, setUpdateEndTime] = React.useState(null);
  const [updateStartTime, setUpdateStartTime] = React.useState(null);
  const [updateEndDate, setUpdateEndDate] = React.useState(new Date());
  const [updateDescription, setUpdateDescription] = React.useState("");
  const [updateInstructor, setUpdateInstructor] = React.useState(null);
  const [updateRecurrence, setUpdateRecurrence] = React.useState(null);
  const [updateStartDate, setUpdateStartDate] = React.useState(new Date());

  const [modalVisible, setModalVisible] = React.useState(false);

  const dialogRef1 = React.useRef<HTMLDialogElement>(null);
  const dialogRef2 = React.useRef<HTMLDialogElement>(null);

  const handleData = async () => {
    const _instructorsResponse = await API.getInstructors();
    const _meetingRoomsResponse = await API.getMeetingRooms();

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

    for (
      let _meetingRoomIndex = 0;
      _meetingRoomIndex < _meetingRoomsResponse.length;
      _meetingRoomIndex++
    ) {
      rooms.push({
        value: JSON.stringify(_meetingRoomIndex),
        label: _meetingRoomsResponse[_meetingRoomIndex].name,
      });

      roomsExtra.push({
        value: JSON.stringify(_meetingRoomIndex),
        label:
          _meetingRoomsResponse[_meetingRoomIndex].name +
          " | Kapasite: " +
          _meetingRoomsResponse[_meetingRoomIndex].capacity,
      });
    }
  };

  const handleMeetingEvents = async () => {
    const _events = [];
    const response = await API.getMeetingEvents();

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

        if (_event.recurrence === "d" || _event.recurrence === "o") {
          for (let i = 0; i <= parseInt(daysInBetween.toString()); i += 1) {
            if (
              !exclude_dates.includes(
                moment(_event.start_date).add(i, "days").format("YYYY-MM-DD")
              )
            ) {
              _events.push({
                id: _event.id,
                title: _event.instructor + " - " + _event.room,
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
                room: _event.room,
                instructor: _event.instructor,
                is_main: _event.is_main,
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
                title: _event.instructor + " - " + _event.room,
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
                room: _event.room,
                instructor: _event.instructor,
                is_main: _event.is_main,
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
                title: _event.instructor + " - " + _event.room,
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
                room: _event.room,
                instructor: _event.instructor,
                is_main: _event.is_main,
              });
            }
          }
        }
      }
    }

    setEvents(_events as any);

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
  }, []);

  React.useEffect(() => {
    handleAuth();
    handleData();
    handleMeetingEvents();
  }, []);

  const handleFilterEvents = () => {
    const _filterEvents: any = [];

    if (filterRoom !== null || filterInstructor !== null) {
      if (filterRoom !== null && filterInstructor !== null) {
        for (let _event of events) {
          if (
            (_event as any).room === filterRoom &&
            (_event as any).instructor === filterInstructor
          ) {
            _filterEvents.push(_event);
          }
        }
      } else if (filterRoom === null && filterInstructor !== null) {
        for (let _event of events) {
          if ((_event as any).instructor === filterInstructor) {
            _filterEvents.push(_event);
          }
        }
      } else if (filterRoom !== null && filterInstructor === null) {
        for (let _event of events) {
          if ((_event as any).room === filterRoom) {
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
  }, [filterRoom, filterInstructor]);

  const onSelectEvent = (event: any) => {
    setEventDeleteID(event.id);
    setEventDeleteDate(moment(event.start).format("YYYY-MM-DD"));

    setDeleteEventModalVisible(true);
  };

  if (loaded) {
    return (
      <div className="flex-1">
        <Header />

        <div className="flex flex-row mt-[2vh] ml-[2.5vw]">
          <div className="w-[10vw]">
            <Creatable
              onChange={(data) => {
                if (data!.label === "Hepsi") {
                  setFilterRoom(null);
                } else {
                  setFilterRoom(data!.label as any);
                }
              }}
              value={{ label: filterRoom === null ? "Yer" : filterRoom }}
              placeholder={"Yer"}
              options={rooms}
              styles={{
                menu: (styles) => ({
                  ...styles,
                  zIndex: 99,
                }),
              }}
            />
          </div>

          <div className="flex flex-row ml-[2vw]">
            <Creatable
              onChange={(data) => {
                if (data!.label === "Hepsi") {
                  setFilterInstructor(null);
                } else {
                  setFilterInstructor(data!.label as any);
                }
              }}
              value={{
                label: filterInstructor === null ? "Hoca" : filterInstructor,
              }}
              placeholder={"Hoca"}
              options={instructors}
              styles={{
                menu: (styles) => ({
                  ...styles,
                  zIndex: 99,
                }),
              }}
            />
          </div>

          <button
            onClick={() => {
              setFilterRoom(null);
              setFilterInstructor(null);

              setFilterEvents(null);
            }}
            className="w-[40px] h-[40px] flex ml-[2vw] items-center justify-center rounded-[20px] bg-[#c00000]"
          >
            <IoMdClose size={25} color="white" />
          </button>
        </div>

        <Calendar
          className="w-[95vw] h-[76vh] mt-[2vh] ml-[2.5vw]"
          messages={{
            date: "Tarih",
            time: "Zaman",
            event: "Ders",
            allDay: "Tüm Gün",
            week: "Hafta",
            work_week: "İş Günü",
            day: "Gün",
            month: "Ay",
            previous: "Geri",
            next: "İleri",
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
          onSelectSlot={() => {
            setModalVisible(true);
          }}
          style={{ height: "76vh" }}
          onSelectEvent={onSelectEvent}
          eventPropGetter={(event) => {
            const roomType = event.room[0];

            let newStyle;

            if (event.is_main) {
              if (roomType === "D") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.class1,
                };
              } else if (roomType === "E") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.class2,
                };
              } else if (roomType === "A") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.class3,
                };
              } else {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.class0,
                };
              }
            } else if (roomType === "D") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class1,
              };
            } else if (roomType === "E") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class2,
              };
            } else if (roomType === "A") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class3,
              };
            } else {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class0,
              };
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
          components={{
            day: ({ date, localizer }: { date: any; localizer: any }) =>
              localizer.format(date, "dddd"),
          }}
        />

        <dialog ref={dialogRef1} className="modal">
          <div className="modal-box h-[70vh]">
            <div
              className="flex pl-[5%] pr-[5%] flex-row justify-between"
              id="class-delete-modal-header"
            >
              <h2 className="text-2xl">Toplantı Düzenle</h2>

              <button
                className="text-2xl bg-white"
                onClick={() => dialogRef1.current?.close()}
              >
                <IoMdClose />
              </button>
            </div>

            <div className="h-[10%]" />

            <div className="h-[65%] mt-[2.5%] pl-[5%] pr-[5%] justify-around">
              <Creatable
                onChange={(data: any) =>
                  setUpdateRoom(data.label.split("|")[0].trim())
                }
                placeholder={"Yer"}
                options={roomsExtra}
              />

              <div className="h-[5%]" />

              <Creatable
                onChange={(data: any) => setUpdateInstructor(data.label)}
                placeholder={"Hoca"}
                options={instructors}
              />

              <div className="h-[5%]" />

              <Creatable
                onChange={(data: any) => setUpdateRecurrence(data.value)}
                placeholder={"Tekrar sıklığı"}
                options={[
                  { value: "o", label: "Tek sefer" },
                  { value: "d", label: "Her gün" },
                  { value: "w", label: "Her hafta" },
                  { value: "m", label: "Her ay" },
                ]}
              />

              <div className="h-[5%]" />

              <input
                className="w-[30px] h-[30px] appearance-none rounded-[3px] relative inline-block border-[1px] border-solid border-[#b8b8b8]"
                onChange={(data) => setUpdateDescription(data.target.value)}
                placeholder={"Açıklama"}
              />

              <div className="h-[5%]" />

              <div className="flex flex-row justify-around">
                <DatePicker
                  className="w-[100%] h-[35px] rounded-[5px] text-center border-solid border-[1px] border-[#b8b8b8]"
                  selected={updateStartDate}
                  onChange={(date) => setUpdateStartDate(date!)}
                  dateFormat={"dd/MM/yyyy"}
                />

                <div className="w-4" />

                <DatePicker
                  className="w-[100%] h-[35px] rounded-[5px] text-center border-solid border-[1px] border-[#b8b8b8]"
                  selected={updateEndDate}
                  onChange={(date) => setUpdateEndDate(date!)}
                  dateFormat={"dd/MM/yyyy"}
                />
              </div>

              <div className="h-[5%]" />

              <div className="flex flex-row justify-around">
                <div className="w-80">
                  <Creatable
                    onChange={(data: any) => {
                      setUpdateStartTime(data.value);
                    }}
                    placeholder={"Başlangıç Saati"}
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
                  />
                </div>

                <div className="w-4" />

                <div className="w-80">
                  <Creatable
                    onChange={(data: any) => {
                      setUpdateEndTime(data.value);
                    }}
                    placeholder={"Bitiş Saati"}
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
                  />
                </div>
              </div>

              <div className="h-[5%]" />

              <label className="flex items-center">
                <input
                  className="w-[30px] h-[30px] appearance-none rounded-[3px] relative inline-block border-[1px] border-solid border-[#b8b8b8]"
                  type="checkbox"
                  checked={updateIsMain}
                  onChange={() => {
                    setUpdateIsMain(!updateIsMain);
                  }}
                />
                &nbsp;&nbsp;&nbsp;Sınavlar için bu kutucuğu işaretleyin.
              </label>
            </div>

            <div className="modal-action mt-12 flex justify-center items-center">
              <button
                className="btn btn-md btn-secondary"
                onClick={async () => {
                  await API.deleteMeetingEvent(eventDeleteID, eventDeleteDate);

                  handleMeetingEvents();

                  dialogRef1.current?.close();
                }}
              >
                Sadece Bunu Sil
              </button>

              <button
                className="btn btn-md btn-secondary"
                onClick={async () => {
                  await API.deleteMeetingEvents(eventDeleteID);

                  handleMeetingEvents();

                  dialogRef1.current?.close();
                }}
              >
                Hepsini Sil
              </button>

              <button
                onClick={async () => {
                  if (
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
                        await API.updateMeetingEvent(
                          eventDeleteID,
                          updateDescription,
                          updateInstructor,
                          updateStartDate,
                          updateEndDate,
                          updateStartTime,
                          updateEndTime,
                          updateRecurrence,
                          updateRoom,
                          updateIsMain
                        );

                        handleMeetingEvents();

                        setDeleteEventModalVisible(false);
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
                      await API.updateMeetingEvent(
                        eventDeleteID,
                        updateDescription,
                        updateInstructor,
                        updateStartDate,
                        updateEndDate,
                        updateStartTime,
                        updateEndTime,
                        updateRecurrence,
                        updateRoom,
                        updateIsMain
                      );

                      handleMeetingEvents();

                      setDeleteEventModalVisible(false);
                    }
                  }
                }}
                className="btn btn-primary w-14 h-14 flex items-center justify-center rounded-full"
              >
                <FaRegSave color="white" size={20} />
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <ReactModal
          style={{
            overlay: {
              zIndex: 99,
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
            content: {
              top: "10vh",
              left: "30vw",
              width: "40vw",
              height: "80vh",
              backgroundColor: "white",
            },
          }}
          ariaHideApp={false}
          isOpen={modalVisible}
        >
          <div className="flex pl-[5%] pr-[5%] flex-row justify-between">
            <h2>Toplantı Ekle</h2>

            <button
              className="text-2xl bg-white"
              onClick={() => setModalVisible(false)}
            >
              <IoMdClose />
            </button>
          </div>

          <div className="h-[65%] mt-[2.5%] pl-[5%] pr-[5%] justify-around">
            <Creatable
              onChange={(data: any) => setRoom(data.label.split("|")[0].trim())}
              placeholder={"Yer"}
              options={roomsExtra}
            />

            <div className="h-[5%]" />

            <Creatable
              onChange={(data: any) => setInstructor(data.label)}
              placeholder={"Hoca"}
              options={instructors}
            />

            <div className="h-[5%]" />

            <Creatable
              onChange={(data: any) => setRecurrence(data.value)}
              placeholder={"Tekrar sıklığı"}
              options={[
                { value: "o", label: "Tek sefer" },
                { value: "d", label: "Her gün" },
                { value: "w", label: "Her hafta" },
                { value: "m", label: "Her ay" },
              ]}
            />

            <div className="h-[5%]" />

            <input
              className="w-[97%] h-[35px] text-[15px] pl-[2%] border-solid border-[1px] rounded-[5px] border-[#b8b8b8]"
              onChange={(data) => setDescription(data.target.value)}
              placeholder={"Açıklama"}
            />

            <div className="h-[5%]" />

            <div className="flex flex-row justify-around">
              <DatePicker
                id="class-create-modal-content-date-container"
                selected={startDate}
                onChange={(date: any) => setStartDate(date)}
                dateFormat={"dd/MM/yyyy"}
              />

              <DatePicker
                id="class-create-modal-content-date-container"
                selected={endDate}
                onChange={(date: any) => setEndDate(date)}
                dateFormat={"dd/MM/yyyy"}
              />
            </div>

            <div className="h-[5%]" />

            <div className="flex flex-row justify-around">
              <div style={{ width: 250 }}>
                <Creatable
                  onChange={(data: any) => {
                    setStartTime(data.value);
                  }}
                  placeholder={"Başlangıç Saati"}
                  options={[
                    { value: "8:00:00", label: "8:00" },
                    { value: "8:15:00", label: "8:15" },
                    { value: "8:30:00", label: "8:30" },
                    { value: "8:45:00", label: "8:45" },
                    { value: "9:00:00", label: "9:00" },
                    { value: "9:15:00", label: "9:15" },
                    { value: "9:30:00", label: "9:30" },
                    { value: "9:45:00", label: "9:45" },
                    { value: "10:00:00", label: "10:00" },
                    { value: "10:15:00", label: "10:15" },
                    { value: "10:30:00", label: "10:30" },
                    { value: "10:45:00", label: "10:45" },
                    { value: "11:00:00", label: "11:00" },
                    { value: "11:15:00", label: "11:15" },
                    { value: "11:30:00", label: "11:30" },
                    { value: "11:45:00", label: "11:45" },
                    { value: "12:00:00", label: "12:00" },
                    { value: "12:15:00", label: "12:15" },
                    { value: "12:00:00", label: "12:30" },
                    { value: "12:45:00", label: "12:45" },
                    { value: "13:00:00", label: "13:00" },
                    { value: "13:15:00", label: "13:15" },
                    { value: "13:30:00", label: "13:30" },
                    { value: "13:45:00", label: "13:45" },
                    { value: "14:00:00", label: "14:00" },
                    { value: "14:15:00", label: "14:15" },
                    { value: "14:30:00", label: "14:30" },
                    { value: "14:45:00", label: "14:45" },
                    { value: "15:00:00", label: "15:00" },
                    { value: "15:15:00", label: "15:15" },
                    { value: "15:30:00", label: "15:30" },
                    { value: "15:45:00", label: "15:45" },
                    { value: "16:00:00", label: "16:00" },
                    { value: "16:15:00", label: "16:15" },
                    { value: "16:30:00", label: "16:30" },
                    { value: "16:45:00", label: "16:45" },
                    { value: "17:00:00", label: "17:00" },
                    { value: "17:15:00", label: "17:15" },
                    { value: "17:30:00", label: "17:30" },
                    { value: "17:45:00", label: "17:45" },
                    { value: "18:00:00", label: "18:00" },
                    { value: "18:15:00", label: "18:15" },
                    { value: "18:30:00", label: "18:30" },
                    { value: "18:45:00", label: "18:45" },
                    { value: "19:00:00", label: "19:00" },
                    { value: "19:15:00", label: "19:15" },
                    { value: "19:30:00", label: "19:30" },
                    { value: "19:45:00", label: "19:45" },
                    { value: "20:00:00", label: "20:00" },
                    { value: "20:15:00", label: "20:15" },
                    { value: "20:30:00", label: "20:30" },
                    { value: "20:45:00", label: "20:45" },
                    { value: "21:00:00", label: "21:00" },
                    { value: "21:15:00", label: "21:15" },
                    { value: "21:30:00", label: "21:30" },
                    { value: "21:45:00", label: "21:45" },
                    { value: "22:00:00", label: "22:00" },
                    { value: "22:15:00", label: "22:15" },
                    { value: "22:30:00", label: "22:30" },
                    { value: "22:45:00", label: "22:45" },
                    { value: "23:00:00", label: "23:00" },
                    { value: "23:15:00", label: "23:15" },
                    { value: "23:30:00", label: "23:30" },
                    { value: "23:45:00", label: "23:45" },
                  ]}
                />
              </div>

              <div style={{ width: 250 }}>
                <Creatable
                  onChange={(data: any) => {
                    setEndTime(data.value);
                  }}
                  placeholder={"Bitiş Saati"}
                  options={[
                    { value: "8:00:00", label: "8:00" },
                    { value: "8:15:00", label: "8:15" },
                    { value: "8:30:00", label: "8:30" },
                    { value: "8:45:00", label: "8:45" },
                    { value: "9:00:00", label: "9:00" },
                    { value: "9:15:00", label: "9:15" },
                    { value: "9:30:00", label: "9:30" },
                    { value: "9:45:00", label: "9:45" },
                    { value: "10:00:00", label: "10:00" },
                    { value: "10:15:00", label: "10:15" },
                    { value: "10:30:00", label: "10:30" },
                    { value: "10:45:00", label: "10:45" },
                    { value: "11:00:00", label: "11:00" },
                    { value: "11:15:00", label: "11:15" },
                    { value: "11:30:00", label: "11:30" },
                    { value: "11:45:00", label: "11:45" },
                    { value: "12:00:00", label: "12:00" },
                    { value: "12:15:00", label: "12:15" },
                    { value: "12:00:00", label: "12:30" },
                    { value: "12:45:00", label: "12:45" },
                    { value: "13:00:00", label: "13:00" },
                    { value: "13:15:00", label: "13:15" },
                    { value: "13:30:00", label: "13:30" },
                    { value: "13:45:00", label: "13:45" },
                    { value: "14:00:00", label: "14:00" },
                    { value: "14:15:00", label: "14:15" },
                    { value: "14:30:00", label: "14:30" },
                    { value: "14:45:00", label: "14:45" },
                    { value: "15:00:00", label: "15:00" },
                    { value: "15:15:00", label: "15:15" },
                    { value: "15:30:00", label: "15:30" },
                    { value: "15:45:00", label: "15:45" },
                    { value: "16:00:00", label: "16:00" },
                    { value: "16:15:00", label: "16:15" },
                    { value: "16:30:00", label: "16:30" },
                    { value: "16:45:00", label: "16:45" },
                    { value: "17:00:00", label: "17:00" },
                    { value: "17:15:00", label: "17:15" },
                    { value: "17:30:00", label: "17:30" },
                    { value: "17:45:00", label: "17:45" },
                    { value: "18:00:00", label: "18:00" },
                    { value: "18:15:00", label: "18:15" },
                    { value: "18:30:00", label: "18:30" },
                    { value: "18:45:00", label: "18:45" },
                    { value: "19:00:00", label: "19:00" },
                    { value: "19:15:00", label: "19:15" },
                    { value: "19:30:00", label: "19:30" },
                    { value: "19:45:00", label: "19:45" },
                    { value: "20:00:00", label: "20:00" },
                    { value: "20:15:00", label: "20:15" },
                    { value: "20:30:00", label: "20:30" },
                    { value: "20:45:00", label: "20:45" },
                    { value: "21:00:00", label: "21:00" },
                    { value: "21:15:00", label: "21:15" },
                    { value: "21:30:00", label: "21:30" },
                    { value: "21:45:00", label: "21:45" },
                    { value: "22:00:00", label: "22:00" },
                    { value: "22:15:00", label: "22:15" },
                    { value: "22:30:00", label: "22:30" },
                    { value: "22:45:00", label: "22:45" },
                    { value: "23:00:00", label: "23:00" },
                    { value: "23:15:00", label: "23:15" },
                    { value: "23:30:00", label: "23:30" },
                    { value: "23:45:00", label: "23:45" },
                  ]}
                />
              </div>
            </div>

            <div className="h-[5%]" />

            <label className="flex items-center">
              <input
                className="w-[30px] h-[30px] appearance-none rounded-[3px] relative inline-block border-[1px] border-solid border-[#b8b8b8]"
                type="checkbox"
                checked={updateIsMain}
                onChange={() => {
                  setUpdateIsMain(!updateIsMain);
                }}
              />
              &nbsp;&nbsp;&nbsp;Bölüm başkanlığı toplantısı için bu kutucuğu
              işaretleyin.
            </label>

            <button
              onClick={async () => {
                if (
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
                      await API.createMeetingEvent(
                        description,
                        instructor,
                        startDate,
                        endDate,
                        startTime,
                        endTime,
                        recurrence,
                        room,
                        isMain
                      );

                      handleMeetingEvents();

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
                    await API.createMeetingEvent(
                      description,
                      instructor,
                      startDate,
                      endDate,
                      startTime,
                      endTime,
                      recurrence,
                      room,
                      isMain
                    );

                    handleMeetingEvents();

                    setModalVisible(false);
                  }
                }
              }}
              className="w-16 h-16 right-[50px] bottom-[30px] flex justify-center items-center border-none overflow-hidden rounded-[2vw] absolute bg-[#c00000]"
            >
              <FaRegSave size={25} />
            </button>
          </div>
        </ReactModal>
      </div>
    );
  } else {
    return (
      <div className="fw-[100vw] h-[100vh]">
        <Header />

        <div className="h-[88vh] flex items-center justify-center">
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }
}
