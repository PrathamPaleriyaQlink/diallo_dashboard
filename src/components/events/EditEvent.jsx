import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import TextCard from "../ui/TextCard";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { updateEvent } from "../../api_utils/api_routes";

const EditEvent = ({
  data,
  toggleEdit,
  id,
  toggleSuccess,
  toggleError,
  fetchData,
}) => {
  const [editData, setEditData] = useState({
    name: data.name,
    category: data.category,
    date: data.date,
    city: data.city,
    venue: data.venue || "N/A",
  });
  const [loading, setLoading] = useState(false);
  const category = ["Intelligence Series", "iDAC Expo"];

  const handleDateChange = (e) => {
    const utcISOString = e.value.toISOString();
    setEditData({ ...editData, date: utcISOString });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const original = new Date(editData.date);
      const utcMidnight = new Date(
        Date.UTC(
          original.getFullYear(),
          original.getMonth(),
          original.getDate(),
          0,
          0,
          0
        )
      );
      const isoString = utcMidnight.toISOString();
      await updateEvent(id, {
        ...editData,
        date: isoString,
      });
      toggleSuccess();
      fetchData();
      toggleEdit();
    } catch (error) {
      toggleError();
      toggleEdit();
    }
    setLoading(false);
  };

  const handleCancle = () => {
    toggleEdit();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-3xl w-[50%]">
          <InputText
            className="w-full"
            value={editData.name}
            placeholder="Set Title"
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </div>
        <div className="card flex justify-content-center">
          <div className="flex items-center gap-5">
            <Button
              label="Save"
              icon="pi pi-save"
              severity="info"
              loading={loading}
              onClick={handleSave}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              onClick={handleCancle}
            />
          </div>
        </div>
      </div>

      <Divider />
      <div className="flex flex-col lg:flex-row w-full h-full gap-5">
        <div className="w-full lg:w-[50%]">
          <div>
            <div className="space-y-3 my-3">
              <div>Category</div>
              <Dropdown
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.value })
                }
                editable
                options={category.map((c) => c)}
                placeholder="Select a Category"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex gap-6">
              <div className="space-y-3 my-3 w-full">
                <div>Date</div>
                <Calendar
                  value={editData.date ? new Date(editData.date) : null} // correct value source & type
                  onChange={handleDateChange}
                  dateFormat="dd/mm/yy"
                  className="w-full"
                />
              </div>
              <div className="space-y-3 my-3 w-full">
                <div>City</div>
                <InputText
                  className="w-full"
                  value={editData.city}
                  placeholder="Set Title"
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-3 my-3 w-full">
              <div>Venue</div>
              <InputTextarea
                className="w-full"
                value={editData.venue}
                placeholder="Set Venue"
                onChange={(e) =>
                  setEditData({ ...editData, venue: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
