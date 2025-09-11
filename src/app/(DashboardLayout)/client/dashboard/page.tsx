"use client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCases = async () => {
    const res = await fetch("/api/cases");
    const data = await res.json();
    setCases(data.cases || []);
  };

	useEffect(() => {
		fetchCases();
	}, []);

  //  const handleChangePage = (event: MouseEvent, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event:) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0); // Reset ke halaman pertama
  // };

	return (
		<PageContainer title="My Cases" description="Add new case">
			<DashboardCard title="My Cases">
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cases.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
				</TableContainer>
			</DashboardCard>
		</PageContainer>
	);
};

export default Dashboard;