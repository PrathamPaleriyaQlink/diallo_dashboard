import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";

const Person = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();

  const items = [{ label: id }];
  const home = {
    label: "All logs",
    command: () => navigate("/agents"),
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://diallo-backend.onrender.com/docs?doc_id=${id}`
      );
      const json = await res.json();

      if (json.success) {
        setData(json.response);
      } else {
        throw new Error(json.response || "No Data Found");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error occurred while fetching call details. Please refresh.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mb-20">
      <Toast ref={toast} />
      <BreadCrumb
        model={items}
        home={home}
        style={{ background: "transparent", border: "none" }}
      />

      <div className="my-5 h-full px-5">
        {loading ? (
          <div className="space-y-5">
            <Skeleton height="100px" borderRadius="10px" />
            <Skeleton height="300px" borderRadius="10px" />
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div>
              {/* Basic Call Details */}
              <Card title="Basic Details">
                <p className="mb-1">
                  <strong>Agent:</strong> {data.agent_name}
                </p>
                <p className="mb-1">
                  <strong>Customer:</strong> {data.customer_name || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Agent Phone:</strong> {data.agent_phone_number}
                </p>
                <p className="mb-1">
                  <strong>Call Date:</strong>{" "}
                  {new Date(data.created_at).toLocaleString()}
                </p>
              </Card>

              <Divider />

              {/* Call Overview */}
              <Card title="Call Overview" className="shadow-sm mt-4">
                <p className="mb-1">
                  <strong>Disposition:</strong>{" "}
                  {data.analysis.call_disposition || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Summary:</strong> {data.analysis.call_summary}
                </p>
                <p className="mb-1">
                  <strong>Area of Improvement:</strong>{" "}
                  {data.analysis.area_of_improvement}
                </p>
                <p className="mb-1">
                  <strong>Purpose:</strong> {data.analysis.purpose}
                </p>
                <p className="mb-1">
                  <strong>Reason for Delay:</strong>{" "}
                  {data.analysis.reason_for_delay || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Remark:</strong> {data.analysis.remark || "N/A"}
                </p>
              </Card>

              <Divider />

              {/* Scores */}
              <Card title="Performance Scores" className="shadow-sm mt-4">
                {Object.entries(data.analysis.scores || {}).map(
                  ([key, value]) => (
                    <div key={key} className="mb-3">
                      <p className="capitalize">{key.replace(/_/g, " ")}:</p>
                      <ProgressBar
                        value={value * 10}
                        displayValueTemplate={() => `${value}/10`}
                      />
                    </div>
                  )
                )}
              </Card>

              <Divider />

              {/* Improvements */}
              <Card title="Improvements" className="shadow-sm mt-4">
                <ul className="list-disc list-inside">
                  {data.analysis.improvements?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>

              {/* Positives */}
              <Card title="Positives" className="shadow-sm mt-4">
                <ul className="list-disc list-inside">
                  {data.analysis.positives?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Transcript */}
              <Card title="Call Transcript" className="shadow-sm">
                <div className="border border-gray-300 bg-gray-50 p-5 rounded-md whitespace-pre-line max-h-[400px] overflow-y-auto">
                  {data.transcribe}
                </div>
              </Card>

              <Divider />

              {/* Marked Transcript */}
              <Card title="Marked Transcript" className="shadow-sm mt-4">
                <div className="border border-gray-300 bg-gray-50 p-5 rounded-md whitespace-pre-line max-h-[400px] overflow-y-auto">
                  {data.analysis.marked_transcript &&
                  data.analysis.marked_transcript.trim() !== ""
                    ? data.analysis.marked_transcript
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, idx) => (
                          <p key={idx} className="mb-2 font-mono text-sm">
                            {line}
                          </p>
                        ))
                    : "N/A"}
                </div>
              </Card>

              {/* Unresolved Issues */}
              <Card title="Unresolved Issues" className="shadow-sm mt-4">
                {data.analysis.unresolved_issues?.length > 0
                  ? data.analysis.unresolved_issues.join(", ")
                  : "None"}
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No Data Available</div>
        )}
      </div>
    </div>
  );
};

export default Person;
