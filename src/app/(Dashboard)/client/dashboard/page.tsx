"use client";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";
import TableRowData from "@/components/table/TableRowData";
import StatusChip from "@/components/chip/StatusChip";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

import { CaseModel } from "@/types/model/Case";
import { getCaseCategoryLabel } from "@/commons/helper";

const Dashboard = () => {
	const [cases, setCases] = useState<CaseModel[]>([]);
  const [casesTotal, setCasesTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  
  const router = useRouter();

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
  
      const response = await fetch(`/api/cases?${query.toString()}`);
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
		<PageContainer title="My Cases" description="This is my cases">
			<DashboardCard 
        titleNode={
          <DashboardCardTitleNode 
            title="My Case"
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            handleCloseFilter={() => setOpenFilter(false)}
            registerFilter={registerFilter}
            onSubmitFilter={onSubmitFilter}
            handleSubmitFilter={handleSubmitFilter}
          />
        }
        action={
          <Button 
            variant="contained" 
            component={Link} 
            href="/client/cases/new"
            sx={{ fontWeight: "bold" }}
          >
            Add Case
          </Button>
        }
      >
				<TableContainer component={Paper} elevation={9}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Quotes</TableCell>
								<TableCell>Created</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
              {loading ? (
                <TableState colSpan={5}>Loading...</TableState>
              ) : (
                cases.length === 0 ? (
                  <TableState colSpan={5}>Data not found</TableState>
                ) : (
                  cases.map((c) => (
                    <TableRowData 
                      key={c.id} 
                      onClick={() => { router.push(`/client/cases/${c.id}`) }}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {c.title}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {getCaseCategoryLabel(c.category)}
                      </TableCell>
                      <TableCell>
                        <StatusChip caseStatus={c.status} />
                      </TableCell>
                      <TableCell>
                        {c._count.quotes}
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
		</PageContainer>
	);
};

export default Dashboard;