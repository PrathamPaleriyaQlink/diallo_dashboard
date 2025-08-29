import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";

export default function Home() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [agentName, setAgentName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const [ttsModel, setTtsModel] = useState("deepgram");
  const modelOptions = [
    { label: "G", value: "groq" },
    { label: "O", value: "openai" },
    { label: "D", value: "deepgram" },
  ];

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && (f.type.startsWith("audio/") || f.name.toLowerCase().endsWith(".gsm"))) {
      setFile(f);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Invalid File",
        detail: "Please upload a valid audio or .gsm file.",
        life: 3000,
      });
    }
  };

  const resetFields = () => {
    window.location.reload();
  };

  const handleUpload = async () => {
    if (!file || !agentName || !patientName || !patientPhone) {
      toast.current.show({
        severity: "error",
        summary: "Missing Fields",
        detail: "Please fill all fields and upload a file.",
        life: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agent_name", agentName);
      formData.append("patient_name", patientName);
      formData.append("agent_phone_number", patientPhone);

      const res = await fetch(
        `https://diallo-backend.onrender.com/transcribe?tts_model=${ttsModel}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.success) {
        setAnalysis(data.analysis);
        toast.current.show({
          severity: "success",
          summary: "Uploaded",
          detail: "Analysis complete.",
          life: 2000,
        });

        // Navigate to report/{id}
        navigate(`/report/${data.response}`);
      } else {
        throw new Error(data.response || "Unknown error");
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Upload Failed",
        detail: err.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-[60%] space-y-5 p-6 mx-auto my-20">
      <Toast ref={toast} />
      <div className="flex items-center justify-between gap-5">
      <h2 className="text-2xl mb-4">Upload Call Recording</h2>

      <Dropdown
        value={ttsModel}
        options={modelOptions}
        onChange={(e) => setTtsModel(e.value)}
        placeholder="Select Model"
        className="mb-3 w-40"
      />
      </div>

      <label className="py-4 rounded cursor-pointer hover:bg-gray-300/40 transition-all text-black border border-dotted inline-block w-full text-center">
        Choose Audio File
        <input
          type="file"
          accept=".mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm,.gsm"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="text-sm">
          Selected file: <strong>{file.name}</strong>
        </div>
      )}

      <div className="mt-5">
        <InputText
          placeholder="Enter agent name"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <InputText
          placeholder="Enter patient name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full mb-3"
        />
      </div>
      <div>
        <InputText
          placeholder="Enter patient phone number"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
          className="w-full mb-3"
        />
      </div>

      <div className="flex gap-3">
        <Button
          label="Run Analysis"
          loading={loading}
          onClick={handleUpload}
          className="flex-1"
        />
        <Button
          label="Reset Fields"
          severity="danger"
          outlined
          onClick={resetFields}
          className="flex-1"
        />
      </div>

      {analysis && (
        <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap mt-5">
          {JSON.stringify(analysis, null, 2)}
        </div>
      )}
    </div>
  );
}
