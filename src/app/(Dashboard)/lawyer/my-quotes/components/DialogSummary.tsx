import Swal from "sweetalert2";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { useDownloadFile } from "@/hooks/useDownloadFile";

import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import ReadMoreText from "@/components/text/ReadMoreText";
import FilePreview from "@/components/preview/FilePreview";

import { CaseModel } from "@/types/model/Case";
import { getCaseCategoryLabel } from "@/commons/helper";

type DialogSummaryProps = {
	caseId: string;
	open: boolean;
	onDialogClose: () => void;
};

const DialogSummary = ({ caseId, open, onDialogClose }: DialogSummaryProps) => {
	const [caseData, setCaseData] = useState<CaseModel>();

	const [loading, setLoading] = useState<boolean>(true);

	const { loadingDownload, handleDownloadFile } = useDownloadFile();

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
		}
		catch (error) {
			setLoading(false);

			await Swal.fire({
				title: "Error!",
				icon: "error",
				text: error instanceof Error ? error.message : (error as string),
			});
		}
	};

	useEffect(() => {
		if (open === true) fetchCase();
	}, [open]);

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

					<Grid size={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Files
            </Typography>
            {loading ? (
              <Typography variant="body1">loading...</Typography>
            ) : (
              caseData?.files && caseData.files.length > 0 ? (
                <FilePreview 
									files={caseData.files}
									loadingText={loadingDownload ? "Downloading..." : ""} 
									onBoxClick={handleDownloadFile} 
									onActionClick={handleDownloadFile} />
              ) : (
                <Typography variant="body1">-</Typography>
              )
            )}
          </Grid>
				</Grid>				
			</DialogContent>
			<DialogActions>
				<Button 
					variant="text" 
					sx={{ fontWeight: "bold" }}
					onClick={onDialogClose}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogSummary;