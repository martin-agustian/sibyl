"use client";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import CaseStatusChip from "@/components/chip/CaseStatusChip";
import FilePreview from "@/components/preview/FilePreview";

import { 
  Divider, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Chip,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
} from "@mui/material";

import { CaseModel } from "@/types/model/Case";
import { FileModel } from "@/types/model/File";
import { QuoteModel } from "@/types/model/Quote";
import { getCaseCategoryLabel } from "@/commons/helper";
import TableRowData from "@/components/table/TableRowData";
import TableState from "@/components/table/TableState";

const CaseDetail = () => {
	const { caseId } = useParams();
  const searchParams = useSearchParams();
  const paymentStatusParams = searchParams.get('payment-status');

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);

	const [caseData, setCaseData] = useState<CaseModel>();
  const [quoteData, setQuoteData] = useState<QuoteModel[]>([]);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

	const fetchCase = async () => {
		try {
      setLoading(true);

			const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();

      if (response.ok) {
        setCaseData(data);
      }
      else throw new Error(data.error);

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

  const fetchQuote = async () => {
    try {
      setLoadingQuote(true);

			const response = await fetch(`/api/cases/${caseId}/quotes`);
      const data = await response.json();

      if (response.ok) {
        setQuoteData(data.quotes);
      }
      else throw new Error(data.error);

      setLoadingQuote(false);
		} 
    catch (error) {
      setLoadingQuote(false);

			await Swal.fire({
				title: "Error!",
				icon: "error",
				text: error instanceof Error ? error.message : (error as string),
			});
		}
  };

	useEffect(() => {    
    handlePaymentStatus();
		fetchCase();
    fetchQuote();
	}, []);

  const handlePaymentStatus = async () => {
    if (paymentStatusParams == "success") {
      await Swal.fire({
				title: "Success!",
				icon: "success",
				text: "Your payment is succeeded",
			});

      handlePaymentStatusConfirm();
    }
    else if (paymentStatusParams == "success") {
      await Swal.fire({
				title: "Failed!",
				icon: "error",
				text: "Your payment is failed",
			});

      handlePaymentStatusConfirm();
    }
  }

  const handlePaymentStatusConfirm = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('payment-status');
    window.history.replaceState({}, '', url.pathname + url.search);
  }

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

  const handleAcceptQuote = async () => {
    try {
			const response = await fetch(`/api/cases/${caseId}/quotes/cmffsebxl000au1ycwo9y55jd/accept`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        window.location.href = data.checkoutUrl;
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
  }

	return (
		<PageContainer title="Case Detail" description="This is case detail">
			<DashboardCard title="Case Detail">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Status
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
              {loading ? 'loading...' : (
                caseData?.status ? <CaseStatusChip status={caseData.status} /> : '-'
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Created At
            </Typography>
            <Typography variant="body1">
              {loading ? 'loading...' : (
                caseData?.createdAt ? dayjs(caseData.createdAt).format("MMM DD, YYYY - HH:mm"): "-"
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Title
            </Typography>
            <Typography variant="body1">
              {loading ? 'loading...' : (
                caseData?.title || "-"
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Category
            </Typography>
            <Typography variant="body1">
              {loading ? 'loading...' : (
                caseData?.category ? getCaseCategoryLabel(caseData?.category) : "-"
              )}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Description
            </Typography>
            <Typography variant="body1">
              {loading ? 'loading...' : (
                caseData?.description || "-"
              )}
            </Typography>
          </Grid>

          <Divider />

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Files
            </Typography>
            {loading ? (
              <Typography variant="body1">-</Typography>
            ) : (
              caseData?.files && caseData.files.length > 0 ? (
                <FilePreview files={caseData.files} onActionClick={handleDownloadFile} />
              ) : (
                <Typography variant="body1">-</Typography>
              )
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
              <TableBody>
                {loadingQuote ? (
                  <TableState colSpan={5}>Loading...</TableState>
                ) : (
                  quoteData.length === 0 ? (
                    <TableState colSpan={5}>Data not found</TableState>
                  ) : (
                    quoteData.map((c) => (
                      <TableRowData key={c.id} onClick={() => setMenuOpen(true)}>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {c.amount}
                        </TableCell>
                        <TableCell>
                          {c.expectedDays}
                        </TableCell>
                        <TableCell>
                          <Chip label={c.status} component="span" size="small" />
                        </TableCell>
                        <TableCell>
                          {c.note}
                        </TableCell>
                        <TableCell>
                          {dayjs(c.createdAt).format("MMM DD, YYYY")}
                        </TableCell>
                      </TableRowData>
                    ))
                  )
                )}
              </TableBody>
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

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)}>
        <DialogTitle>
          Menu
        </DialogTitle>
        <DialogContent>
          <Button variant="outlined" onClick={handleAcceptQuote}>
            Accept Quote
          </Button>
        </DialogContent>
      </Dialog>
		</PageContainer>
	);
};

export default CaseDetail;
