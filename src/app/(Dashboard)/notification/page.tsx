"use client";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";

import { Grid } from "@mui/system";
import { Chip, Divider, Typography } from "@mui/material";

import { NotificationModel } from "@/types/model/Notification";

export const Notification = () => {
	const [notifications, setNotifications] = useState<NotificationModel[]>([]);

	const fetchNotification = async () => {
		try {
			const response = await fetch(`/api/notification`);
			const data = await response.json();

			if (response.ok) {
				setNotifications(data.notifications);
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
	};

	useEffect(() => {
		fetchNotification();
	}, []);

	return (
		<PageContainer title="Notification" description="notification">
			<DashboardCard title="Notification">
				<Grid container spacing={2}>
					{notifications.map(n => (
						<Grid size={{ xs: 12 }}>
							<Chip label={n.type} size="small" />
							<Typography variant="body1">
								{n.message}
							</Typography>
						</Grid>
					))}
				</Grid>
			</DashboardCard>
		</PageContainer>
	);
};

export default Notification;
