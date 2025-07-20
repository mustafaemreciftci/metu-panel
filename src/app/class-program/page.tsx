"use client";

import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { Calendar, momentLocalizer } from "react-big-calendar";
import dynamic from "next/dynamic";
import { OrbitProgress } from "react-loading-indicators";

// Lazy load heavy components
const DynamicCreatable = dynamic(
  () => import("react-select/creatable").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const DynamicEventModal = dynamic(() => import("@root/components/EventModal"), {
  ssr: false,
});

// Components
const Header = dynamic(() => import("@root/components/Header"), { ssr: false });

// Utils
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";
import { debounce } from "@root/utils/helpers";

import "moment/locale/tr.js";

// Types
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  class: string;
  room: string;
  instructor: string;
  is_exam: boolean;
}

interface Option {
  value: string;
  label: string;
}

const localizer = momentLocalizer(moment);

const ClassProgramPage = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null);

  // Filter states
  const [filterRoom, setFilterRoom] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [filterInstructor, setFilterInstructor] = useState<string | null>(null);

  // Data options
  const [rooms, setRooms] = useState<Option[]>([]);
  const [roomsExtra, setRoomsExtra] = useState<Option[]>([]);
  const [courses, setCourses] = useState<Option[]>([]);
  const [instructors, setInstructors] = useState<Option[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const classResponse = await API.getClasses();
      const instructorsResponse = await API.getInstructors();
      const classRoomsResponse = await API.getClassRooms();

      console.log(instructorsResponse);

      // Process instructors
      const instructorsData = instructorsResponse
        .map((instructor: { name: any }, index: any) => ({
          value: String(index),
          label: instructor.name,
        }))
        .sort((a: { label: string }, b: { label: any }) =>
          a.label.localeCompare(b.label)
        );

      // Process courses
      const coursesData = classResponse
        .map((cls: { name: any }, index: any) => ({
          value: String(index),
          label: cls.name,
        }))
        .sort((a: { label: string }, b: { label: any }) =>
          a.label.localeCompare(b.label)
        );

      // Process rooms
      const roomsData = classRoomsResponse.map(
        (room: { name: any }, index: any) => ({
          value: String(index),
          label: room.name,
        })
      );

      const roomsExtraData = classRoomsResponse.map(
        (
          room: { name: any; capacity: any; exam_capacity: any },
          index: any
        ) => ({
          value: String(index),
          label: `${room.name} | Kapasite: ${room.capacity}, Sınav Kapasitesi: ${room.exam_capacity}`,
        })
      );

      setInstructors(instructorsData);
      setCourses(coursesData);
      setRooms(roomsData);
      setRoomsExtra(roomsExtraData);

      await fetchEvents();
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Veri yüklenirken bir hata oluştu");
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await API.getClassEvents();
      const processedEvents = processEvents(response);
      setEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Etkinlikler yüklenirken bir hata oluştu");
    }
  }, []);

  const processEvents = useCallback((eventsData: any[]): Event[] => {
    return eventsData.flatMap((event) => {
      const daysInBetween = moment(event.end_date).diff(
        event.start_date,
        "days"
      );
      const excludeDates =
        event.exclude_dates?.map((date: string) =>
          moment(date).format("YYYY-MM-DD")
        ) || [];

      // Process based on recurrence
      switch (event.recurrence) {
        case "d":
        case "o":
          return Array.from(
            { length: parseInt(daysInBetween.toString()) + 1 },
            (_, i) => {
              const date = moment(event.start_date).add(i, "days");
              if (excludeDates.includes(date.format("YYYY-MM-DD"))) return null;

              return createEventObject(event, date);
            }
          ).filter(Boolean);

        case "w":
          return Array.from(
            { length: Math.ceil(daysInBetween / 7) },
            (_, i) => {
              const date = moment(event.start_date).add(i * 7, "days");
              if (excludeDates.includes(date.format("YYYY-MM-DD"))) return null;

              return createEventObject(event, date);
            }
          ).filter(Boolean);

        case "m":
          return Array.from(
            { length: Math.ceil(daysInBetween / 30) },
            (_, i) => {
              const date = moment(event.start_date).add(i * 30, "days");
              if (excludeDates.includes(date.format("YYYY-MM-DD"))) return null;

              return createEventObject(event, date);
            }
          ).filter(Boolean);

        default:
          return [];
      }
    });
  }, []);

  const createEventObject = (event: any, date: moment.Moment): Event => ({
    id: event.id,
    title: `${event.class} - ${event.instructor} - ${event.room}`,
    start: date
      .set({
        hours: parseInt(event.start_time.slice(0, 2)),
        minutes: parseInt(event.start_time.slice(3, 5)),
      })
      .toDate(),
    end: date
      .set({
        hours: parseInt(event.end_time.slice(0, 2)),
        minutes: parseInt(event.end_time.slice(3, 5)),
      })
      .toDate(),
    class: event.class,
    room: event.room,
    instructor: event.instructor,
    is_exam: event.is_exam,
  });

  // Filter events with debounce
  const filterEvents = useCallback(
    debounce(() => {
      if (!filterRoom && !filterClass && !filterInstructor) {
        setFilteredEvents(null);
        return;
      }

      const filtered = events.filter((event) => {
        const roomMatch = !filterRoom || event.room === filterRoom;
        const classMatch = !filterClass || event.class === filterClass;
        const instructorMatch =
          !filterInstructor || event.instructor === filterInstructor;

        return roomMatch && classMatch && instructorMatch;
      });

      setFilteredEvents(filtered);
    }, 300),
    [events, filterRoom, filterClass, filterInstructor]
  );

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  // Auth check
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

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [checkAuth, fetchData]);

  // Event styling
  const eventStyleGetter = useCallback((event: Event) => {
    const classType = event.class.match(/(\d+)/)?.[0]?.[0] || "0";
    let backgroundColor = colors.class0;

    if (event.is_exam) {
      backgroundColor = colors.exam;
    } else {
      switch (classType) {
        case "1":
          backgroundColor = colors.class1;
          break;
        case "2":
          backgroundColor = colors.class2;
          break;
        case "3":
          backgroundColor = colors.class3;
          break;
        case "4":
          backgroundColor = colors.class4;
          break;
      }
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
  }, []);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterRoom(null);
    setFilterClass(null);
    setFilterInstructor(null);
    setFilteredEvents(null);
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <OrbitProgress color={colors.metu_red} size="small" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 p-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-white rounded-lg shadow">
          <div className="w-full md:w-auto">
            <DynamicCreatable
              className="min-w-[200px]"
              onChange={(option: any) =>
                setFilterRoom(option?.label === "Hepsi" ? null : option?.label)
              }
              value={{ label: filterRoom || "Yer", value: filterRoom || "" }}
              placeholder="Yer"
              options={[{ label: "Hepsi", value: "all" }, ...rooms]}
              isClearable
            />
          </div>

          <div className="w-full md:w-auto">
            <DynamicCreatable
              className="min-w-[200px]"
              onChange={(option: any) =>
                setFilterClass(option?.label === "Hepsi" ? null : option?.label)
              }
              value={{ label: filterClass || "Ders", value: filterClass || "" }}
              placeholder="Ders"
              options={[{ label: "Hepsi", value: "all" }, ...courses]}
              isClearable
            />
          </div>

          <div className="w-full md:w-auto">
            <DynamicCreatable
              className="min-w-[200px]"
              onChange={(option: any) =>
                setFilterInstructor(
                  option?.label === "Hepsi" ? null : option?.label
                )
              }
              value={{
                label: filterInstructor || "Hoca",
                value: filterInstructor || "",
              }}
              placeholder="Hoca"
              options={[{ label: "Hepsi", value: "all" }, ...instructors]}
              isClearable
            />
          </div>

          <button
            onClick={handleClearFilters}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            aria-label="Filtreleri temizle"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <Calendar
            localizer={localizer}
            events={filteredEvents || events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh" }}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={() => setIsModalOpen(true)}
            eventPropGetter={eventStyleGetter}
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
              showMore: (count) => `+${count} etkinlik`,
              noEventsInRange: "Bu aralıkta dolu gün bulunamadı.",
            }}
          />
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <DynamicEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          rooms={roomsExtra}
          courses={courses}
          instructors={instructors}
          onSave={async (eventData) => {
            try {
              if (selectedEvent) {
                await API.updateClassEvent(
                  selectedEvent.id,
                  eventData.title,
                  eventData.start,
                  eventData.end,
                  eventData.roomId,
                  eventData.courseId,
                  eventData.instructorId,
                  eventData.recurrenceRule,
                  eventData.notes,
                  eventData.color
                );
              } else {
                await API.createClassEvent(
                  eventData.title,
                  eventData.start,
                  eventData.end,
                  eventData.roomId,
                  eventData.courseId,
                  eventData.instructorId,
                  eventData.recurrenceRule,
                  eventData.notes,
                  eventData.color
                );
              }
              await fetchEvents();
              setIsModalOpen(false);
              setSelectedEvent(null);
              toast.success("Etkinlik başarıyla kaydedildi");
            } catch (error) {
              console.error("Error saving event:", error);
              toast.error("Etkinlik kaydedilirken bir hata oluştu");
            }
          }}
          onDelete={async (deleteAll) => {
            try {
              if (selectedEvent) {
                if (deleteAll) {
                  await API.deleteClassEvents(selectedEvent.id);
                } else {
                  await API.deleteClassEvent(
                    selectedEvent.id,
                    moment(selectedEvent.start).format("YYYY-MM-DD")
                  );
                }
                await fetchEvents();
                setIsModalOpen(false);
                setSelectedEvent(null);
                toast.success("Etkinlik başarıyla silindi");
              }
            } catch (error) {
              console.error("Error deleting event:", error);
              toast.error("Etkinlik silinirken bir hata oluştu");
            }
          }}
        />
      )}
    </div>
  );
};

export default ClassProgramPage;
