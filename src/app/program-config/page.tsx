"use client";

import React from "react";
import ReactModal from "react-modal";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

// components
import Header from "@root/components/Header";

// styles
import "../styles/config.css";

// utils
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

import "moment/locale/tr.js";

export default function Config() {
  const router = useRouter();

  const handleAuth = async () => {
    const res = await API.getMeetingEvents();

    console.log(res);

    if (res.loggedIn === false) {
      router.push("/login");
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

  const [courses, setCourses] = React.useState([]);
  const [classRooms, setClassRooms] = React.useState([]);
  const [instructors, setInstructors] = React.useState([]);
  const [meetingRooms, setMeetingRooms] = React.useState([]);

  const handleData = async (action = null) => {
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

      const _coursesObject = [];
      const _classRoomsObject = [];
      const _instructorsObject = [];
      const _meetingRoomsObject = [];

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

  if (loaded) {
    return (
      <div id="config-container">
        <Header />

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="config-data-section-container">
            <div
              style={{
                width: "100%",
              }}
            >
              {instructors.map((instructor, index) => {
                return (
                  <div
                    className="config-data-section-table-row"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                    }}
                    key={index}
                  >
                    <p>{instructor.label}</p>

                    <MdDelete
                      onClick={async () => {
                        await API.deleteInstructor(instructor.label);

                        handleData("instructors");
                      }}
                      size={20}
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="config-add-data-button"
              onClick={() => {
                setModalType("instructor");
                setModalVisible(true);
              }}
            >
              Hoca Ekle
            </button>
          </div>

          <div className="config-data-section-container">
            <div
              style={{
                width: "100%",
              }}
            >
              {courses.map((course, index) => {
                return (
                  <div
                    className="config-data-section-table-row"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                    }}
                    key={index}
                  >
                    <p>{course.label}</p>

                    <MdDelete
                      onClick={async () => {
                        await API.deleteClass(course.label);

                        handleData("courses");
                      }}
                      size={20}
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="config-add-data-button"
              onClick={() => {
                setModalType("class");
                setModalVisible(true);
              }}
            >
              Ders Ekle
            </button>
          </div>

          <div className="config-data-section-container">
            <div
              style={{
                width: "100%",
              }}
            >
              {classRooms.map((classRoom, index) => {
                return (
                  <div
                    className="config-data-section-table-row"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                    }}
                    key={index}
                  >
                    <p>{classRoom.label}</p>

                    <MdDelete
                      onClick={async () => {
                        await API.deleteClassRoom(classRoom.label);

                        handleData("classRooms");
                      }}
                      size={20}
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="config-add-data-button"
              onClick={() => {
                setModalType("classRoom");
                setModalVisible(true);
              }}
            >
              Sınıf Ekle
            </button>
          </div>

          <div className="config-data-section-container">
            <div
              style={{
                width: "100%",
              }}
            >
              {meetingRooms.map((meetingRoom, index) => {
                return (
                  <div
                    className="config-data-section-table-row"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                    }}
                    key={index}
                  >
                    <p>{meetingRoom.label}</p>

                    <MdDelete
                      onClick={async () => {
                        await API.deleteMeetingRoom(meetingRoom.label);

                        handleData("meetingRooms");
                      }}
                      size={20}
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="config-add-data-button"
              onClick={() => {
                setModalType("meetingRoom");
                setModalVisible(true);
              }}
            >
              Toplantı Odası Ekle
            </button>
          </div>
        </div>

        <ReactModal
          style={{
            overlay: {
              zIndex: 99,
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
            content: {
              top: "30vh",
              left: "30vw",
              width: "40vw",
              height: "40vh",
              backgroundColor: "white",
            },
          }}
          ariaHideApp={false}
          isOpen={modalVisible}
        >
          {modalType === "instructor" ? (
            <div id="config-modal-container">
              <div id="config-modal-header">
                <h2>Hoca Ekle</h2>

                <button onClick={() => setModalVisible(false)}>
                  <IoMdClose />
                </button>
              </div>

              <div style={{ height: 30 }} />

              <input
                className="config-modal-input"
                onChange={(value) => setInstructorName(value.target.value)}
                placeholder="Hocanın tam adı"
              />

              <button
                onClick={async () => {
                  await API.addInstructor(instructorName);

                  handleData("instructors");

                  setModalVisible(false);
                }}
                className="config-modal-save-button"
              >
                <FaRegSave size={25} />
              </button>
            </div>
          ) : modalType === "classRoom" ? (
            <div id="config-modal-container">
              <div id="config-modal-header">
                <h2>Sınıf Ekle</h2>

                <button onClick={() => setModalVisible(false)}>
                  <IoMdClose />
                </button>
              </div>

              <div style={{ height: 30 }} />

              <input
                className="config-modal-input"
                onChange={(value) => setClassRoomName(value.target.value)}
                placeholder="Sınıf adı"
              />

              <div style={{ height: 15 }} />

              <input
                className="config-modal-input"
                onChange={(value) => setClassRoomCapacity(value.target.value)}
                placeholder="Sınıf kapasitesi"
              />

              <div style={{ height: 15 }} />

              <input
                className="config-modal-input"
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
                className="config-modal-save-button"
              >
                <FaRegSave size={25} />
              </button>
            </div>
          ) : modalType === "class" ? (
            <div id="config-modal-container">
              <div id="config-modal-header">
                <h2>Ders Ekle</h2>

                <button onClick={() => setModalVisible(false)}>
                  <IoMdClose />
                </button>
              </div>

              <div style={{ height: 30 }} />

              <input
                className="config-modal-input"
                onChange={(value) => setClassName(value.target.value)}
                placeholder="Dersin adı"
              />

              <button
                onClick={async () => {
                  await API.addClass(className);

                  handleData("courses");

                  setModalVisible(false);
                }}
                className="config-modal-save-button"
              >
                <FaRegSave size={25} />
              </button>
            </div>
          ) : (
            modalType === "meetingRoom" && (
              <div id="config-modal-container">
                <div id="config-modal-header">
                  <h2>Toplantı Odası Ekle</h2>

                  <button onClick={() => setModalVisible(false)}>
                    <IoMdClose />
                  </button>
                </div>

                <div style={{ height: 30 }} />

                <input
                  className="config-modal-input"
                  onChange={(value) => setMeetingRoomName(value.target.value)}
                  placeholder="Toplantı odası adı"
                />

                <div style={{ height: 15 }} />

                <input
                  className="config-modal-input"
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
                  className="config-modal-save-button"
                >
                  <FaRegSave size={25} />
                </button>
              </div>
            )
          )}
        </ReactModal>
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
