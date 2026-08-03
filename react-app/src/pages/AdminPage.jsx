import { Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

function AdminPage() {
  const { user } = useAuth();
  return (
    <Typography variant="h5">
      Welcome, {user.username}. This page is protected.
    </Typography>
  );
}

export default AdminPage;
