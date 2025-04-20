import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import axios from "axios";

function ManageApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/applicants", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApplicants(response.data);
    } catch (error) {
      setError("Failed to fetch applicants");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/applicants", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchApplicants();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create applicant");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applicants/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchApplicants();
    } catch (error) {
      setError("Failed to update applicant status");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "approved"
              ? "success"
              : params.value === "rejected"
              ? "error"
              : "warning"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleStatusChange(params.row.id, "approved")}
            disabled={params.row.status === "approved"}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleStatusChange(params.row.id, "rejected")}
            disabled={params.row.status === "rejected"}
            sx={{ ml: 1 }}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => window.open(params.row.resume_url, "_blank")}
            sx={{ ml: 1 }}
          >
            View Resume
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Manage Applicants</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Applicant
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={applicants}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Applicant</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              {...register("name", { required: true })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              {...register("email", { required: true })}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              {...register("phone", { required: true })}
            />
            <TextField
              margin="dense"
              label="Resume URL"
              fullWidth
              {...register("resume_url", { required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Applicant
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default ManageApplicants;
