"use client";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import FilePreview from "@/components/preview/FilePreview";
import TableRowData from "@/components/table/TableRowData";
import TableState from "@/components/table/TableState";
import TableCellNote from "@/components/table/TableCellNote";
import StatusChip from "@/components/chip/StatusChip";
import ReadMoreText from "@/components/text/ReadMoreText";

import { 
  Divider, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogActions,
  Stack,
  Box,
} from "@mui/material";

import { CaseModel } from "@/types/model/Case";
import { FileModel } from "@/types/model/File";
import { QuoteModel } from "@/types/model/Quote";
import { formatNumber, getCaseCategoryLabel } from "@/commons/helper";
import DashboardCardTitle from "@/app/(Dashboard)/components/shared/DashboardCardTitle";

const CaseDetail = () => {
	const { caseId } = useParams();
  const searchParams = useSearchParams();
  const paymentStatusParams = searchParams.get('payment-status');

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);

	const [caseData, setCaseData] = useState<CaseModel>();
  const [quoteData, setQuoteData] = useState<QuoteModel[]>([]);
  const [quoteTotal, setQuoteTotal] = useState<number>(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  
  const [selectedQuoteNote, setSelectedQuoteNote] = useState<string>("");

  const [quoteNoteOpen, setQuoteNoteOpen] = useState<boolean>(false);
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

      const query = new URLSearchParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
      });

			const response = await fetch(`/api/cases/${caseId}/quotes?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setQuoteData(data.quotes);
        setQuoteTotal(data.total);
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
	}, []);

  useEffect(() => {    
    fetchQuote();
	}, [page]);

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

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                caseData?.status ? <StatusChip caseStatus={caseData.status} /> : '-'
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Created At
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
              {loading ? 'loading...' : (
                caseData?.createdAt ? dayjs(caseData.createdAt).format("MMM DD, YYYY - HH:mm"): "-"
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Title
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
              {loading ? 'loading...' : (
                caseData?.title || "-"
              )}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Category
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
              {loading ? 'loading...' : (
                caseData?.category ? getCaseCategoryLabel(caseData?.category) : "-"
              )}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
              {loading ? 'loading...' : (
                <ReadMoreText text={caseData?.description || "-"} maxChars={800} />
              )}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Files
            </Typography>
            {loading ? (
              <Typography variant="body1">loading...</Typography>
            ) : (
              caseData?.files && caseData.files.length > 0 ? (
                <FilePreview files={caseData.files} onActionClick={handleDownloadFile} />
              ) : (
                <Typography variant="body1">-</Typography>
              )
            )}
          </Grid>

          <Divider sx={{ height: "1px", width: "100%", my: 3 }} />
          
          <DashboardCardTitle>Quotes</DashboardCardTitle>

          <TableContainer component={Paper} elevation={9} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Expected Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Note
                  </TableCell>
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
                          {formatNumber(c.amount)}
                        </TableCell>
                        <TableCell>
                          {formatNumber(c.expectedDays)}
                        </TableCell>
                        <TableCell>
                          <StatusChip quoteStatus={c.status} />
                        </TableCell>
                        <TableCellNote sx={{ display: { xs: "none", md: "table-cell" } }}>
                          <ReadMoreText 
                            text={c.note} 
                            maxChars={100} 
                            sxButton={{ fontSize: "0.75rem" }}
                            onClickReadmore={() => {
                              setSelectedQuoteNote(c.note);
                              setQuoteNoteOpen(true);
                            }} 
                          />
                        </TableCellNote>
                        <TableCell>
                          {dayjs(c.createdAt).format("MMM DD, YYYY")}
                        </TableCell>
                      </TableRowData>
                    ))
                  )
                )}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[1, 2, 25]}
              component="div"
              count={quoteTotal}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </DashboardCard>

      <Dialog fullWidth maxWidth="xs" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <DialogTitle>
          Menu
        </DialogTitle>
        <DialogContent>
          <Stack gap={1}>
            <Button
              fullWidth 
              variant="outlined" 
              onClick={handleAcceptQuote}
            >
              Accept Quote
            </Button>
            <Button
              fullWidth 
              variant="outlined" 
              onClick={() => setQuoteNoteOpen(true)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              See Note
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={quoteNoteOpen} onClose={() => setQuoteNoteOpen(false)}>
        <DialogTitle>
          Note
        </DialogTitle>
        <DialogContent>
          {selectedQuoteNote}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="text" 
            sx={{ fontWeight: "bold" }}
            onClick={() => setQuoteNoteOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
		</PageContainer>
	);
};

export default CaseDetail;
