import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const Conversation = () => {
  const toast = useRef(null);
  const [data, setData] = useState([
    {
      agent_name: "sakshi",
      total_calls: 12,
      avg_call_length: "4m 20s",
      shortest_call_score: 65,
      longest_call_score: 92,
      total_talk_time: "52m",
      avg_call_score: 78,
      _id: "68d39c048a72142eb53e7ee0",
    },
    {
      agent_name: "ss",
      total_calls: 8,
      avg_call_length: "3m 15s",
      shortest_call_score: 55,
      longest_call_score: 89,
      total_talk_time: "26m",
      avg_call_score: 71,
      _id: "68d39c048a72142eb53e7ee0",
    },
    {
      agent_name: "dummy1",
      total_calls: 15,
      avg_call_length: "5m 02s",
      shortest_call_score: 61,
      longest_call_score: 95,
      total_talk_time: "1h 12m",
      avg_call_score: 82,
      _id: "68d39c048a72142eb53e7ee0",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [analysisOptions] = useState([
    { label: "5 calls", value: 5 },
    { label: "10 calls", value: 10 },
    { label: "15 calls", value: 15 },
    { label: "All calls", value: "all" },
  ]);
  const navigate = useNavigate();

  const analysisButtonTemplate = (rowData, type) => {
    const score =
      type === "short" ? rowData.shortest_call_score : rowData.longest_call_score;

    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{score}</span>
        <Button
          label="View Analysis"
          size="small"
          severity={type === "short" ? "secondary" : "help"}
          onClick={() =>
            navigate(`/report/${rowData._id}`)
          }
        />
      </div>
    );
  };

  const dropdownWithButtonTemplate = (rowData) => {
    const [selectedValue, setSelectedValue] = useState(null);

    return (
      <div className="flex gap-2 items-center">
        <Dropdown
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.value)}
          options={analysisOptions}
          placeholder="Select"
          className="w-32"
        />
        <Button
          label="Analyse"
          size="small"
          onClick={() =>
            navigate(`/report/${rowData._id}`)
          }
        />
      </div>
    );
  };

  useEffect(() => {
    // fetchData();
  }, []);

  return (
    <div className="my-10">
      <Toast ref={toast} />
      <div className="text-3xl">Employee Call Logs</div>
      {loading ? (
        <div className="my-5 h-full">
          <Skeleton height="400px" width="100%" borderRadius="10px" />
        </div>
      ) : (
        <div className="my-5 h-full">
          {data.length > 0 ? (
            <DataTable
              value={data}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              tableStyle={{ minWidth: "100%" }}
              className="custom-datatable"
            >
              <Column field="agent_name" header="Employee" />
              <Column field="total_calls" header="Total Calls" />
              <Column field="avg_call_length" header="Avg Call Length" />
              <Column
                header="Shortest Call Score"
                body={(rowData) => analysisButtonTemplate(rowData, "short")}
              />
              <Column
                header="Longest Call Score"
                body={(rowData) => analysisButtonTemplate(rowData, "long")}
              />
              <Column field="total_talk_time" header="Total Talk Time" />
              <Column field="avg_call_score" header="Avg Call Score" />
              <Column
                header="More Analysis"
                body={(rowData) => dropdownWithButtonTemplate(rowData)}
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
