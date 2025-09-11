"use client";
import dayjs from "dayjs";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import DashboardCardTitleNode, { FilterSchema } from "./components/DashboardCardTitleNode";

import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

type CaseItem = {
	id: string;
	title: string;
	category: string;
	status: string;
	createdAt: string;
	_count: { quotes: number };
};

const Dashboard = () => {
	const [cases, setCases] = useState<CaseItem[]>([]);
  const [casesTotal, setCasesTotal] = useState<number>(0);

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

    const response = await fetch(`/api/cases?${query.toString()}`);
    const data = await response.json();
    setCases(data.cases || []);
    setCasesTotal(data.total);
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
		<PageContainer title="My Cases" description="Add new case">
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
          <Button variant="contained" component={Link} href="/client/cases/new">
            Add Case
          </Button>
        }
      >
				<TableContainer component={Paper} elevation={9}>
					<Table>
						<TableHead>
							<TableRow sx={{ borderBottom: "1px solid", borderColor: grey[800] }}>
								<TableCell>Title</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Quotes</TableCell>
								<TableCell>Created</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
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