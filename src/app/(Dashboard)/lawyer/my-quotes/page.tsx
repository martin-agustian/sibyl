"use client";
import dayjs from "dayjs";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";
import DialogSummary from "./components/DialogSummary";

import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { QuoteModel } from "@/types/model/Quote";

const Dashboard = () => {
  const [quotes, setQuotes] = useState<QuoteModel[]>([]);
  const [quoteTotal, setQuoteTotal] = useState<number>(0);

  const [selectedCaseId, setSelectedCaseId] = useState<string>("cmffg3gvo0001u168ptquq99r");
  const [openDialogSummary, setOpenDialogSummary] = useState<boolean>(false);

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const {
    watch: watchFilter,
    getValues: getValueFilter,
    setValue: setValueFilter,
    control: controlFilter,
    register: registerFilter,
    handleSubmit: onSubmitFilter,
  } = useForm<FilterSchema>({
    defaultValues: {
      title: "",
      category: "",
      status: [],
      sortBy: "",
    },
  });

  const fetchCases = async (filter?: FilterSchema) => {
    const query = new URLSearchParams({
      title: filter?.title || "",
      category: filter?.category || "",
      status: filter?.status.toString() || "",
      sort: filter?.sortBy || "",
      page: (page + 1).toString(),
      pageSize: rowsPerPage.toString(),
    });

    const response = await fetch(`/api/lawyer/quotes`);
    const data = await response.json();
    setQuotes(data.quotes || []);
    setQuoteTotal(data.total);
  };

  useEffect(() => {
    fetchCases();
  }, [page]);

   const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitFilter = (data: FilterSchema) => {
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
            registerFilter={registerFilter}
            onSubmitFilter={onSubmitFilter}
            handleSubmitFilter={handleSubmitFilter}
          />
        }
        action={
          <Button variant="contained" component={Link} href="/client/cases/new">
            Add Case
          </Button>
        }
      >
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: "1px solid", borderColor: grey[800] }}>
                <TableCell>Case Title</TableCell>
                <TableCell>Case Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Expected Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                quotes.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <Typography sx={{ textTransform: "capitalize" }}>{q.case.title}</Typography>
                    </TableCell>
                    <TableCell>{q.case.category}</TableCell>
                    <TableCell>{q.amount}</TableCell>
                    <TableCell>{q.expectedDays}</TableCell>
                    <TableCell>
                      <Chip label={q.status} component="span" size="small" />
                    </TableCell>
                    <TableCell>{dayjs(q.createdAt).format("MMM DD, YYYY")}</TableCell>
                  </TableRow>
                ))
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
        onDialogClose={() => setOpenDialogSummary(false)} 
        caseId={selectedCaseId}
      />
    </PageContainer>
  );
};

export default Dashboard;