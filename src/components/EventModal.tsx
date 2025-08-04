import React, { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  rooms: any[];
  courses: any[];
  instructors: any[];
  onSave: (data: any) => Promise<void>;
  onDelete: (deleteAll: boolean) => Promise<void>;
}

const recurrenceOptions = [
  { value: "o", label: "Tek sefer" },
  { value: "d", label: "Her gün" },
  { value: "w", label: "Her hafta" },
  { value: "m", label: "Her ay" },
];

const timeOptions = [
  { value: "8:40:00", label: "8:40" },
  { value: "9:40:00", label: "9:40" },
  // Add all other time options...
];

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  rooms,
  courses,
  instructors,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    room: null,
    class: null,
    instructor: null,
    recurrence: null,
    startDate: new Date(),
    endDate: new Date(),
    startTime: null,
    endTime: null,
    isExam: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        room: { label: event.room, value: event.room },
        class: { label: event.class, value: event.class },
        instructor: { label: event.instructor, value: event.instructor },
        recurrence: recurrenceOptions.find((opt) => opt.value === "o") || null,
        startDate: new Date(event.start),
        endDate: new Date(event.end),
        startTime:
          timeOptions.find((opt) =>
            opt.value.includes(
              event.start.getHours() + ":" + event.start.getMinutes()
            )
          ) || null,
        endTime:
          timeOptions.find((opt) =>
            opt.value.includes(
              event.end.getHours() + ":" + event.end.getMinutes()
            )
          ) || null,
        isExam: event.is_exam,
      });
    } else {
      setFormData({
        room: null,
        class: null,
        instructor: null,
        recurrence: null,
        startDate: new Date(),
        endDate: new Date(),
        startTime: null,
        endTime: null,
        isExam: false,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.room ||
        !formData.class ||
        !formData.instructor ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.startTime ||
        !formData.endTime ||
        !formData.recurrence
      ) {
        throw new Error("Lütfen tüm alanları doldurun");
      }

      if (
        formData.recurrence.value === "o" &&
        !moment(formData.startDate).isSame(formData.endDate, "day")
      ) {
        throw new Error("Tek seferlik işlemlerde tarihler aynı gün olmalıdır!");
      }

      await onSave({
        id: event?.id,
        room: formData.room.label,
        class: formData.class.label,
        instructor: formData.instructor.label,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime.value,
        endTime: formData.endTime.value,
        recurrence: formData.recurrence.value,
        isExam: formData.isExam,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {event ? "Ders Düzenle" : "Yeni Ders Ekle"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yer
                </label>
                <CreatableSelect
                  options={rooms}
                  value={formData.room}
                  onChange={(option) =>
                    setFormData({ ...formData, room: option })
                  }
                  placeholder="Yer seçin"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ders
                </label>
                <CreatableSelect
                  options={courses}
                  value={formData.class}
                  onChange={(option) =>
                    setFormData({ ...formData, class: option })
                  }
                  placeholder="Ders seçin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hoca
                </label>
                <CreatableSelect
                  options={instructors}
                  value={formData.instructor}
                  onChange={(option) =>
                    setFormData({ ...formData, instructor: option })
                  }
                  placeholder="Hoca seçin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tekrar
                </label>
                <CreatableSelect
                  options={recurrenceOptions}
                  value={formData.recurrence}
                  onChange={(option) =>
                    setFormData({ ...formData, recurrence: option })
                  }
                  placeholder="Tekrar sıklığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) =>
                    setFormData({ ...formData, startDate: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) =>
                    setFormData({ ...formData, endDate: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Saati
                </label>
                <CreatableSelect
                  options={timeOptions}
                  value={formData.startTime}
                  onChange={(option) =>
                    setFormData({ ...formData, startTime: option })
                  }
                  placeholder="Başlangıç saati"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Saati
                </label>
                <CreatableSelect
                  options={timeOptions}
                  value={formData.endTime}
                  onChange={(option) =>
                    setFormData({ ...formData, endTime: option })
                  }
                  placeholder="Bitiş saati"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isExam"
                checked={formData.isExam}
                onChange={(e) =>
                  setFormData({ ...formData, isExam: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isExam"
                className="ml-2 block text-sm text-gray-700"
              >
                Sınavlar için bu kutucuğu işaretleyin.
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {event && (
                <>
                  <button
                    type="button"
                    onClick={() => onDelete(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Sadece Bunu Sil
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(true)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 disabled:opacity-50"
                  >
                    Hepsini Sil
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  "Kaydediliyor..."
                ) : (
                  <>
                    <FaRegSave className="mr-2" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
