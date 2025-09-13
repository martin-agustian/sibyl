"use client";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import TableRowData from "@/components/table/TableRowData";
import TableState from "@/components/table/TableState";
import StatusChip from "@/components/chip/StatusChip";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";
import DialogSummary from "./components/DialogSummary";
import DialogEdit from "./components/DialogEdit";

import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";

import { QuoteModel } from "@/types/model/Quote";
import { formatNumber, getCaseCategoryLabel } from "@/commons/helper";
import { CaseStatusEnum, QuoteStatusEnum } from "@/commons/enum";

const Dashboard = () => {
  const [quotes, setQuotes] = useState<QuoteModel[]>([]);
  const [quoteTotal, setQuoteTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedQuote, setSelectedQuote] = useState<QuoteModel>();
  const [openDialogSummary, setOpenSummary] = useState<boolean>(false);
  const [openDialogEdit, setOpenEdit] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openQuoteNote, setOpenQuoteNote] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [filter, setFilter] = useState<FilterSchema>();

  const {
    watch: watchFilter,
    getValues: getValueFilter,
    setValue: setValueFilter,
    control: controlFilter,
    register: registerFilter,
    reset: resetFilter,
    handleSubmit: onSubmitFilter,
  } = useForm<FilterSchema>({
    defaultValues: {
      title: "",
      category: "",
      status: [],
      sortBy: "",
    },
  });

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        title: filter?.title || "",
        category: filter?.category || "",
        status: filter?.status.toString() || "",
        sort: filter?.sortBy || "",
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
      });

      const response = await fetch(`/api/lawyer/quotes?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {      
        setQuotes(data.quotes || []);
        setQuoteTotal(data.total);
      }
      else {
        throw new Error(data.error);
      }

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
    fetchQuotes();
  }, [filter, page]);

   const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitFilter = (data: FilterSchema) => {
    setOpenFilter(false);
    setFilter(data);
    setPage(0);
  }

  return (
    <PageContainer title="My Quotes" description="my quote">
      <DashboardCard 
        titleNode={
          <DashboardCardTitleNode 
            title="My Quotes"
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            handleCloseFilter={() => setOpenFilter(false)}
            controlFilter={controlFilter}
            registerFilter={registerFilter}
            resetFilter={resetFilter}
            onSubmitFilter={onSubmitFilter}
            handleSubmitFilter={handleSubmitFilter}
          />
        }
      >
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case Title</TableCell>
                <TableCell>Case Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Expected Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={6}>Loading...</TableState>
              ) : (
                quotes.length === 0 ? (
                  <TableState colSpan={6}>Data not found</TableState>
                ) : (
                  quotes.map((q) => (
                    <TableRowData 
                      key={q.id} 
                      onClick={() => {
                        setOpenMenu(true); 
                        setSelectedQuote(q);
                      }}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {q.case.title}
                      </TableCell>
                      <TableCell>
                        {getCaseCategoryLabel(q.case.category)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(q.amount)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(q.expectedDays)}
                      </TableCell>
                      <TableCell>
                        <StatusChip quoteStatus={q.status} />
                      </TableCell>
                      <TableCell>
                        {dayjs(q.createdAt).format("MMM DD, YYYY")}
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
      </DashboardCard>

      <DialogSummary 
        open={openDialogSummary} 
        onDialogClose={() => setOpenSummary(false)} 
        caseId={selectedQuote?.caseId ?? ""}
      />

      <DialogEdit 
        open={openDialogEdit} 
        onDialogClose={() => setOpenEdit(false)}
        setOpenDialog={setOpenEdit} 
        caseId={selectedQuote?.caseId ?? ""}
        quote={selectedQuote}
        fetchQuotes={fetchQuotes}
      />

      <Dialog open={openQuoteNote} onClose={() => setOpenQuoteNote(false)}>
        <DialogTitle>
          Note
        </DialogTitle>
        <DialogContent>
          {selectedQuote?.note}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="text" 
            sx={{ fontWeight: "bold" }}
            onClick={() => setOpenQuoteNote(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="xs" open={openMenu} onClose={() => setOpenMenu(false)}>
        <DialogTitle>
          Menu
        </DialogTitle>
        <DialogContent>
          <Stack gap={1.5}>
            <Button
              fullWidth 
              variant="outlined" 
              onClick={() => setOpenSummary(true)}
            >
              Case Summary
            </Button>
            {selectedQuote?.status == QuoteStatusEnum.PROPOSED && (
              <Button
                fullWidth 
                variant="outlined" 
                onClick={() => setOpenEdit(true)}
              >
                Edit Quote
              </Button>
            )}
            <Button
              fullWidth 
              variant="outlined" 
              onClick={() => setOpenQuoteNote(true)}
            >
              Open Quote Note
            </Button>
            {selectedQuote?.status == QuoteStatusEnum.REJECTED && (
              <Button
                fullWidth 
                variant="outlined" 
                // onClick={() => setQuoteNoteOpen(true)}
              >
                Open Reject Note
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Dashboard;