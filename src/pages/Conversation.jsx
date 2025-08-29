import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";

const Conversation = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://diallo-backend.onrender.com/calls");
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        throw new Error(json.response || "Failed to fetch calls");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error occurred while fetching calls. Please refresh.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="my-10">
      <Toast ref={toast} />
      <div className="text-3xl">All Logs</div>
      {loading ? (
        <div className="my-5 h-full">
          <Skeleton height="400px" width="100%" borderRadius="10px" />
        </div>
      ) : (
        <div className="my-5 h-full">
          {data.length > 0 ? (
            <DataTable
              onRowClick={(e) => navigate(`/report/${e.data._id}`)}
              value={data}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              tableStyle={{ minWidth: "100%" }}
              className="cursor-pointer custom-datatable" 
            >
              <Column
                field="agent_name"
                header="Agent Name"
                filter
                style={{ width: "25%" }}
              />
              <Column
                field="patient_name"
                header="Patient Name"
                filter
                style={{ width: "25%" }}
              />
              <Column
                field="agent_phone_number"
                header="Agent Phone Number"
                filter
                style={{ width: "25%" }}
              />
              <Column
                field="created_at"
                header="Created At"
                sortable
                body={(rowData) =>
                  new Date(rowData.created_at).toLocaleString()
                }
                style={{ width: "25%" }}
              />
            </DataTable>
          ) : (
            <div className="text-gray-400">No Data Available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Conversation;
