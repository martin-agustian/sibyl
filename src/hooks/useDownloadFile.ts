import { useState } from "react";
import { FileModel } from "@/types/model/File";
import { showError } from "@/commons/error";

export const useDownloadFile = (caseId?: string) => {
  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleDownloadFile = async (file: FileModel) => {
    try {
      if (!file.id) return;
      setLoadingDownload(true);

      const response = await fetch(`/api/cases/${caseId}/files/${file.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.originalName || "downloaded-file";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        throw data.error;
      }

      setLoadingDownload(false);
    } catch (error) {
      setLoadingDownload(false);
      showError(error);
    }
  };

  return {
    handleDownloadFile,
    loadingDownload,
  };
};