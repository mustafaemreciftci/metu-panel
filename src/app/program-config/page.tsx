"use client";

import { IoMdClose } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { OrbitProgress } from "react-loading-indicators";
import Header from "@root/components/Header";
import { API } from "@root/utils/API";
import { colors } from "@root/utils/colors";
import "moment/locale/tr.js";

type Resource = {
  value: number;
  label: string;
};

type ResourceType = "instructor" | "class" | "classRoom" | "meetingRoom";

export default function Config() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // State
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState<ResourceType>("instructor");
  const [modalType, setModalType] = useState<ResourceType>("instructor");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    examCapacity: "",
  });

  // Resources data
  const [resources, setResources] = useState<Record<ResourceType, Resource[]>>({
    instructor: [],
    class: [],
    classRoom: [],
    meetingRoom: [],
  });

  // Auth check
  const checkAuth = useCallback(async () => {
    try {
      const res = await API.handleAuth();
      if (!res.loggedIn) {
        router.push("/login");
      } else if (res.role !== "admin") {
        router.push("/class-program");
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/login");
    }
  }, [router]);

  // Fetch all resources
  const fetchResources = useCallback(async (resourceType?: ResourceType) => {
    try {
      if (!resourceType) {
        // Initial load - fetch all resources
        const [classes, classRooms, instructors, meetingRooms] =
          await Promise.all([
            API.getClasses(),
            API.getClassRooms(),
            API.getInstructors(),
            API.getMeetingRooms(),
          ]);

        setResources({
          instructor: formatResources(instructors, "name"),
          class: formatResources(classes, "name"),
          classRoom: formatResources(classRooms, "name"),
          meetingRoom: formatResources(meetingRooms, "name"),
        });
      } else {
        // Refresh specific resource
        let response: any[];
        switch (resourceType) {
          case "instructor":
            response = await API.getInstructors();
            setResources((prev) => ({
              ...prev,
              instructor: formatResources(response, "name"),
            }));
            break;
          case "class":
            response = await API.getClasses();
            setResources((prev) => ({
              ...prev,
              class: formatResources(response, "name"),
            }));
            break;
          case "classRoom":
            response = await API.getClassRooms();
            setResources((prev) => ({
              ...prev,
              classRoom: formatResources(response, "name"),
            }));
            break;
          case "meetingRoom":
            response = await API.getMeetingRooms();
            setResources((prev) => ({
              ...prev,
              meetingRoom: formatResources(response, "name"),
            }));
            break;
        }
      }
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }, []);

  // Format API response to Resource array
  const formatResources = (data: any[], nameKey: string): Resource[] => {
    return data
      .map((item, index) => ({
        value: index,
        label: item[nameKey],
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Open modal for adding new resource
  const openAddModal = (type: ResourceType) => {
    setModalType(type);
    setFormData({ name: "", capacity: "", examCapacity: "" });
    dialogRef.current?.showModal();
  };

  // Handle resource deletion
  const handleDelete = async (resourceType: ResourceType, label: string) => {
    try {
      switch (resourceType) {
        case "instructor":
          await API.deleteInstructor(label);
          break;
        case "class":
          await API.deleteClass(label);
          break;
        case "classRoom":
          await API.deleteClassRoom(label);
          break;
        case "meetingRoom":
          await API.deleteMeetingRoom(label);
          break;
      }
      await fetchResources(resourceType);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  // Handle resource creation
  const handleCreate = async () => {
    try {
      switch (modalType) {
        case "instructor":
          await API.addInstructor(formData.name);
          break;
        case "class":
          await API.addClass(formData.name);
          break;
        case "classRoom":
          await API.addClassRoom(
            formData.name,
            formData.capacity,
            formData.examCapacity
          );
          break;
        case "meetingRoom":
          await API.addMeetingRoom(formData.name, formData.capacity);
          break;
      }
      dialogRef.current?.close();
      await fetchResources(modalType);
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  // Initial load
  useEffect(() => {
    checkAuth();
    fetchResources();
  }, [checkAuth, fetchResources]);

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

  // Render form fields based on resource type
  const renderFormFields = () => {
    switch (modalType) {
      case "instructor":
        return (
          <input
            type="text"
            className="input focus:outline-0 w-full"
            placeholder="Hocanın tam adı"
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
        );
      case "class":
        return (
          <input
            type="text"
            placeholder="Dersin adı"
            className="input focus:outline-0 w-full"
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
        );
      case "classRoom":
        return (
          <>
            <input
              type="text"
              className="input focus:outline-0 w-full"
              value={formData.name}
              onChange={(e) => handleInputChange(e, "name")}
              placeholder="Sınıf adı"
            />
            <div className="h-4" />
            <input
              type="number"
              className="input focus:outline-0 w-full"
              value={formData.capacity}
              onChange={(e) => handleInputChange(e, "capacity")}
              placeholder="Sınıf kapasitesi"
            />
            <div className="h-4" />
            <input
              type="number"
              className="input focus:outline-0 w-full"
              value={formData.examCapacity}
              onChange={(e) => handleInputChange(e, "examCapacity")}
              placeholder="Sınıf sınav kapasitesi"
            />
          </>
        );
      case "meetingRoom":
        return (
          <>
            <input
              type="text"
              className="input focus:outline-0 w-full"
              value={formData.name}
              onChange={(e) => handleInputChange(e, "name")}
              placeholder="Toplantı odası adı"
            />
            <div className="h-4" />
            <input
              type="number"
              className="input focus:outline-0 w-full"
              value={formData.capacity}
              onChange={(e) => handleInputChange(e, "capacity")}
              placeholder="Toplantı odası kapasitesi"
            />
          </>
        );
    }
  };

  // Get modal title based on resource type
  const getModalTitle = () => {
    switch (modalType) {
      case "instructor":
        return "Hoca Ekle";
      case "class":
        return "Ders Ekle";
      case "classRoom":
        return "Sınıf Ekle";
      case "meetingRoom":
        return "Toplantı Odası Ekle";
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <fieldset className="fieldset mb-6">
          <legend className="fieldset-legend">Kategoriler</legend>
          <select
            onChange={(e) => setCategory(e.target.value as ResourceType)}
            value={category}
            className="select select-bordered"
          >
            <option value="instructor">Hoca</option>
            <option value="class">Ders</option>
            <option value="classRoom">Sınıf</option>
            <option value="meetingRoom">Toplantı Odası</option>
          </select>
        </fieldset>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="w-3/4">İsim</th>
                  <th className="w-1/4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {resources[category].map((item) => (
                  <tr key={item.value}>
                    <td>{item.label}</td>
                    <td>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(category, item.label)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => openAddModal(category)}
          className="btn btn-primary mt-8"
        >
          Ekle
        </button>
      </div>

      {/* Add Resource Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">{getModalTitle()}</h3>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => dialogRef.current?.close()}
            >
              <IoMdClose />
            </button>
          </div>

          <div className="space-y-4">{renderFormFields()}</div>

          <div className="modal-action">
            <button onClick={handleCreate} className="btn btn-primary">
              <FaRegSave className="mr-2" />
              Kaydet
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
