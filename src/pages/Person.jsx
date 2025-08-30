import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";

const Person = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();

  const items = [{ label: `${id}` }];
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

  // Helper function for sentiment color
  const getSentimentSeverity = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "success";
      case "negative":
        return "danger";
      case "neutral":
        return "warning";
      default:
        return "info";
    }
  };

  // Helper function for score color
  const getScoreColor = (score) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "danger";
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton height="120px" className="mb-2" borderRadius="12px" />
        <Skeleton height="120px" className="mb-2" borderRadius="12px" />
        <Skeleton height="120px" className="mb-2" borderRadius="12px" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton height="400px" borderRadius="12px" />
        <Skeleton height="400px" borderRadius="12px" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toast ref={toast} />
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <BreadCrumb
            model={items}
            home={home}
            className="border-none bg-transparent"
          />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Toast ref={toast} />
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-500 mb-4">Unable to load call report data</p>
          <Button
            label="Go Back"
            icon="pi pi-arrow-left"
            onClick={() => navigate("/agents")}
            className="p-button-outlined"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex w-full justify-between">
        <BreadCrumb model={items} home={home} className="bg-transparent" />
        <Button
          icon="pi pi-refresh"
          onClick={fetchData}
          className="p-button-outlined p-button-sm"
          tooltip="Refresh Data"
        />
      </div>

      <div className="p-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <i className="pi pi-star-fill text-3xl text-blue-600 mb-2"></i>
              <h3 className="text-2xl font-bold text-blue-900">
                {data.analysis.Total_Score}/10
              </h3>
              <p className="text-blue-700 font-medium">Overall Score</p>
            </div>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="p-4">
              <i className="pi pi-heart-fill text-3xl text-green-600 mb-2"></i>
              <h3 className="text-lg font-bold text-green-900 capitalize">
                {data.analysis.Sentiment_overall}
              </h3>
              <p className="text-green-700 font-medium">Overall Sentiment</p>
            </div>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="p-4">
              <i className="pi pi-address-book text-3xl text-yellow-600 mb-2"></i>
              <h3 className="text-lg font-bold text-yellow-900 capitalize">
                {data.bucket}
              </h3>
              <p className="text-yellow-700 font-medium">Bucket</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* LEFT COLUMN - Call Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card title="Call Information" className="shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Agent
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {data.agent_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Patient
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {data.patient_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Phone Number
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {data.agent_phone_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Call Date
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {new Date(data.created_at.$date).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Call Analysis */}
            <Card title="Call Analysis" className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Call Summary
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">
                      {data.analysis.Call_summary}
                    </p>
                  </div>
                </div>

                {/* Improvements and Positives */}
                <div className="space-y-3">
                  <Card title="Areas for Improvement" className="shadow-sm">
                    <div className="space-y-3">
                      {data.analysis.Improvements?.length > 0 ? (
                        data.analysis.Improvements.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <i className="pi pi-exclamation-circle text-red-500 mt-1 flex-shrink-0"></i>
                            <p className="text-gray-700">{point}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          No improvements noted
                        </p>
                      )}
                    </div>
                  </Card>

                  <Card title="Positive Highlights" className="shadow-sm">
                    <div className="space-y-3">
                      {data.analysis.Positives?.length > 0 ? (
                        data.analysis.Positives.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <i className="pi pi-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                            <p className="text-gray-700">{point}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          No positive highlights noted
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </Card>

            <Card title="Additional Details" className="shadow-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Call Purpose
                    </label>
                    <Tag
                      value={data.analysis.Call_purpose}
                      severity="info"
                      className="text-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Payment Discussed
                    </label>
                    <Tag
                      value={data.analysis.Payment_discussed ? "Yes" : "No"}
                      severity={
                        data.analysis.Payment_discussed ? "success" : "danger"
                      }
                      className="text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Agent Sentiment
                    </label>
                    <Tag
                      value={data.analysis.Sentiment_by_speaker.Agent_sentiment}
                      severity={getSentimentSeverity(
                        data.analysis.Sentiment_by_speaker.Agent_sentiment
                      )}
                      className="text-base capitalize"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Customer Sentiment
                    </label>
                    <Tag
                      value={
                        data.analysis.Sentiment_by_speaker.Customer_sentiment
                      }
                      severity={getSentimentSeverity(
                        data.analysis.Sentiment_by_speaker.Customer_sentiment
                      )}
                      className="text-base capitalize"
                    />
                  </div>
                </div>

                {data.analysis.Follow_up_details && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Follow-up Details
                    </label>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-blue-900">
                        {data.analysis.Follow_up_details}
                      </p>
                    </div>
                  </div>
                )}

                {data.analysis.Agent_performance && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Agent Performance
                    </label>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-900">
                        {data.analysis.Agent_performance}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - Transcripts */}
          <div className="space-y-6 col-span-2">
            {/* Call Transcript */}
            <Panel header="Call Transcript" className="shadow-sm" toggleable>
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {data.transcribe}
                </pre>
              </div>
            </Panel>

            {/* Marked Transcript */}
            {data.analysis.Marked_Transcript &&
              data.analysis.Marked_Transcript.trim() !== "" && (
                <Panel
                  header="Marked Transcript"
                  className="shadow-sm"
                  toggleable
                >
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {data.analysis.Marked_Transcript.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <i className="pi pi-bookmark text-yellow-600 mt-1 flex-shrink-0"></i>
                            <p className="text-yellow-900 font-mono text-sm">
                              {line}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </Panel>
              )}

            {/* Unresolved Issues */}
            <Card title="Unresolved Issues" className="shadow-sm">
              <div className="space-y-3">
                {data.analysis.Unresolved_issues?.length > 0 ? (
                  data.analysis.Unresolved_issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400"
                    >
                      <i className="pi pi-exclamation-triangle text-orange-600 mt-1 flex-shrink-0"></i>
                      <p className="text-orange-900">{issue}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <i className="pi pi-check-circle text-green-500 text-2xl mb-2"></i>
                    <p className="text-green-700 font-medium">
                      No unresolved issues
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Performance Scores */}
            <Panel
              header="Performance Breakdown"
              className="shadow-sm"
              toggleable
            >
              <div className="space-y-4">
                {Object.entries(data.analysis.Individual_Scores || {}).map(
                  ([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-bold text-gray-900">
                          {value}/10
                        </span>
                      </div>
                      <ProgressBar
                        value={value * 10}
                        className="h-3"
                        color={
                          value >= 8
                            ? "#22c55e"
                            : value >= 6
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Person;
