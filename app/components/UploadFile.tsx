"use client";

import React from "react";

function UploadFile() {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const formData = new FormData();
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    formData.append("resume", file);
    await fetch("api/upload", {
      method: "POST",
      body: formData,
    });
    console.log("ayush file upload success");
  };

  return (
    <div className="flex justify-center items-center border-r-solid border-r-2 border-slate-500 w-1/3 h-screen">
      <button>
        Upload File
        <input
          type="file"
          accept="application/pdf"
          placeholder="Upload File"
          onChange={handleFileUpload}
        />
      </button>
    </div>
  );
}

export default UploadFile;
