"use client";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";
import DialogSummary from "./components/DialogSummary";

import { getCaseCategoryLabel } from "@/commons/helper";

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

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

      await Swal.fire({
        title: "Error!",
        icon: "error",
        text: error instanceof Error ? error.message : (error as string),
      });
    }
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
    <PageContainer title="Marketplace" description="marketplace">
      <DashboardCard 
        titleNode={
          <DashboardCardTitleNode 
            title="Marketplace"
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            handleCloseFilter={() => setOpenFilter(false)}
            registerFilter={registerFilter}
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
                      <TableCell>
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {c.title}
                        </Typography>
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
        onDialogClose={() => setOpenDialogSummary(false)} 
        caseId={selectedCaseId}
      />
    </PageContainer>
  );
};

export default Dashboard;