"use client";

import { ApiResponse } from "../../page";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Upload, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Importer = ({
  subjects,
  tsid,
  tid,
}: {
  subjects: ApiResponse["data"][0]["subjects"];
  tsid: number;
  tid: number;
}) => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
    data?: {
      code: string;
      file: string;
    };
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      router.push(`/teacher/test-series/${tsid}`);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, router, tsid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateFile(selectedFile);
    }
  };

  const validateFile = (selectedFile: File) => {
    setFileError(null);
    const validExtensions = [".doc", ".docx"];
    const fileExtension = selectedFile.name
      .toLowerCase()
      .substring(selectedFile.name.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension)) {
      setFileError("Please select a .doc or .docx file only");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateFile(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !file || fileError) return;

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getTokenClient();
      const response = await api.post(
        `/api/v1/test-series/test/question/import/${tid}?subject_id=${selectedSubject}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse({
        success: true,
        message: response.data.message || "Questions imported successfully!",
        data: response.data.data,
      });

      setCountdown(5);
    } catch (error: any) {
      setResponse({
        success: false,
        message: error.response?.data?.message || "Failed to import questions",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSubject(null);
    setFile(null);
    setResponse(null);
    setFileError(null);
    setCountdown(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        Select a subject to import questions:
      </h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {subjects.map((subject) => (
            <Button
              key={subject.subject_id}
              variant={
                selectedSubject === subject.subject_id ? "default" : "outline"
              }
              onClick={() => {
                if (selectedSubject !== subject.subject_id) {
                  setFile(null);
                  setResponse(null);
                  setFileError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }
                setSelectedSubject(subject.subject_id);
              }}
            >
              {subject.label}
            </Button>
          ))}
        </div>
        <div className="flex-1 bg-primary/10 border border-primary/20 p-4 rounded-md mb-4">
          <h4 className="text-sm font-bold text-primary mb-2">
            Need help with formatting?
          </h4>
          <p className="text-sm text-black/80 mb-2">
            Download the bulk upload template file. This template is a doc file,
            you have to put all your questions and answers in the given format.
            2 questions are given for your reference.
          </p>
          <Button asChild>
            <Link href="/docs/template.docx" download>
              <Download className="mr-1 h-4 w-4" />
              Download template.docx
            </Link>
          </Button>
        </div>
      </div>

      {selectedSubject !== null && (
        <>
          <Card className="mt-4">
            <CardContent className="md:pt-6">
              <div className="flex flex-col gap-4 md:px-6">
                <div
                  className={`border-2 ${
                    isDragging ? "border-primary bg-blue-50" : "border-gray-300"
                  } border-dashed rounded-md p-8 text-center transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".docx,.doc"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {file ? file.name : "Drag & drop or click to upload file"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: .doc, .docx
                    </p>
                    {fileError && (
                      <p className="text-xs text-red-500 mt-2 font-medium">
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!file || loading || fileError !== null}
                  >
                    {loading ? "Uploading..." : "Import Questions"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {response && (
        <>
          {response.success ? (
            <div className="mt-4 border border-green-500 bg-green-50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-semibold">Success</span>
              </div>
              <p className="text-green-700">{response.message}</p>
              {response.data && (
                <>
                  <p className="text-green-700 mt-1">
                    Please check back after 5 minutes for processing completion.
                  </p>
                  {countdown !== null && (
                    <p className="text-green-700 mt-2 font-medium">
                      Redirecting in {countdown}...
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="mt-4 border border-red-500 bg-red-50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 font-semibold">Error</span>
              </div>
              <p className="text-red-700">{response.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Importer;
