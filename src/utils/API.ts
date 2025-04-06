import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const API = {
  /* meeting events start */
  getMeetingEvents: async () => {
    const response = await axios.get(
      "https://apimynos.cc.metu.edu.tr/events/meetings"
    );

    return response.data;
  },

  createMeetingEvent: async (
    description: any,
    instructor: any,
    start_date: any,
    end_date: any,
    start_time: any,
    end_time: any,
    recurrence: any,
    room: any,
    is_main: any
  ) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/create-meeting-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            description: description,
            instructor: instructor,
            start_date: start_date,
            end_date: end_date,
            start_time: start_time,
            end_time: end_time,
            recurrence: recurrence,
            room: room,
            is_main: is_main,
          },
        }
      );

      toast.success("Toplantı başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  updateMeetingEvent: async (
    id: any,
    description: any,
    instructor: any,
    start_date: any,
    end_date: any,
    start_time: any,
    end_time: any,
    recurrence: any,
    room: any,
    is_main: any
  ) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/update-meeting-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id,
            description,
            instructor,
            start_date,
            end_date,
            start_time,
            end_time,
            recurrence,
            room,
            is_main,
          },
        }
      );

      toast.success("Toplantı başarıyla güncellendi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteMeetingEvents: async (id: any) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/delete-meeting-events",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: id,
          },
        }
      );

      toast.success("Silme işlemi başarılı.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteMeetingEvent: async (id: any, date: any) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/delete-meeting-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: id,
            date: date,
          },
        }
      );

      toast.success("Silme işlemi başarılı.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },
  /* meeting events end */

  /* class events start */
  getClassEvents: async () => {
    const response = await axios.get(
      "https://apimynos.cc.metu.edu.tr/events/classes"
    );

    return response.data;
  },

  createClassEvent: async (
    class_name: any,
    instructor: any,
    start_date: any,
    end_date: any,
    start_time: any,
    end_time: any,
    recurrence: any,
    room: any,
    is_exam: any
  ) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/create-class-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            class_name: class_name,
            instructor: instructor,
            start_date: start_date,
            end_date: end_date,
            start_time: start_time,
            end_time: end_time,
            recurrence: recurrence,
            room: room,
            is_exam: is_exam,
          },
        }
      );

      toast.success("Ders başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  updateClassEvent: async (
    id: any,
    class_name: any,
    instructor: any,
    start_date: any,
    end_date: any,
    start_time: any,
    end_time: any,
    recurrence: any,
    room: any,
    is_exam: any
  ) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/update-class-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: id,
            class_name: class_name,
            instructor: instructor,
            start_date: start_date,
            end_date: end_date,
            start_time: start_time,
            end_time: end_time,
            recurrence: recurrence,
            room: room,
            is_exam: is_exam,
          },
        }
      );

      toast.success("Ders başarıyla güncellendi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteClassEvents: async (id: any) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/delete-class-events",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: id,
          },
        }
      );

      toast.success("Silme işlemi başarılı.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteClassEvent: async (id: any, date: any) => {
    try {
      await axios.post(
        "https://apimynos.cc.metu.edu.tr/events/delete-class-event",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: id,
            date: date,
          },
        }
      );

      toast.success("Silme işlemi başarılı.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },
  /* class events end */

  /* class, instructor, room data start */
  getClassRooms: async () => {
    const response = await axios.get(
      "https://apimynos.cc.metu.edu.tr/class-rooms"
    );

    return response.data;
  },

  getMeetingRooms: async () => {
    const response = await axios.get(
      "https://apimynos.cc.metu.edu.tr/meeting-rooms"
    );

    return response.data;
  },

  getClasses: async () => {
    const response = await axios.get("https://apimynos.cc.metu.edu.tr/classes");

    return response.data;
  },

  getInstructors: async () => {
    const response = await axios.get(
      "https://apimynos.cc.metu.edu.tr/instructors"
    );

    return response.data;
  },

  addClassRoom: async (name: any, capacity: any, exam_capacity: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/class-rooms/add", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
          capacity: capacity,
          exam_capacity: exam_capacity,
        },
      });

      toast.success("Sınıf başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  addMeetingRoom: async (name: any, capacity: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/meeting-rooms/add", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
          capacity: capacity,
        },
      });

      toast.success("Toplantı odası başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  addClass: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/classes/add", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Ders başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  addInstructor: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/instructors/add", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Hoca başarıyla kaydedildi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteClassRoom: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/class-rooms/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Sınıf silindi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteMeetingRoom: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/meeting-rooms/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Toplantı odası silindi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteClass: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/classes/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Ders silindi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  deleteInstructor: async (name: any) => {
    try {
      await axios.post("https://apimynos.cc.metu.edu.tr/instructors/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
        },
      });

      toast.success("Hoca silindi.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },
  /* class, instructor, room data end */

  /* auth start */
  login: async (email: any, password: any) => {
    try {
      const result = await axios.post("https://apimynos.cc.metu.edu.tr/login", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email,
          password,
        },
      });

      return result.data;
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },

  logout: async () => {
    try {
      const result = await axios.post("https://apimynos.cc.metu.edu.tr/logout");

      console.log(result.data);

      return result.data;
    } catch (error) {
      console.error(error);

      toast.error("Hata! Lütfen tekrar deneyin.", {
        theme: "light",
        autoClose: 3000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        hideProgressBar: false,
        position: "bottom-center",
      });
    }
  },
  /* auth end */
};
