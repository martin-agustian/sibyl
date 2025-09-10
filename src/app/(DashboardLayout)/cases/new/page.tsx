
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCasesSchema, AddCasesSchema } from "@/schemas/cases/addCases";

import { Box, Button, Grid } from "@mui/material";

import PageContainer from "../../components/container/PageContainer";
import DashboardCard from "../../components/shared/DashboardCard";

import HelperTextError from "@/components/form/HelperTextError";
import Label from "@/components/form/Label";
import InputSelect from "@/components/form/InputSelect";
import InputText from "@/components/form/InputText";
import InputTextArea from "@/components/form/InputTextArea";
import InputFile from "@/components/form/InputFile";

import { lawCategoryOptions } from "@/commons/options";

const NewCases = () => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
    getValues,
    watch: watchCase,
    setValue: setValueCase,
    control: controlCase,
		register: registerCase,
		handleSubmit: onSubmitCase,
		formState: { errors: caseErrors },
	} = useForm<AddCasesSchema>({
		resolver: zodResolver(addCasesSchema),
		mode: "onChange",
	});

  const handleSubmitCase = (data: AddCasesSchema) => {

  }

	return (
    <PageContainer title="New Case" description="Add new case">
      <DashboardCard title="New Case">
        <form onSubmit={onSubmitCase(handleSubmitCase)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label htmlFor="title">Title {getValues("title")}</Label>
              <InputText id="title" placeholder="Enter Title" {...registerCase("title")} />
              
              {caseErrors?.title?.message && (
                <HelperTextError>{caseErrors.title.message}</HelperTextError>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Label htmlFor="category">Category {getValues("category")}</Label>
              <InputSelect id="category" placeholder="Select Category" items={lawCategoryOptions} {...registerCase("category")} />
              
              {caseErrors?.category?.message && (
                <HelperTextError>{caseErrors.category.message}</HelperTextError>
              )}
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Label htmlFor="description">Description {getValues("category")}</Label>
              <InputTextArea id="description" placeholder="Enter Description" {...registerCase("description")}  />

              {caseErrors?.description?.message && (
                <HelperTextError>{caseErrors.description.message}</HelperTextError>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Label htmlFor="description">Files {getValues("category")}</Label>
              <InputFile watch={watchCase} setValue={setValueCase} control={controlCase} />

              {caseErrors?.files?.message && (
                <HelperTextError>{caseErrors.files.message}</HelperTextError>
              )}
            </Grid>
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
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DashboardCard>
    </PageContainer>
  );
};

export default NewCases;
