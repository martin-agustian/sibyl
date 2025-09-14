import Swal from "sweetalert2";

import { useState } from "react";
import { FileModel } from "@/types/model/File";
import { showError } from "@/commons/error";

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
        throw data.error;
      }

      setLoadingDeleteFile(false);
    } catch (error) {
      setLoadingDeleteFile(false);
      showError(error);
    }
  };

  return {
    handleDeleteFile,
    loadingDeleteFile,
  };
};