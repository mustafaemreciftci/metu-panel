"use client";

import React, { ComponentType } from "react";
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

  const dialogRef1 = React.useRef<HTMLDialogElement>(null);
  const dialogRef2 = React.useRef<HTMLDialogElement>(null);

  const handleData = async () => {
    const _classResponse = await API.getClasses();
    const _instructorsResponse = await API.getInstructors();
    const _classRoomsResponse = await API.getClassRooms();

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
      let _classIndex = 0;
      _classIndex < _classResponse.length;
      _classIndex++
    ) {
      courses.push({
        value: JSON.stringify(_classIndex),
        label: _classResponse[_classIndex].name,
      });
    }

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

    dialogRef1.current?.showModal();
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
                  setFilterClass(null);
                } else {
                  setFilterClass(data!.label as any);
                }
              }}
              value={{ label: filterClass === null ? "Ders" : filterClass }}
              placeholder={"Ders"}
              options={courses}
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
              setFilterClass(null);
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
          eventPropGetter={(event: {
            id: string;
            start: Date;
            class: any;
            is_exam: boolean;
          }) => {
            const classType = event.class.match(/(\d+)/)[0][0];

            let newStyle;

            if (event.is_exam) {
              if (classType === "1") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.exam,
                };
              } else if (classType === "2") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.exam,
                };
              } else if (classType === "3") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.exam,
                };
              } else if (classType === "4") {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.exam,
                };
              } else {
                newStyle = {
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: colors.exam,
                };
              }
            } else if (classType === "1") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class1,
              };
            } else if (classType === "2") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class2,
              };
            } else if (classType === "3") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class3,
              };
            } else if (classType === "4") {
              newStyle = {
                color: "black",
                fontWeight: "bold",
                backgroundColor: colors.class4,
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
              <h2 className="text-2xl">Ders - Etkinlik Düzenle</h2>

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
                onChange={(data: any) => setUpdateClass(data.label)}
                placeholder={"Ders"}
                options={courses}
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
                  checked={updateIsExam}
                  onChange={() => {
                    setUpdateIsExam(!updateIsExam);
                  }}
                />
                &nbsp;&nbsp;&nbsp;Sınavlar için bu kutucuğu işaretleyin.
              </label>
            </div>

            <div className="modal-action mt-12 flex justify-center items-center">
              <button
                className="btn btn-md btn-secondary"
                onClick={async () => {
                  await API.deleteClassEvent(eventDeleteID, eventDeleteDate);

                  handleClassEvents();

                  dialogRef1.current?.close();
                }}
              >
                Sadece Bunu Sil
              </button>

              <button
                className="btn btn-md btn-secondary"
                onClick={async () => {
                  await API.deleteClassEvents(eventDeleteID);

                  handleClassEvents();

                  dialogRef1.current?.close();
                }}
              >
                Hepsini Sil
              </button>

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

                        dialogRef1.current?.close();
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

                      dialogRef1.current?.close();
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
            <h2>Ders - Etkinlik Ekle</h2>

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
              onChange={(data: any) => setClass(data.label)}
              placeholder={"Ders"}
              options={courses}
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

            <div className="flex flex-row justify-around">
              <DatePicker
                className="w-[200px] h-[35px] rounded-[5px] text-center border-solid border-[1px] border-[#b8b8b8]"
                selected={startDate}
                onChange={(date: any) => setStartDate(date)}
                dateFormat={"dd/MM/yyyy"}
              />

              <DatePicker
                className="w-[200px] h-[35px] rounded-[5px] text-center border-solid border-[1px] border-[#b8b8b8]"
                selected={endDate}
                onChange={(date: any) => setEndDate(date)}
                dateFormat={"dd/MM/yyyy"}
              />
            </div>

            <div className="h-[5%]" />

            <div className="flex flex-row justify-around">
              <div className="w-80">
                <Creatable
                  onChange={(data: any) => {
                    setStartTime(data.value);
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

              <div className="w-80">
                <Creatable
                  onChange={(data: any) => {
                    setEndTime(data.value);
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

            <div className="h-[10%]" />

            <label className="flex items-center">
              <input
                className="w-[20px] h-[20px] border-[1px] border-solid border-[#b8b8b8]"
                type="checkbox"
                checked={isExam}
                onChange={() => {
                  setIsExam(!isExam);
                }}
              />
              &nbsp;&nbsp;&nbsp;Sınavlar için bu kutucuğu işaretleyin.
            </label>

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
              className="w-16 h-16 right-[50px] bottom-[30px] flex justify-center items-center border-none overflow-hidden rounded-[2vw] absolute bg-[#c00000]"
            >
              <FaRegSave color="white" size={25} />
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
