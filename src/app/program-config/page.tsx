"use client";

import React from "react";
import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

// components
import Sidebar from "@root/components/Sidebar";

// utils
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";

import "moment/locale/tr.js";

export default function Config() {
  const router = useRouter();

  const [loaded, setLoaded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const [modalType, setModalType] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [dataTypeModalVisible, setDataTypeModalVisible] = React.useState(false);

  const [selectedDataType, setSelectedDataType] = React.useState("");

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

      if (_instructorsResponse) {
        for (
          let _instructorIndex = 0;
          _instructorIndex < _instructorsResponse.length;
          _instructorIndex++
        ) {
          _instructorsArray.push(_instructorsResponse[_instructorIndex].name);
        }
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

      if (_classResponse) {
        for (
          let _classIndex = 0;
          _classIndex < _classResponse.length;
          _classIndex++
        ) {
          _coursesArray.push(_classResponse[_classIndex].name);
        }
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

      if (_classRoomsResponse) {
        if (_classRoomsResponse) {
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
        }
      }

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

      if (_meetingRoomsResponse) {
        if (_meetingRoomsResponse) {
          for (
            let _meetingRoomsIndex = 0;
            _meetingRoomsIndex < _meetingRoomsResponse.length;
            _meetingRoomsIndex++
          ) {
            _meetingRoomsArray.push(
              _meetingRoomsResponse[_meetingRoomsIndex].name
            );
          }
        }
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

          if (_classResponse) {
            for (
              let _classIndex = 0;
              _classIndex < _classResponse.length;
              _classIndex++
            ) {
              _coursesArray.push(_classResponse[_classIndex].name);
            }
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

          if (_classRoomsResponse) {
            for (
              let _classRoomsIndex = 0;
              _classRoomsIndex < _classRoomsResponse.length;
              _classRoomsIndex++
            ) {
              _classRoomsArray.push(_classRoomsResponse[_classRoomsIndex].name);
            }
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

          if (_instructorsResponse) {
            for (
              let _instructorIndex = 0;
              _instructorIndex < _instructorsResponse.length;
              _instructorIndex++
            ) {
              _instructorsArray.push(
                _instructorsResponse[_instructorIndex].name
              );
            }
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

          if (_meetingRoomsResponse) {
            for (
              let _meetingRoomsIndex = 0;
              _meetingRoomsIndex < _meetingRoomsResponse.length;
              _meetingRoomsIndex++
            ) {
              _meetingRoomsArray.push(
                _meetingRoomsResponse[_meetingRoomsIndex].name
              );
            }
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

    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  };

  const handleAuth = async () => {
    const res = await API.handleAuth();

    if (res.loggedIn === false) {
      router.push("/login");
    } else if (res.role !== "admin") {
      router.push("/class-program");
    }
  };

  React.useEffect(() => {
    handleAuth();
    handleData();
  }, []);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loaded) {
    return (
      <div className="w-full md:w-[88vw] md:pl-[14vw] bg-white min-h-screen">
        <Sidebar />

        {/* Header - responsive */}
        <div className="px-4 md:px-6 py-8 md:py-16 pt-16 md:pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl md:text-4xl font-bold text-black">
                Veriler
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDataTypeModalVisible(true)}
                className="text-sm bg-[#22C2BA] text-white px-4 py-2 rounded-xl w-full md:w-auto"
              >
                + Veri Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - responsive grid */}
        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
            {/* Hocalar Column */}
            <div>
              <h3 className="text-lg font-semibold text-[#878787] mb-4 border-b border-b-[#878787] pb-2">
                Hocalar
              </h3>
              <div className="space-y-2">
                {instructors.map((instructor: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 border-b border-b-[#878787] pb-4"
                  >
                    <span className="text-sm text-gray-900 flex-1 mr-2">
                      {instructor.label}
                    </span>
                    <button
                      className="text-red-500 text-sm font-bold whitespace-nowrap"
                      onClick={async () => {
                        await API.deleteInstructor(instructor.label);
                        handleData("instructors");
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dersler Column */}
            <div>
              <h3 className="text-lg font-semibold text-[#878787] mb-4 border-b border-b-[#878787] pb-2">
                Dersler
              </h3>
              <div className="space-y-2">
                {courses.map((course: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 border-b border-b-[#878787] pb-4"
                  >
                    <span className="text-sm text-gray-900 flex-1 mr-2">
                      {course.label}
                    </span>
                    <button
                      className="text-red-500 text-sm font-bold whitespace-nowrap"
                      onClick={async () => {
                        await API.deleteClass(course.label);
                        handleData("courses");
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sınıf Column */}
            <div>
              <h3 className="text-lg font-semibold text-[#878787] mb-4 border-b border-b-[#878787] pb-2">
                Sınıf
              </h3>
              <div className="space-y-2">
                {classRooms.map((classRoom: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 border-b border-b-[#878787] pb-4"
                  >
                    <span className="text-sm text-gray-900 flex-1 mr-2">
                      {classRoom.label}
                    </span>
                    <button
                      className="text-red-500 text-sm font-bold whitespace-nowrap"
                      onClick={async () => {
                        await API.deleteClassRoom(classRoom.label);
                        handleData("classRooms");
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toplantı Odası Column */}
            <div>
              <h3 className="text-lg font-semibold text-[#878787] mb-4 border-b border-b-[#878787] pb-2">
                Toplantı Odası
              </h3>
              <div className="space-y-2">
                {meetingRooms.map((meetingRoom: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 border-b border-b-[#878787] pb-4"
                  >
                    <span className="text-sm text-gray-900 flex-1 mr-2">
                      {meetingRoom.label}
                    </span>
                    <button
                      className="text-red-500 text-sm font-bold whitespace-nowrap"
                      onClick={async () => {
                        await API.deleteMeetingRoom(meetingRoom.label);
                        handleData("meetingRooms");
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Type Selection Modal - responsive */}
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
              width: "min(500px, 95vw)",
              height: "min(400px, 85vh)",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "none",
              padding: "20px",
              overflow: "auto",
            },
          }}
          ariaHideApp={false}
          isOpen={dataTypeModalVisible}
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                Veri ekleme
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setDataTypeModalVisible(false)}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Veri türü
                </label>
                <select
                  value={selectedDataType}
                  onChange={(e) => setSelectedDataType(e.target.value)}
                  className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                >
                  <option value="">Ör: Hoca</option>
                  <option value="instructor">Hoca</option>
                  <option value="class">Ders</option>
                  <option value="classRoom">Sınıf</option>
                  <option value="meetingRoom">Toplantı Odası</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (selectedDataType) {
                    setModalType(selectedDataType);
                    setDataTypeModalVisible(false);
                    setModalVisible(true);
                  }
                }}
                disabled={!selectedDataType}
                className={`text-white px-6 py-3 rounded-lg flex items-center space-x-2 w-full md:w-auto justify-center ${
                  selectedDataType
                    ? "bg-[#22C2BA] hover:bg-[#1da39a]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <span>+ Veri Ekle</span>
              </button>
            </div>
          </div>
        </ReactModal>

        {/* Add Modal - responsive */}
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
              height: "min(600px, 90vh)",
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
                {modalType === "instructor"
                  ? "Hoca Ekle"
                  : modalType === "classRoom"
                  ? "Sınıf Ekle"
                  : modalType === "class"
                  ? "Ders Ekle"
                  : "Toplantı Odası Ekle"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setModalVisible(false);
                  setSelectedDataType("");
                }}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {modalType === "instructor" && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Hoca Adı
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                    placeholder="Hocanın tam adı"
                    onChange={(value) => setInstructorName(value.target.value)}
                  />
                </div>
              )}

              {modalType === "class" && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black">
                    Ders Adı
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                    placeholder="Dersin adı"
                    onChange={(value) => setClassName(value.target.value)}
                  />
                </div>
              )}

              {modalType === "classRoom" && (
                <>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black">
                      Sınıf Adı
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                      placeholder="Sınıf adı"
                      onChange={(value) => setClassRoomName(value.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black">
                      Kapasite
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                      placeholder="Sınıf kapasitesi"
                      onChange={(value) =>
                        setClassRoomCapacity(value.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black">
                      Sınav Kapasitesi
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                      placeholder="Sınıf sınav kapasitesi"
                      onChange={(value) =>
                        setClassRoomExamCapacity(value.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {modalType === "meetingRoom" && (
                <>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black">
                      Oda Adı
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                      placeholder="Toplantı odası adı"
                      onChange={(value) =>
                        setMeetingRoomName(value.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black">
                      Kapasite
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 bg-[#F5F5F5] border-none rounded-md text-base focus:outline-none"
                      placeholder="Toplantı odası kapasitesi"
                      onChange={(value) =>
                        setMeetingRoomCapacity(value.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={async () => {
                  switch (modalType) {
                    case "instructor":
                      await API.addInstructor(instructorName);
                      handleData("instructors");
                      break;
                    case "class":
                      await API.addClass(className);
                      handleData("courses");
                      break;
                    case "classRoom":
                      await API.addClassRoom(
                        classRoomName,
                        classRoomCapacity,
                        classRoomExamCapacity
                      );
                      handleData("classRooms");
                      break;
                    case "meetingRoom":
                      await API.addMeetingRoom(
                        meetingRoomName,
                        meetingRoomCapacity
                      );
                      handleData("meetingRooms");
                      break;
                  }
                  setModalVisible(false);
                  setSelectedDataType("");
                }}
                className="bg-[#22C2BA] text-white px-6 py-3 rounded-lg hover:bg-[#1da39a] flex items-center space-x-2 w-full md:w-auto justify-center"
              >
                <span>+ Kaydet</span>
              </button>
            </div>
          </div>
        </ReactModal>
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
