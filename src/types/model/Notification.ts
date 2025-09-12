export type NotificationModel = {
	id: string;
	userId: string;
	type: string;
	message: string;
	read: boolean;
	createdAt: Date;
};
