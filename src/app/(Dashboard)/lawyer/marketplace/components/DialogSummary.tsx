import Swal from "sweetalert2";
import dayjs from "dayjs";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Box, Button, Dialog, DialogContent, Divider, Grid, Typography } from "@mui/material";

import Label from "@/components/form/Label";
import InputNumber from "@/components/form/InputNumber";
import HelperTextError from "@/components/form/HelperTextError";
import InputTextArea from "@/components/form/InputTextArea";
import ReadMoreText from "@/components/text/ReadMoreText";

import { CaseModel } from "@/types/model/Case";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertQuoteSchema, UpsertQuoteSchema } from "@/schemas/quote/upsertQuoteSchema";

import { UpsertQuoteBody } from "@/types/request/Quote";
import { getCaseCategoryLabel } from "@/commons/helper";
import { showError } from "@/commons/error";

type DialogSummaryProps = {
	caseId: string;
	fetchCases: () => Promise<void>;
	open: boolean;
	setOpenDialog: Dispatch<SetStateAction<boolean>>;
	onDialogClose: () => void;
};

const DialogSummary = ({ caseId, fetchCases, open, setOpenDialog, onDialogClose }: DialogSummaryProps) => {
	const [caseData, setCaseData] = useState<CaseModel>();

	const [loading, setLoading] = useState<boolean>(true);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
		watch: watchQuote,
		getValues: getValueQuote,
		setValue: setValueQuote,
		control: controlQuote,
		register: registerQuote,
		handleSubmit: onSubmitQuote,
		formState: { errors: caseQuote },
	} = useForm<UpsertQuoteSchema>({
		resolver: zodResolver(upsertQuoteSchema),
		mode: "onChange",
	});

	const fetchCase = async () => {
		try {
			setLoading(true);

			if (!caseId) return;			
			const response = await fetch(`/api/cases/${caseId}`);
			const data = await response.json();

			if (response.ok) {
				setCaseData(data);
			} else throw new Error(data.error);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			showError(error);
		}
	};

	useEffect(() => {
		if (open === true) fetchCase();
	}, [open]);

  const handleSubmitQuote = async (data: UpsertQuoteSchema) => {
    try {
			setLoadingSubmit(true);

			const body: UpsertQuoteBody = {
				amount: data.amount,
				expectedDays: data.expectedDays,
				note: data.note,
			};

			const response = await fetch(`/api/lawyer/marketplace/cases/${caseId}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
			const responseData = await response.json();

			if (response.ok) {
				setCaseData(responseData);
				setOpenDialog(false);
				fetchCases();

				await Swal.fire({
					title: "Success!",
					icon: "success",
					text: "Success submit a new quote",
				});
			} 
			else throw new Error(responseData.error);

			setLoadingSubmit(false);
		} catch (error) {
			setLoadingSubmit(false);
			showError(error);
		}
  };

	return (
		<Dialog open={open} onClose={onDialogClose}>
			<DialogContent>
        <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", marginBottom: 3 }}>
					Summary
				</Typography>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12 }}>
						<Typography variant="body1">
							{loading ? 'loading...' : (
								caseData?.createdAt ? dayjs(caseData.createdAt).format("MMM DD, YYYY") : "-"
							)}
						</Typography>
					</Grid>

					<Grid size={{ xs: 12 }}>
						<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
							Title
						</Typography>
						<Typography variant="body1">
							{loading ? 'loading...' : (
                caseData?.title || "-"
              )}
						</Typography>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
							Category
						</Typography>
						<Typography variant="body1">
							{loading ? 'loading...' : (
								caseData?.category ? getCaseCategoryLabel(caseData?.category) : "-"
							)}
						</Typography>
					</Grid>

					<Grid size={12}>
						<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
							Description
						</Typography>
						<Typography variant="body1">
							{loading ? 'loading...' : (
                <ReadMoreText text={caseData?.description || "-"} maxChars={500} />
              )}
						</Typography>
					</Grid>
				</Grid>

				<Divider sx={{ marginY: 4 }} />

				<Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", marginBottom: 3 }}>
					Submit Quotation
				</Typography>

				<form onSubmit={onSubmitQuote(handleSubmitQuote)}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6 }}>
							<Label htmlFor="amount">Amount</Label>
							<InputNumber id="amount" placeholder="Enter Amount" {...registerQuote("amount", { valueAsNumber: true })} />

							{caseQuote?.amount?.message && <HelperTextError>{caseQuote.amount.message}</HelperTextError>}
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Label htmlFor="expected-days">Expected Days</Label>
							<InputNumber id="expected-days" placeholder="Enter Expected Days" {...registerQuote("expectedDays", { valueAsNumber: true })} />

							{caseQuote?.expectedDays?.message && <HelperTextError>{caseQuote.expectedDays.message}</HelperTextError>}
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Label htmlFor="note">Note</Label>
							<InputTextArea id="note" placeholder="Enter Note" {...registerQuote("note")} />

							{caseQuote?.note?.message && <HelperTextError>{caseQuote.note.message}</HelperTextError>}
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
			</DialogContent>
		</Dialog>
	);
};

export default DialogSummary;
