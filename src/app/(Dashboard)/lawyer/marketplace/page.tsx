"use client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";
import DialogSummary from "./components/DialogSummary";

import { getCaseCategoryLabel } from "@/commons/helper";
import { showError } from "@/commons/error";

dayjs.extend(utc);
dayjs.extend(timezone);

type CaseItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  _count: { quotes: number };
};

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [casesTotal, setCasesTotal] = useState<number>(0);

  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [openDialogSummary, setOpenDialogSummary] = useState<boolean>(false);

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(2);
  const [filter, setFilter] = useState<FilterSchema>();

  const {
    watch: watchFilter,
    getValues: getValueFilter,
    setValue: setValueFilter,
    reset: resetFilter,
    control: controlFilter,
    register: registerFilter,
    handleSubmit: onSubmitFilter,
  } = useForm<FilterSchema>({
    defaultValues: {
      title: "",
      category: "",
      createdSince: null,
      sortBy: "",
    },
  });

  const fetchCases = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      if (filter?.title) query.set("title", filter.title);
      if (filter?.category) query.set("category", filter.category);
      if (filter?.sortBy) query.set("sort", filter.sortBy);
      // Date (converted to Asia/Singapore ISO string)
      if (filter?.createdSince) {      
        const createdSinceISO = dayjs(filter.createdSince)
          .tz("Asia/Singapore")
          .toISOString();
        query.set("createdSince", createdSinceISO);
      }
      // Pagination
      query.set("page", (page + 1).toString());
      query.set("pageSize", rowsPerPage.toString());
  
      const response = await fetch(`/api/lawyer/marketplace/cases?${query.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setCases(data.cases || []);
        setCasesTotal(data.total);
      }
      else {
        throw new Error(data.error);
      }

      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      showError(error);
    }
  };

  useEffect(() => {
    fetchCases();
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
    <PageContainer title="Marketplace" description="marketplace">
      <DashboardCard 
        titleNode={
          <DashboardCardTitleNode 
            title="Marketplace"
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
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={3}>Loading...</TableState>
              ) : (
                cases.length === 0 ? (
                  <TableState colSpan={3}>Data not found</TableState>
                ) : (
                  cases.map((c) => (
                    <TableRowData 
                      key={c.id} 
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setOpenDialogSummary(true);
                      }}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {c.title}
                      </TableCell>
                      <TableCell>
                        {getCaseCategoryLabel(c.category)}
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

          <TablePagination
            rowsPerPageOptions={[1, 2, 25]}
            component="div"
            count={casesTotal}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </DashboardCard>

      <DialogSummary 
        open={openDialogSummary} 
        setOpenDialog={setOpenDialogSummary}
        onDialogClose={() => setOpenDialogSummary(false)} 
        caseId={selectedCaseId}
        fetchCases={fetchCases}
      />
    </PageContainer>
  );
};

export default Dashboard;