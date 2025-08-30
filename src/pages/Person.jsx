import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

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
                  <strong>Agent:</strong>{" "}
                  <Tag value={data.agent_name} severity="info" />
                </p>
                <p className="mb-1">
                  <strong>Patient:</strong>{" "}
                  <Tag value={data.patient_name} severity="success" />
                </p>
                <p className="mb-1">
                  <strong>Agent Phone:</strong> {data.agent_phone_number}
                </p>
                <p className="mb-1">
                  <strong>Call Date:</strong>{" "}
                  <Tag
                    value={new Date(data.created_at.$date).toLocaleString()}
                    severity="warning"
                  />
                </p>
              </Card>

              <Divider />

              {/* Call Overview */}
              <Card title="Call Overview" className="shadow-sm mt-4">
                <p className="mb-2">
                  <strong>Summary:</strong> {data.analysis.Call_summary}
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong>{" "}
                  <Tag value={data.analysis.Call_purpose} severity="info" />
                </p>
                <p className="mb-2">
                  <strong>Overall Sentiment:</strong>{" "}
                  <Tag
                    value={data.analysis.Sentiment_overall}
                    severity={
                      data.analysis.Sentiment_overall === "positive"
                        ? "success"
                        : data.analysis.Sentiment_overall === "negative"
                        ? "danger"
                        : "warning"
                    }
                  />
                </p>
                <p className="mb-1">
                  <strong>Agent Sentiment:</strong>{" "}
                  <Tag
                    value={data.analysis.Sentiment_by_speaker.Agent_sentiment}
                    severity={
                      data.analysis.Sentiment_by_speaker.Agent_sentiment ===
                      "positive"
                        ? "success"
                        : data.analysis.Sentiment_by_speaker.Agent_sentiment ===
                          "negative"
                        ? "danger"
                        : "warning"
                    }
                  />
                </p>
                <p className="mb-1">
                  <strong>Customer Sentiment:</strong>{" "}
                  <Tag
                    value={data.analysis.Sentiment_by_speaker.Customer_sentiment}
                    severity={
                      data.analysis.Sentiment_by_speaker.Customer_sentiment ===
                      "positive"
                        ? "success"
                        : data.analysis.Sentiment_by_speaker
                            .Customer_sentiment === "negative"
                        ? "danger"
                        : "warning"
                    }
                  />
                </p>
                <p className="mb-1">
                  <strong>Payment Discussed:</strong>{" "}
                  <Tag
                    value={data.analysis.Payment_discussed ? "Yes" : "No"}
                    severity={data.analysis.Payment_discussed ? "success" : "danger"}
                  />
                </p>
                <p className="mb-1">
                  <strong>Payment Amount:</strong>{" "}
                  <Tag value={data.analysis.Payment_amount} severity="warning" />
                </p>
                <p className="mb-1">
                  <strong>Follow-up Required:</strong>{" "}
                  <Tag
                    value={data.analysis.Follow_up_required ? "Yes" : "No"}
                    severity={data.analysis.Follow_up_required ? "info" : "secondary"}
                  />
                </p>
                <p className="mb-1">
                  <strong>Follow-up Details:</strong>{" "}
                  {data.analysis.Follow_up_details}
                </p>
                <p className="mb-1">
                  <strong>Agent Performance:</strong>{" "}
                  {data.analysis.Agent_performance}
                </p>
              </Card>

              <Divider />

              {/* Scores */}
              <Card title="Performance Scores" className="shadow-sm mt-4">
                {Object.entries(data.analysis.Individual_Scores || {}).map(
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
                <p className="mt-2">
                  <strong>Total Score:</strong>{" "}
                  <Tag value={`${data.analysis.Total_Score}/10`} severity="success" />
                </p>
              </Card>

              <Divider />

              {/* Improvements */}
              <Card title="Improvements" className="shadow-sm mt-4">
                <ul className="list-disc list-inside text-red-500">
                  {data.analysis.Improvements?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>

              {/* Positives */}
              <Card title="Positives" className="shadow-sm mt-4">
                <ul className="list-disc list-inside text-green-600">
                  {data.analysis.Positives?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Transcript */}
              <Card title="Call Transcript" className="shadow-sm">
                <div className="border border-gray-300 bg-gray-50 p-5 rounded-md whitespace-pre-line max-h-[400px] overflow-y-auto text-sm">
                  {data.transcribe}
                </div>
              </Card>

              <Divider />

              {/* Marked Transcript */}
              <Card title="Marked Transcript" className="shadow-sm mt-4">
                <div className="border border-gray-300 bg-yellow-50 p-5 rounded-md whitespace-pre-line max-h-[400px] overflow-y-auto">
                  {data.analysis.Marked_Transcript &&
                  data.analysis.Marked_Transcript.trim() !== ""
                    ? data.analysis.Marked_Transcript.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, idx) => (
                          <p key={idx} className="mb-2 font-mono text-sm text-red-600">
                            {line}
                          </p>
                        ))
                    : "N/A"}
                </div>
              </Card>

              {/* Unresolved Issues */}
              <Card title="Unresolved Issues" className="shadow-sm mt-4">
                {data.analysis.Unresolved_issues?.length > 0 ? (
                  <ul className="list-disc list-inside text-orange-600">
                    {data.analysis.Unresolved_issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  "None"
                )}
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
