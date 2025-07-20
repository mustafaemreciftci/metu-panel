"use client";

import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Creatable from "react-select/creatable";
import DatePicker from "react-datepicker";
import { FaRegSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { OrbitProgress } from "react-loading-indicators";
import Header from "@root/components/Header";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";
import "moment/locale/tr.js";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Types
interface Resource {
  value: string;
  label: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  room: string;
  instructor: string;
  is_main: boolean;
}

interface TimeOption {
  value: string;
  label: string;
}

const localizer = momentLocalizer(moment);

const timeOptions: TimeOption[] = Array.from({ length: 32 }, (_, i) => {
  const hour = 8 + Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const timeString = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
  return {
    value: `${timeString}:00`,
    label: timeString,
  };
});

const recurrenceOptions = [
  { value: "o", label: "Tek sefer" },
  { value: "d", label: "Her gün" },
  { value: "w", label: "Her hafta" },
  { value: "m", label: "Her ay" },
];

export default function RoomScheduler() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [rooms, setRooms] = useState<Resource[]>([]);
  const [roomsExtra, setRoomsExtra] = useState<Resource[]>([]);
  const [instructors, setInstructors] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null);
  const [filterRoom, setFilterRoom] = useState<string | null>(null);
  const [filterInstructor, setFilterInstructor] = useState<string | null>(null);

  // Event modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<
    Partial<Event> & {
      description?: string;
      recurrence?: string;
      startTime?: string;
      endTime?: string;
    }
  >({});

  // Initialize data
  const initializeData = useCallback(async () => {
    try {
      const [instructorsRes, meetingRoomsRes] = await Promise.all([
        API.getInstructors(),
        API.getMeetingRooms(),
      ]);

      const formattedInstructors = instructorsRes.map(
        (inst: { name: any }, index: any) => ({
          value: String(index),
          label: inst.name,
        })
      );

      const formattedRooms = meetingRoomsRes.map(
        (room: { name: any }, index: any) => ({
          value: String(index),
          label: room.name,
        })
      );

      const formattedRoomsExtra = meetingRoomsRes.map(
        (room: { name: any; capacity: any }, index: any) => ({
          value: String(index),
          label: `${room.name} | Kapasite: ${room.capacity}`,
        })
      );

      setInstructors(formattedInstructors);
      setRooms(formattedRooms);
      setRoomsExtra(formattedRoomsExtra);

      await loadEvents();
      setLoaded(true);
    } catch (error) {
      console.error("Initialization error:", error);
      toast.error("Veri yüklenirken bir hata oluştu");
    }
  }, []);

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      const response = await API.getMeetingEvents();
      const processedEvents = processEvents(response);
      setEvents(processedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Etkinlikler yüklenirken bir hata oluştu");
    }
  }, []);

  // Process events from API
  const processEvents = (eventsData: any[]): Event[] => {
    return eventsData.flatMap((event) => {
      const daysInBetween = moment(event.end_date).diff(
        event.start_date,
        "days"
      );
      const excludeDates =
        event.exclude_dates?.map((date: string) =>
          moment(date).format("YYYY-MM-DD")
        ) || [];

      const createEvent = (date: moment.Moment) => {
        if (excludeDates.includes(date.format("YYYY-MM-DD"))) return null;

        return {
          id: event.id,
          title: `${event.instructor} - ${event.room}`,
          start: date
            .set({
              hour: parseInt(event.start_time.slice(0, 2)),
              minute: parseInt(event.start_time.slice(3, 5)),
            })
            .toDate(),
          end: date
            .set({
              hour: parseInt(event.end_time.slice(0, 2)),
              minute: parseInt(event.end_time.slice(3, 5)),
            })
            .toDate(),
          room: event.room,
          instructor: event.instructor,
          is_main: event.is_main,
        };
      };

      switch (event.recurrence) {
        case "d":
        case "o":
          return Array.from({ length: daysInBetween + 1 }, (_, i) =>
            createEvent(moment(event.start_date).add(i, "days"))
          ).filter(Boolean);
        case "w":
          return Array.from({ length: Math.ceil(daysInBetween / 7) }, (_, i) =>
            createEvent(moment(event.start_date).add(i * 7, "days"))
          ).filter(Boolean);
        case "m":
          return Array.from({ length: Math.ceil(daysInBetween / 30) }, (_, i) =>
            createEvent(moment(event.start_date).add(i * 30, "days"))
          ).filter(Boolean);
        default:
          return [];
      }
    });
  };

  // Filter events
  useEffect(() => {
    if (!filterRoom && !filterInstructor) {
      setFilteredEvents(null);
      return;
    }

    const filtered = events.filter((event) => {
      const roomMatch = !filterRoom || event.room === filterRoom;
      const instructorMatch =
        !filterInstructor || event.instructor === filterInstructor;
      return roomMatch && instructorMatch;
    });

    setFilteredEvents(filtered);
  }, [events, filterRoom, filterInstructor]);

  // Check authentication
  const checkAuth = useCallback(async () => {
    try {
      const res = await API.handleAuth();
      if (!res.loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/login");
    }
  }, [router]);

  // Initialize on mount
  useEffect(() => {
    checkAuth();
    initializeData();
  }, [checkAuth, initializeData]);

  // Event styling
  const eventStyleGetter = (event: Event) => {
    let backgroundColor = colors.class0;

    if (event.is_main) {
      backgroundColor = colors.metu_red;
    } else if (event.room.startsWith("D")) {
      backgroundColor = colors.class1;
    } else if (event.room.startsWith("E")) {
      backgroundColor = colors.class2;
    } else if (event.room.startsWith("A")) {
      backgroundColor = colors.class3;
    }

    return {
      style: {
        backgroundColor,
        color: "black",
        fontWeight: "bold",
        borderRadius: "4px",
        border: "none",
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event: Event) => {
    const startTime = moment(event.start).format("HH:mm:ss");
    const endTime = moment(event.end).format("HH:mm:ss");

    setCurrentEvent({
      ...event,
      startTime,
      endTime,
      startDate: event.start,
      endDate: event.end,
      recurrence: "o", // Default to single occurrence for edits
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setCurrentEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      startDate: slotInfo.start,
      endDate: slotInfo.end,
      is_main: false,
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Save event
  const saveEvent = async () => {
    try {
      const {
        id,
        instructor,
        room,
        startDate,
        endDate,
        startTime,
        endTime,
        recurrence,
        is_main,
        description,
      } = currentEvent;

      if (
        !instructor ||
        !room ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime ||
        !recurrence
      ) {
        toast.error("Lütfen tüm alanları doldurun");
        return;
      }

      if (recurrence === "o" && !moment(startDate).isSame(endDate, "day")) {
        toast.error("Tek seferlik işlemlerde tarihler aynı gün olmalıdır!");
        return;
      }

      if (isEditing && id) {
        await API.updateMeetingEvent(
          id,
          description || "",
          instructor,
          startDate,
          endDate,
          startTime,
          endTime,
          recurrence,
          room,
          is_main || false
        );
        toast.success("Toplantı başarıyla güncellendi");
      } else {
        await API.createMeetingEvent(
          description || "",
          instructor,
          startDate,
          endDate,
          startTime,
          endTime,
          recurrence,
          room,
          is_main || false
        );
        toast.success("Toplantı başarıyla oluşturuldu");
      }

      await loadEvents();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Toplantı kaydedilirken bir hata oluştu");
    }
  };

  // Delete event
  const deleteEvent = async (deleteAll: boolean) => {
    try {
      if (!currentEvent.id) return;

      if (deleteAll) {
        await API.deleteMeetingEvents(currentEvent.id);
      } else {
        await API.deleteMeetingEvent(
          currentEvent.id,
          moment(currentEvent.start).format("YYYY-MM-DD")
        );
      }

      toast.success("Toplantı başarıyla silindi");
      await loadEvents();
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Toplantı silinirken bir hata oluştu");
    }
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full md:w-64">
            <Creatable
              options={[{ label: "Hepsi", value: "" }, ...rooms]}
              onChange={(option) =>
                setFilterRoom(
                  option?.label === "Hepsi" ? null : option?.label || null
                )
              }
              value={{ label: filterRoom || "Yer", value: filterRoom || "" }}
              placeholder="Yer seçin"
            />
          </div>

          <div className="w-full md:w-64">
            <Creatable
              options={[{ label: "Hepsi", value: "" }, ...instructors]}
              onChange={(option) =>
                setFilterInstructor(
                  option?.label === "Hepsi" ? null : option?.label || null
                )
              }
              value={{
                label: filterInstructor || "Hoca",
                value: filterInstructor || "",
              }}
              placeholder="Hoca seçin"
            />
          </div>

          <button
            onClick={() => {
              setFilterRoom(null);
              setFilterInstructor(null);
            }}
            className="btn btn-error"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Calendar
            localizer={localizer}
            events={filteredEvents || events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh" }}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventStyleGetter}
            messages={{
              date: "Tarih",
              time: "Zaman",
              event: "Toplantı",
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
              showMore: (count) => `+${count} etkinlik`,
              noEventsInRange: "Bu aralıkta toplantı bulunamadı.",
            }}
          />
        </div>
      </div>

      {/* Event Modal */}
      {modalVisible && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Toplantı Düzenle" : "Yeni Toplantı Ekle"}
              </h3>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => setModalVisible(false)}
              >
                <IoMdClose />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Yer</span>
                  </label>
                  <Creatable
                    options={roomsExtra}
                    onChange={(option) =>
                      setCurrentEvent({
                        ...currentEvent,
                        room: option?.label.split("|")[0].trim() || "",
                      })
                    }
                    value={{
                      label: currentEvent.room || "",
                      value: currentEvent.room || "",
                    }}
                    placeholder="Yer seçin"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Hoca</span>
                  </label>
                  <Creatable
                    options={instructors}
                    onChange={(option) =>
                      setCurrentEvent({
                        ...currentEvent,
                        instructor: option?.label || "",
                      })
                    }
                    value={{
                      label: currentEvent.instructor || "",
                      value: currentEvent.instructor || "",
                    }}
                    placeholder="Hoca seçin"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Tekrar Sıklığı</span>
                  </label>
                  <Creatable
                    options={recurrenceOptions}
                    onChange={(option) =>
                      setCurrentEvent({
                        ...currentEvent,
                        recurrence: option?.value || "",
                      })
                    }
                    value={recurrenceOptions.find(
                      (opt) => opt.value === currentEvent.recurrence
                    )}
                    placeholder="Tekrar sıklığı seçin"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Açıklama</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={currentEvent.description || ""}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        description: e.target.value,
                      })
                    }
                    placeholder="Açıklama"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Başlangıç Tarihi</span>
                  </label>
                  <DatePicker
                    selected={currentEvent.startDate}
                    onChange={(date) =>
                      setCurrentEvent({
                        ...currentEvent,
                        startDate: date || new Date(),
                      })
                    }
                    className="input input-bordered w-full"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Bitiş Tarihi</span>
                  </label>
                  <DatePicker
                    selected={currentEvent.endDate}
                    onChange={(date) =>
                      setCurrentEvent({
                        ...currentEvent,
                        endDate: date || new Date(),
                      })
                    }
                    className="input input-bordered w-full"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Başlangıç Saati</span>
                  </label>
                  <Creatable
                    options={timeOptions}
                    onChange={(option) =>
                      setCurrentEvent({
                        ...currentEvent,
                        startTime: option?.value || "",
                      })
                    }
                    value={timeOptions.find(
                      (opt) => opt.value === currentEvent.startTime
                    )}
                    placeholder="Başlangıç saati seçin"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Bitiş Saati</span>
                  </label>
                  <Creatable
                    options={timeOptions}
                    onChange={(option) =>
                      setCurrentEvent({
                        ...currentEvent,
                        endTime: option?.value || "",
                      })
                    }
                    value={timeOptions.find(
                      (opt) => opt.value === currentEvent.endTime
                    )}
                    placeholder="Bitiş saati seçin"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={currentEvent.is_main || false}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      is_main: e.target.checked,
                    })
                  }
                />
                <span className="label-text">Bölüm başkanlığı toplantısı</span>
              </label>
            </div>

            <div className="modal-action">
              {isEditing && (
                <>
                  <button
                    className="btn btn-error"
                    onClick={() => deleteEvent(false)}
                  >
                    Sadece Bunu Sil
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => deleteEvent(true)}
                  >
                    Hepsini Sil
                  </button>
                </>
              )}
              <button className="btn btn-primary" onClick={saveEvent}>
                <FaRegSave className="mr-2" />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
