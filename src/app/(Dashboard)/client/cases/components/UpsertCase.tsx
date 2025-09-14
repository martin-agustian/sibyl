"use client";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import { useDeleteFile } from "@/hooks/useDeleteFile";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertCasesSchema, UpsertCasesSchema } from "@/schemas/cases/upsertCasesSchema";

import { Box, Button, Grid, Typography } from "@mui/material";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import HelperTextError from "@/components/form/HelperTextError";
import Label from "@/components/form/Label";
import InputSelect from "@/components/form/InputSelect";
import InputText from "@/components/form/InputText";
import InputTextArea from "@/components/form/InputTextArea";
import InputFile from "@/components/form/InputFile";
import FilePreview from "@/components/preview/FilePreview";

import { showError } from "@/commons/error";
import { lawCategoryOptions } from "@/commons/options";
import { CaseStatusEnum } from "@/commons/enum";
import { CaseModel } from "@/types/model/Case";
import { FileModel } from "@/types/model/File";

const UpsertCases = ({ caseId } : { caseId?: string }) => {
  const router = useRouter();

  const title = caseId ? "Edit Case" : "New Case";
  const description = caseId ? "This is edit case" : "This is new case";

  const { loadingDownload, handleDownloadFile } = useDownloadFile(caseId);
  const { loadingDeleteFile, handleDeleteFile } = useDeleteFile(caseId);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [files, setFiles] = useState<FileModel[]>([]);

  const {
    watch: watchCase,
    getValues: getValueCase,
    setValue: setValueCase,
    control: controlCase,
    register: registerCase,
    handleSubmit: onSubmitCase,
    formState: { errors: caseErrors },
    reset: resetCase,
  } = useForm<UpsertCasesSchema>({
    resolver: zodResolver(upsertCasesSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      files: [],
    },
  });

  const fetchCase = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();

      if (response.ok) {
        const caseData = data as CaseModel;

        // middleware
        if (
          caseData.status !== CaseStatusEnum.OPEN && 
          caseData._count.quotes > 0
        ) {
          router.push("/client/cases");
        }

        setValueCase("title", caseData.title);
        setValueCase("category", caseData.category);
        setValueCase("description", caseData.description);
        setFiles(caseData.files);
      }
      else throw data.error;

      setLoading(false);
    } 
    catch (error) {
      setLoading(false);
      showError(error);
    }
  };

  useEffect(() => {
    if (caseId) fetchCase();
  }, [caseId]);

  const handleSubmit = (data: UpsertCasesSchema) => {
    if (caseId) handleEditCase(data);
    else handleSubmitCase(data);
  };

  const handleEditCase = async (data: UpsertCasesSchema) => {
    try {
      setLoadingSubmit(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);

      const totalFiles = files.length + (data.files ? data.files.length : 0);
      if (totalFiles > 10) throw "Max files per case is 10";

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {        
        await Swal.fire({
          timer: 3000,
          title: "Success!",
          text: "Success update case",
          icon: "success",
        });
        
        router.push(`/client/cases/${caseId}`);
      }
      else {
        const result = await res.json();
        throw result.error;
      }

      setLoadingSubmit(false);
    } catch (error) {
      setLoadingSubmit(false);
      showError(error);
    }
  };

  const handleSubmitCase = async (data: UpsertCasesSchema) => {
    try {
      setLoadingSubmit(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await fetch("/api/cases", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        console.log(result);
        resetCase();
        
        await Swal.fire({
          timer: 3000,
          title: "Success!",
          text: "Success created case",
          icon: "success",
        });
      }
      else {
        throw "Failed to create case";
      }

      setLoadingSubmit(false);
    } catch (error) {
      setLoadingSubmit(false);
      showError(error);
    }
  };

  return (
    <PageContainer title={title} description={description}>
      <DashboardCard title={title}>
        {loading ? (
          <Typography variant="body1" sx={{ fontSize: "14px" }}>
            Loading...
          </Typography>
        ) : (
          <form onSubmit={onSubmitCase(handleSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Label htmlFor="title">Title</Label>
                <InputText id="title" placeholder="Enter Title" {...registerCase("title")} />

                {caseErrors?.title?.message && <HelperTextError>{caseErrors.title.message}</HelperTextError>}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Label htmlFor="category">Category</Label>
                <InputSelect id="category" placeholder="Select Category" name="category" control={controlCase} items={lawCategoryOptions} />

                {caseErrors?.category?.message && <HelperTextError>{caseErrors.category.message}</HelperTextError>}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Label htmlFor="description">Description</Label>
                <InputTextArea id="description" placeholder="Enter Description" {...registerCase("description")} />

                {caseErrors?.description?.message && <HelperTextError>{caseErrors.description.message}</HelperTextError>}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Label htmlFor="file">Files</Label>
                <InputFile id="file" watch={watchCase} setValue={setValueCase} control={controlCase} />
                
                {caseErrors?.files && Array.isArray(caseErrors?.files) ? (
                  caseErrors.files.map((file, i) => <HelperTextError key={i} sx={{ mt: 2 }}>{file.message}</HelperTextError>)
                ) : (
                  <HelperTextError>{caseErrors.files?.message}</HelperTextError>
                )}
              </Grid>

              {caseId && files.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Label htmlFor="file">Uploaded Files</Label>
                
                  <FilePreview 
                    files={files}
                    loadingText={
                      loadingDownload ? "Downloading..." : 
                      loadingDeleteFile ? "Deleting..." : ""
                    }                  
                    actionType="DELETE" 
                    onBoxClick={handleDownloadFile} 
                    onActionClick={handleDeleteFile} 
                  />
                </Grid>
              )}
            </Grid>
            <Box sx={{ marginTop: "25px" }}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="medium"
                loading={loadingSubmit}
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  minWidth: 120,
                  width: {
                    xs: "100%",
                    md: "auto",
                  },
                }}>
                Submit
              </Button>
            </Box>
          </form>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default UpsertCases;
