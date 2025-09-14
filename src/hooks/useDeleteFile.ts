import Swal from "sweetalert2";

import { useState } from "react";
import { FileModel } from "@/types/model/File";

export const useDeleteFile = (caseId?: string) => {
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);

  const handleDeleteFile = async (file: FileModel) => {
    try {
      if (!file.id) return;
      setLoadingDeleteFile(true);

      const response = await fetch(`/api/cases/${caseId}/files/${file.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await Swal.fire({
          title: "Success",
          icon: "success",
          text: "Success Delete File",
        });

        window.location.reload();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }

      setLoadingDeleteFile(false);
    } catch (error) {
      setLoadingDeleteFile(false);
      await Swal.fire({
        title: "Error!",
        icon: "error",
        text: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return {
    handleDeleteFile,
    loadingDeleteFile,
  };
};