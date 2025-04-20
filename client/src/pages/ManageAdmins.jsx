import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function ManageAdmins() {
  const [admins, setAdmins] = useState([
    { id: 1, name: "Super Admin", email: "admin@peso.gov.ph", role: "superadmin" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "admin",  // Default to "admin"
    password: "",
  });
  const [editAdmin, setEditAdmin] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/admins", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins([
        { id: 1, name: "Super Admin", email: "admin@peso.gov.ph", role: "superadmin" },
        ...response.data.filter((admin) => admin.role !== "superadmin"),
      ]);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/admins/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAdmins();
      setConfirmDelete(false);  // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleAddAdmin = async () => {
    const emailExists = admins.some(
      (admin) => admin.email.toLowerCase() === newAdmin.email.toLowerCase()
    );

    if (emailExists) {
      console.error("Admin with this email already exists.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/admins", newAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAdmins();
      setShowAddAdmin(false);
      setNewAdmin({ name: "", email: "", role: "admin", password: "" });
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/admins/${editAdmin.id}`, editAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAdmins();
      setEditAdmin(null);
    } catch (error) {
      console.error("Error editing admin:", error);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Manage Admins
      </Typography>

      <TextField
        fullWidth
        placeholder="Search here"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: "4px" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setShowAddAdmin(!showAddAdmin)}
      >
        {showAddAdmin ? "Cancel" : "Add Admin"}
      </Button>

      {showAddAdmin && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Admin
          </Typography>
          <TextField
            fullWidth label="Name" sx={{ mb: 2 }}
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <TextField
            fullWidth label="Email" sx={{ mb: 2 }}
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          
          {/* Role Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newAdmin.role}
              onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth label="Password" type="password" sx={{ mb: 2 }}
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddAdmin} sx={{ mr: 2 }}>
            Save
          </Button>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#DC3545" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  {admin.role === "superadmin" ? (
                    <Button variant="contained" disabled size="small" sx={{ bgcolor: "#6c757d", mr: 1 }}>
                      Protected
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#17a2b8", mr: 1 }}
                        onClick={() => setViewAdmin(admin)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#ffc107", color: "black", mr: 1 }}
                        onClick={() => setEditAdmin(admin)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#DC3545", "&:hover": { bgcolor: "#c82333" } }}
                        onClick={() => {
                          setAdminToDelete(admin);
                          setConfirmDelete(true);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Dialog open={!!viewAdmin} onClose={() => setViewAdmin(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Admin Details</DialogTitle>
        <DialogContent dividers>
          {viewAdmin && (
            <>
              <Typography><strong>Name:</strong> {viewAdmin.name}</Typography>
              <Typography><strong>Email:</strong> {viewAdmin.email}</Typography>
              <Typography><strong>Role:</strong> {viewAdmin.role}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAdmin(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editAdmin} onClose={() => setEditAdmin(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent dividers>
          {editAdmin && (
            <>
              <TextField
                fullWidth label="Name" sx={{ mb: 2 }}
                value={editAdmin.name}
                onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
              />
              <TextField
                fullWidth label="Email" sx={{ mb: 2 }}
                value={editAdmin.email}
                onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
              />
              
              {/* Role Dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editAdmin.role}
                  onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
          <Button onClick={() => setEditAdmin(null)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Are you sure you want to delete this admin?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(adminToDelete.id)}
            color="primary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageAdmins;
