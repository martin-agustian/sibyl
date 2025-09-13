"use client";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";
import TableState from "@/components/table/TableState";

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

import { UserModel } from "@/types/model/User";

const User = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [usersTotal, setUsersTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
      });
  
      const response = await fetch(`/api/admin/user?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        setUsersTotal(data.total);
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
    fetchUsers();
  }, [page]);

   const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer title="All Users" description="This is all user">
      <DashboardCard title="All Users">
        <TableContainer component={Paper} elevation={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Jurisdiction</TableCell>
                <TableCell>Bar Number</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableState colSpan={6}>Loading...</TableState>
              ) : (
                users.length === 0 ? (
                  <TableState colSpan={6}>Data not found</TableState>
                ) : (
                  users.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ textTransform: "capitalize" }}>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.role}</TableCell>
                      <TableCell>{c.jurisdiction ?? "-"}</TableCell>
                      <TableCell>{c.barNumber ?? "-"}</TableCell>
                      <TableCell>{dayjs(c.createdAt).format("MMM DD, YYYY")}</TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 20, 25]}
            component="div"
            count={usersTotal}
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

export default User;