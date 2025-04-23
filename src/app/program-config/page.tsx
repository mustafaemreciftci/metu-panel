"use client";

import { IoMdClose } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";

// components
import Header from "@root/components/Header";

// utils
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

import "moment/locale/tr.js";

export default function Config() {
  const router = useRouter();

  const handleAuth = async () => {
    const res = await API.handleAuth();

    if (!res.loggedIn) {
      router.push("/login");
    } else {
      router.push("/class-program");
    }
  };

  React.useEffect(() => {
    handleAuth();
  }, []);

  const [loaded, setLoaded] = React.useState(false);

  const [modalType, setModalType] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);

  const [className, setClassName] = React.useState("");

  const [instructorName, setInstructorName] = React.useState("");

  const [classRoomName, setClassRoomName] = React.useState("");
  const [classRoomCapacity, setClassRoomCapacity] = React.useState("");
  const [classRoomExamCapacity, setClassRoomExamCapacity] = React.useState("");

  const [meetingRoomName, setMeetingRoomName] = React.useState("");
  const [meetingRoomCapacity, setMeetingRoomCapacity] = React.useState("");

  const [courses, setCourses] = React.useState<any>([]);
  const [classRooms, setClassRooms] = React.useState<any>([]);
  const [instructors, setInstructors] = React.useState<any>([]);
  const [meetingRooms, setMeetingRooms] = React.useState<any>([]);

  const handleData = async (action: any = null) => {
    if (action === null) {
      const _classResponse = await API.getClasses();
      const _classRoomsResponse = await API.getClassRooms();
      const _instructorsResponse = await API.getInstructors();
      const _meetingRoomsResponse = await API.getMeetingRooms();

      console.log(_classResponse);

      const _coursesArray = [];
      const _classRoomsArray = [];
      const _instructorsArray = [];
      const _meetingRoomsArray = [];

      const _coursesObject: any = [];
      const _classRoomsObject: any = [];
      const _instructorsObject: any = [];
      const _meetingRoomsObject: any = [];

      for (
        let _instructorIndex = 0;
        _instructorIndex < _instructorsResponse.length;
        _instructorIndex++
      ) {
        _instructorsArray.push(_instructorsResponse[_instructorIndex].name);
      }

      _instructorsArray.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      for (
        let _instructorArrayIndex = 0;
        _instructorArrayIndex < _instructorsArray.length;
        _instructorArrayIndex++
      ) {
        _instructorsObject.push({
          value: _instructorArrayIndex,
          label: _instructorsArray[_instructorArrayIndex],
        });
      }

      for (
        let _classIndex = 0;
        _classIndex < _classResponse.length;
        _classIndex++
      ) {
        _coursesArray.push(_classResponse[_classIndex].name);
      }

      _coursesArray.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      for (
        let _classArrayIndex = 0;
        _classArrayIndex < _coursesArray.length;
        _classArrayIndex++
      ) {
        _coursesObject.push({
          value: _classArrayIndex,
          label: _coursesArray[_classArrayIndex],
        });
      }

      for (
        let _classRoomsIndex = 0;
        _classRoomsIndex < _classRoomsResponse.length;
        _classRoomsIndex++
      ) {
        _classRoomsArray.push(_classRoomsResponse[_classRoomsIndex].name);
      }

      _classRoomsArray.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      for (
        let _classRoomArrayIndex = 0;
        _classRoomArrayIndex < _classRoomsArray.length;
        _classRoomArrayIndex++
      ) {
        _classRoomsObject.push({
          value: _classRoomArrayIndex,
          label: _classRoomsArray[_classRoomArrayIndex],
        });
      }

      for (
        let _meetingRoomsIndex = 0;
        _meetingRoomsIndex < _meetingRoomsResponse.length;
        _meetingRoomsIndex++
      ) {
        _meetingRoomsArray.push(_meetingRoomsResponse[_meetingRoomsIndex].name);
      }

      _meetingRoomsArray.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      for (
        let _meetingRoomArrayIndex = 0;
        _meetingRoomArrayIndex < _meetingRoomsArray.length;
        _meetingRoomArrayIndex++
      ) {
        _meetingRoomsObject.push({
          value: _meetingRoomArrayIndex,
          label: _meetingRoomsArray[_meetingRoomArrayIndex],
        });
      }

      setCourses(_coursesObject);
      setClassRooms(_classRoomsObject);
      setInstructors(_instructorsObject);
      setMeetingRooms(_meetingRoomsObject);
    } else {
      switch (action) {
        case "courses":
          const _classResponse = await API.getClasses();

          const _coursesArray = [];
          const _coursesObject = [];

          for (
            let _classIndex = 0;
            _classIndex < _classResponse.length;
            _classIndex++
          ) {
            _coursesArray.push(_classResponse[_classIndex].name);
          }

          _coursesArray.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });

          for (
            let _classArrayIndex = 0;
            _classArrayIndex < _coursesArray.length;
            _classArrayIndex++
          ) {
            _coursesObject.push({
              value: _classArrayIndex,
              label: _coursesArray[_classArrayIndex],
            });
          }

          setCourses(_coursesObject);

          break;

        case "classRooms":
          const _classRoomsResponse = await API.getClassRooms();

          const _classRoomsArray = [];
          const _classRoomsObject = [];

          for (
            let _classRoomsIndex = 0;
            _classRoomsIndex < _classRoomsResponse.length;
            _classRoomsIndex++
          ) {
            _classRoomsArray.push(_classRoomsResponse[_classRoomsIndex].name);
          }

          _classRoomsArray.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });

          for (
            let _classRoomArrayIndex = 0;
            _classRoomArrayIndex < _classRoomsArray.length;
            _classRoomArrayIndex++
          ) {
            _classRoomsObject.push({
              value: _classRoomArrayIndex,
              label: _classRoomsArray[_classRoomArrayIndex],
            });
          }

          setClassRooms(_classRoomsObject);

          break;

        case "instructors":
          const _instructorsResponse = await API.getInstructors();

          const _instructorsArray = [];
          const _instructorsObject = [];

          for (
            let _instructorIndex = 0;
            _instructorIndex < _instructorsResponse.length;
            _instructorIndex++
          ) {
            _instructorsArray.push(_instructorsResponse[_instructorIndex].name);
          }

          _instructorsArray.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });

          for (
            let _instructorArrayIndex = 0;
            _instructorArrayIndex < _instructorsArray.length;
            _instructorArrayIndex++
          ) {
            _instructorsObject.push({
              value: _instructorArrayIndex,
              label: _instructorsArray[_instructorArrayIndex],
            });
          }

          setInstructors(_instructorsObject);

          break;

        case "meetingRooms":
          const _meetingRoomsResponse = await API.getMeetingRooms();

          const _meetingRoomsArray = [];
          const _meetingRoomsObject = [];

          for (
            let _meetingRoomsIndex = 0;
            _meetingRoomsIndex < _meetingRoomsResponse.length;
            _meetingRoomsIndex++
          ) {
            _meetingRoomsArray.push(
              _meetingRoomsResponse[_meetingRoomsIndex].name
            );
          }

          _meetingRoomsArray.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });

          for (
            let _meetingRoomArrayIndex = 0;
            _meetingRoomArrayIndex < _meetingRoomsArray.length;
            _meetingRoomArrayIndex++
          ) {
            _meetingRoomsObject.push({
              value: _meetingRoomArrayIndex,
              label: _meetingRoomsArray[_meetingRoomArrayIndex],
            });
          }

          setMeetingRooms(_meetingRoomsObject);

          break;
      }
    }

    setLoaded(true);
  };

  React.useEffect(() => {
    handleData();
  }, []);

  const [category, setCategory] = useState("Hoca");

  const dialogRef = useRef<HTMLDialogElement>(null);

  if (loaded) {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        <Header />

        <fieldset className="fieldset self-start ml-10 mt-4">
          <legend className="fieldset-legend">Kategoriler</legend>

          <select
            onChange={(event) => setCategory(event.target.value)}
            defaultValue="Hoca"
            className="select"
          >
            <option>Hoca</option>
            <option>Ders</option>
            <option>Sınıf</option>
            <option>Toplantı Odası</option>
          </select>
        </fieldset>

        <div className="w-[96%] max-h-[60vh] mt-4 ml-[2%] mr-[2%] overflow-y-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>İsim</th>
                <th>İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {category === "Hoca" ? (
                <>
                  {instructors.map((instructor: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{instructor.label}</td>

                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={async () => {
                              await API.deleteInstructor(instructor.label);

                              handleData("instructors");
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : category === "Ders" ? (
                <>
                  {courses.map((course: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{course.label}</td>

                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={async () => {
                              await API.deleteInstructor(course.label);

                              handleData("courses");
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : category === "Sınıf" ? (
                <>
                  {classRooms.map((classRoom: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{classRoom.label}</td>

                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={async () => {
                              await API.deleteInstructor(classRoom.label);

                              handleData("classRooms");
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <>
                  {meetingRooms.map((meetingRoom: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{meetingRoom.label}</td>

                        <td>
                          <button
                            className="btn btn-secondary"
                            onClick={async () => {
                              await API.deleteInstructor(meetingRoom.label);

                              handleData("meetingRoom");
                            }}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={async () => {
            switch (category) {
              case "Hoca":
                setModalType("instructor");

                dialogRef.current?.showModal();

                break;

              case "Ders":
                setModalType("class");

                dialogRef.current?.showModal();

                break;

              case "Sınıf":
                setModalType("classRoom");

                dialogRef.current?.showModal();

                break;

              case "Toplantı Odası":
                setModalType("meetingRoom");

                dialogRef.current?.showModal();

                break;
            }
          }}
          className="btn btn-wide btn-primary ml-8 mt-8"
        >
          Ekle
        </button>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box w-[40vw] h-[40vh]">
            {modalType === "instructor" ? (
              <div className="pl-[5%]">
                <div className="flex pr-[5%] flex-row justify-between">
                  <h2>Hoca Ekle</h2>

                  <button
                    className="border-none text-2xl bg-white"
                    onClick={() => dialogRef.current?.close()}
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div style={{ height: 30 }} />

                <input
                  type="text"
                  className="input focus:outline-0"
                  placeholder="Hocanın tam adı"
                  onChange={(value) => setInstructorName(value.target.value)}
                />

                <button
                  onClick={async () => {
                    await API.addInstructor(instructorName);

                    handleData("instructors");

                    setModalVisible(false);
                  }}
                  className="w-14 h-14 right-8 bottom-6 flex items-center justify-center border-none overflow-hidden rounded-full absolute bg-[#c00000]"
                >
                  <FaRegSave color="white" size={20} />
                </button>
              </div>
            ) : modalType === "classRoom" ? (
              <div className="pl-[5%]">
                <div className="flex pr-[5%] flex-row justify-between">
                  <h2>Sınıf Ekle</h2>

                  <button
                    className="border-none text-2xl bg-white"
                    onClick={() => dialogRef.current?.close()}
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div style={{ height: 30 }} />

                <input
                  type="text"
                  className="input focus:outline-0"
                  onChange={(value) => setClassRoomName(value.target.value)}
                  placeholder="Sınıf adı"
                />

                <div style={{ height: 15 }} />

                <input
                  type="text"
                  className="input focus:outline-0"
                  onChange={(value) => setClassRoomCapacity(value.target.value)}
                  placeholder="Sınıf kapasitesi"
                />

                <div style={{ height: 15 }} />

                <input
                  type="text"
                  className="input focus:outline-0"
                  onChange={(value) =>
                    setClassRoomExamCapacity(value.target.value)
                  }
                  placeholder="Sınıf sınav kapasitesi"
                />

                <button
                  onClick={async () => {
                    await API.addClassRoom(
                      classRoomName,
                      classRoomCapacity,
                      classRoomExamCapacity
                    );

                    handleData("classRooms");

                    setModalVisible(false);
                  }}
                  className="w-14 h-14 right-8 bottom-6 flex items-center justify-center border-none overflow-hidden rounded-full absolute bg-[#c00000]"
                >
                  <FaRegSave color="white" size={20} />
                </button>
              </div>
            ) : modalType === "class" ? (
              <div className="pl-[5%]">
                <div className="flex pr-[5%] flex-row justify-between">
                  <h2>Ders Ekle</h2>

                  <button
                    className="border-none text-2xl bg-white"
                    onClick={() => dialogRef.current?.close()}
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div style={{ height: 30 }} />

                <input
                  type="text"
                  placeholder="Dersin adı"
                  className="input focus:outline-0"
                  onChange={(value) => setClassName(value.target.value)}
                />

                <button
                  onClick={async () => {
                    await API.addClass(className);

                    handleData("courses");

                    setModalVisible(false);
                  }}
                  className="w-14 h-14 right-8 bottom-6 flex items-center justify-center border-none overflow-hidden rounded-full absolute bg-[#c00000]"
                >
                  <FaRegSave color="white" size={20} />
                </button>
              </div>
            ) : (
              modalType === "meetingRoom" && (
                <div className="pl-[5%]">
                  <div className="flex pr-[5%] flex-row justify-between">
                    <h2>Toplantı Odası Ekle</h2>

                    <button
                      className="border-none text-2xl bg-white"
                      onClick={() => dialogRef.current?.close()}
                    >
                      <IoMdClose />
                    </button>
                  </div>

                  <div style={{ height: 30 }} />

                  <input
                    type="text"
                    className="input focus:outline-0"
                    onChange={(value) => setMeetingRoomName(value.target.value)}
                    placeholder="Toplantı odası adı"
                  />

                  <div style={{ height: 15 }} />

                  <input
                    type="text"
                    className="input focus:outline-0"
                    onChange={(value) =>
                      setMeetingRoomCapacity(value.target.value)
                    }
                    placeholder="Toplantı odası kapasitesi"
                  />

                  <button
                    onClick={async () => {
                      await API.addMeetingRoom(
                        meetingRoomName,
                        meetingRoomCapacity
                      );

                      handleData("meetingRooms");

                      setModalVisible(false);
                    }}
                    className="w-14 h-14 right-8 bottom-6 flex items-center justify-center border-none overflow-hidden rounded-full absolute bg-[#c00000]"
                  >
                    <FaRegSave color="white" size={20} />
                  </button>
                </div>
              )
            )}
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Header />

        <div
          style={{
            height: "88%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <OrbitProgress color={colors.metu_red} size="small" />
        </div>
      </div>
    );
  }
}
