"use client";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import FilePreview from "@/components/FilePreview";

import { 
  Divider, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, 
} from "@mui/material";

import { CaseModel } from "@/types/model/Case";
import { FileModel } from "@/types/model/File";

const CaseDetail = () => {
	const { caseId } = useParams();

	const [caseData, setCaseData] = useState<CaseModel>();

	const fetchCase = async () => {
		try {
			const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();

      if (response.ok) {
        setCaseData(data);
      }
      else throw new Error(data.error);
		} 
    catch (error) {
			await Swal.fire({
				title: "Error!",
				icon: "error",
				text: error instanceof Error ? error.message : (error as string),
			});
		}
	};

  const fetchQuote = async () => {
    try {
			const response = await fetch(`/api/cases/${caseId}/quotes`);
      const data = await response.json();

      if (response.ok) {
        console.log(data, "D");
        // setCaseData(data);
      }
      else throw new Error(data.error);
		} 
    catch (error) {
			await Swal.fire({
				title: "Error!",
				icon: "error",
				text: error instanceof Error ? error.message : (error as string),
			});
		}
  };

	useEffect(() => {
		fetchCase();
    fetchQuote();
	}, []);

  const handleDownloadFile = async (file: FileModel) => {
    try {
      if (!file.id) return;
			const response = await fetch(`/api/cases/${caseId}/files/${file.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.originalName || "downloaded-file";
        a.click();
        URL.revokeObjectURL(url);
      }
      else {
        const data = await response.json();
        throw new Error(data.error);
      }
		} 
    catch (error) {
			await Swal.fire({
				title: "Error!",
				icon: "error",
				text: error instanceof Error ? error.message : (error as string),
			});
		}
  }

	return (
		<PageContainer title="Case Detail" description="Add new case">
			<DashboardCard title="Case Detail">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Status
            </Typography>
            <Typography variant="body1">
              {caseData?.status || "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Created At
            </Typography>
            <Typography variant="body1">
              {caseData?.createdAt ? dayjs(caseData.createdAt).format("MMM DD, YYYY"): "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Title
            </Typography>
            <Typography variant="body1">
              {caseData?.title || "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Category
            </Typography>
            <Typography variant="body1">
              {caseData?.category || "-"}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Description
            </Typography>
            <Typography variant="body1">
              {caseData?.description || "-"}
            </Typography>
          </Grid>

          <Divider />

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Files
            </Typography>

            {caseData?.files && caseData.files.length > 0 ? (
              <FilePreview files={caseData.files} onActionClick={handleDownloadFile} />
            ) : (
              <Typography variant="body1">-</Typography>
            )}
          </Grid>

          <Divider />

          <TableContainer component={Paper} elevation={9}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Expected Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No cases found.
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>{c.title}</Typography>
                      </TableCell>
                      <TableCell>{c.category}</TableCell>
                      <TableCell>
                        <Chip label={c.status} component="span" size="small" />
                      </TableCell>
                      <TableCell>{c._count.quotes}</TableCell>
                      <TableCell>{dayjs(c.createdAt).format("MMM DD, YYYY")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody> */}
            </Table>

            {/* <TablePagination
              rowsPerPageOptions={[1, 2, 25]}
              component="div"
              count={casesTotal}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </TableContainer>
        </Grid>
      </DashboardCard>
		</PageContainer>
	);
};

export default CaseDetail;
