import React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, Button, DialogContent, DialogActions, TextField, Grid, FormControl, Select, InputLabel, MenuItem, Typography, Box} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const client = generateClient({
  authMode: "userPool",
});

export default function AddPatient () {

    const [open, setOpen] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDOB] = useState(null);
    const [weight, setWeight] = useState(0.00);
    const [height, setHeight] = useState(0.00);
    const [gender, setGender] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchPatients();
    };

    async function fetchPatients () {
        const { data: patients } = await client.models.Patient.list();
    }

    async function createPatient () {
        const { data: newPatient } = await client.models.Patient.create({
            firstName: firstName,
            lastName: lastName,
            dob: dob.toISOString().slice(0, 10),
            phone: phone,
            email: email,
            weight: weight,
            fatherName: fatherName,
            motherName: motherName,
            notes: "",
            visits: ""
        });
        console.log("created patient: ", newPatient);
        handleClose();
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                <Button variant="contained" color="primary" size="large" onClick={handleClickOpen}>New Patient</Button>
            </Box>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="h5" sx={{mt: 1}}>
                        Add New Patient
                    </Typography>  
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Patient Information</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth label="First Name" variant="outlined" onChange={(e) => {setFirstName(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth  label="Last Name" variant="outlined" onChange={(e) => {setLastName(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Birth Date"
                                    value={dob}
                                    onChange={(e) => setDOB(e)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>              
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    label="Gender"
                                >
                                    <MenuItem value={1}>Male</MenuItem>
                                    <MenuItem value={2}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField fullWidth  label="Weight (kg)" variant="outlined" 
                            onChange={(e) => {setWeight(parseFloat(e.target.value))}}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField fullWidth  label="Height (m)" variant="outlined" 
                            onChange={(e) => {setHeight(parseFloat(e.target.value))}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{mt: 3}}>Contact</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth  label="Father Name" variant="outlined" onChange={(e) => {setFatherName(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth  label="Mother Name" variant="outlined" onChange={(e) => {setMotherName(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth  label="Phone" variant="outlined" onChange={(e) => {setPhone(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField fullWidth  label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  label="Address" variant="outlined"/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>createPatient()}>Add Patient</Button>
                </DialogActions>
            </Dialog>
        </>
        
    )
}