"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCasesSchema, AddCasesSchema } from "@/schemas/cases/addCases";

import { Box, Button, Grid } from "@mui/material";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
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
		watch: watchCase,
		getValues: getValueCase,
		setValue: setValueCase,
		control: controlCase,
		register: registerCase,
		handleSubmit: onSubmitCase,
		formState: { errors: caseErrors },
		reset: resetCase,
	} = useForm<AddCasesSchema>({
		resolver: zodResolver(addCasesSchema),
		mode: "onChange",
	});

	const handleSubmitCase = async (data: AddCasesSchema) => {
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
				throw new Error("Failed to create case");
			}

			setLoadingSubmit(false);
		} catch (error) {
			setLoadingSubmit(false);

			await Swal.fire({
				timer: 3000,
				title: "Error!",
				text: error instanceof Error ? error.message : "Unknown error",
				icon: "error",
				showConfirmButton: false,
			});
		}
	};

	return (
		<PageContainer title="New Case" description="This is new case">
			<DashboardCard title="New Case">
				<form onSubmit={onSubmitCase(handleSubmitCase)}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6 }}>
							<Label htmlFor="title">Title</Label>
							<InputText id="title" placeholder="Enter Title" {...registerCase("title")} />

							{caseErrors?.title?.message && <HelperTextError>{caseErrors.title.message}</HelperTextError>}
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Label htmlFor="category">Category</Label>
							<InputSelect id="category" placeholder="Select Category" items={lawCategoryOptions} defaultValue={getValueCase("category")} {...registerCase("category")} />

							{caseErrors?.category?.message && <HelperTextError>{caseErrors.category.message}</HelperTextError>}
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Label htmlFor="description">Description</Label>
							<InputTextArea id="description" placeholder="Enter Description" {...registerCase("description")} />

							{caseErrors?.description?.message && <HelperTextError>{caseErrors.description.message}</HelperTextError>}
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Label htmlFor="description">Files</Label>
							<InputFile watch={watchCase} setValue={setValueCase} control={controlCase} />

							{caseErrors?.files?.message && <HelperTextError>{caseErrors.files.message}</HelperTextError>}
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
								width: {
									xs: "100%",
									md: "auto",
								},
							}}>
							Submit
						</Button>
					</Box>
				</form>
			</DashboardCard>
		</PageContainer>
	);
};

export default NewCases;
