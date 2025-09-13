"use client";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";

import { Box, Grid, Stack } from "@mui/system";
import { Chip, Pagination, Typography } from "@mui/material";

import { NotificationModel } from "@/types/model/Notification";

export const Notification = () => {
	const [loading, setLoading] = useState<boolean>(true);
	
	const [notifications, setNotifications] = useState<NotificationModel[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [rowsPerPage, setRowPerPage] = useState<number>(10);
	const [page, setPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);

	const fetchNotification = async () => {
		try {
			setLoading(true);

			const query = new URLSearchParams({
        page: page.toString(),
        pageSize: rowsPerPage.toString(),
      });

			const response = await fetch(`/api/notification?${query.toString()}`);
			const data = await response.json();

			if (response.ok) {
				setNotifications(data.notifications);
				setTotal(data.total);
				setTotalPage(data.totalPages);
			}
			else throw new Error(data.error);

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
		fetchNotification();
	}, [page]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	}

	return (
		<PageContainer title="Notification" description="notification">
			<DashboardCard title={`Notification (${total})`}>
				<Grid container spacing={{ xs: 3 }}>
					{loading ? (
						<Grid size={{ xs: 12 }}>
							<Typography variant="body1" sx={{ fontSize: "14px" }}>
								Loading...
							</Typography>
						</Grid>
					) : (
						notifications.length > 0 ? (
							notifications.map((n, i) => (
								<Grid key={i} size={{ xs: 12 }}>
									<Stack 
										direction={{ xs: "column", md: "row" }}
										spacing={{ xs: 1 }} 
										sx={{ justifyContent: "space-between" }}
									>
										<Box>
											<Chip label={n.type} size="small" />
											<Typography variant="body1" sx={{ marginTop: 1 }}>
												{n.message}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body1">
												{dayjs(n.createdAt).format("MMM DD, YYYY - HH:mm")}
											</Typography>
										</Box>
									</Stack>
								</Grid>
							))
						) : (
							<Grid size={{ xs: 12 }}>
								<Typography variant="body1" sx={{ fontSize: "14px" }}>
									Data not found
								</Typography>
							</Grid>
						)
					)}
				</Grid>
				
				<Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
					<Pagination count={totalPage} page={page} onChange={(e, newPage) => handlePageChange(newPage)} />
				</Box>
			</DashboardCard>
		</PageContainer>
	);
};

export default Notification;
