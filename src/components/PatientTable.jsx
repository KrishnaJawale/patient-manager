import React from "react";
import TextField from '@mui/material/TextField';
import { Box, Button, Typography } from "@mui/material";
import { patientModalOpenAtom } from "../atoms";
import { useAtom, useSetAtom } from "jotai";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import Patient from "./Patient"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid, Card, CardActions, CardContent
  } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const client = generateClient({
  authMode: "userPool",
});

const PatientTable = () => {
    const [patientModalOpen, setPatientModalOpen] = useAtom(patientModalOpenAtom);
    const [patientsList, setPatientsList] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [searchBy, setSearchBy] = useState("");
    const [search, setSearch] = useState("");
    const [searchDOB, setSearchDOB] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients () {
        const { data: patients } = await client.models.Patient.list();
        setPatientsList(patients);
    }

    const openPatientModal = (id) => {
        setPatientId(id);
        setPatientModalOpen(true);
    }

    const handleSearch = () => {
        console.log(searchBy);
        if (searchBy === "EMAIL") {
            fetchPatientsByEmail();
        } else if (searchBy === "PHONE") {
            fetchPatientsByPhone();
        } else if (searchBy === "DOB") {
            fetchPatientsByDOB();
        } else {
            fetchPatients();
        }
    }

    async function fetchPatientsByEmail () {
        const { data: patients } = await client.models.Patient.patientByEmail({
            email: search
        });
        console.log("patients by email: ", patients);
        setPatientsList(patients);
    }
    
    async function fetchPatientsByPhone () {
        const { data: patients } = await client.models.Patient.patientByPhone({
            phone: search
        });
        console.log("patients by phone: ", patients);
        setPatientsList(patients);
    }

    async function fetchPatientsByDOB () {
        const { data: patients } = await client.models.Patient.patientByDob({
            dob: searchDOB.toISOString().slice(0, 10)
        });
        console.log("patients by dob: ", patients);
        setPatientsList(patients);
    }

    return (
        <Box sx={{mt: 5}}>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Grid container spacing={2} sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "50%"}}>
                    <Grid item xs={5}>
                        <FormControl fullWidth size="small" >
                            <InputLabel id="demo-simple-select-label">Search by</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                label="Search by"
                                value={searchBy}
                                onChange={(e) => setSearchBy(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>All Patients</MenuItem>
                                <MenuItem value={"EMAIL"}>Email</MenuItem>
                                <MenuItem value={"PHONE"}>Phone</MenuItem>
                                <MenuItem value={"DOB"}>Date of Birth</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {searchBy != "ALL" && (
                        <Grid item xs={5}>
                            {
                                searchBy === "DOB" ? (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Enter Birth Date"
                                            value={searchDOB}
                                            onChange={(e) => setSearchDOB(e)}
                                            renderInput={(params) => <TextField size="small" {...params} />}
                                        />
                                    </LocalizationProvider>
                                ) : (
                                    <TextField size="small" fullWidth variant="outlined" 
                                    label={searchBy === "EMAIL" ? "Enter Email" : "Enter Phone"
                                    }
                                    onChange={(e)=>setSearch(e.target.value)} />
                                )
                            }
                        </Grid>
                    )}
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" size="medium" onClick={()=>handleSearch()}>Search</Button>
                    </Grid>
                </Grid>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" sx={{mt: 4}}>
                    {patientsList.map((patient) => (
                        <Card key={patient.id} onClick={() => openPatientModal(patient.id)}
                            sx={{padding: 1, width: 350, transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                }
                            }}
                            >
                            <CardContent>
                                <Typography variant="h6">{`${patient.firstName} ${patient.lastName}`}</Typography>
                                <Box sx={{mt: 2}}>
                                    <Typography variant="overline">Birth Date</Typography>
                                    <Typography>{`${patient.dob}`}</Typography>
                                    <Typography variant="overline">Phone</Typography>
                                    <Typography>{`${patient.phone}`}</Typography>
                                    <Typography variant="overline">Email</Typography>
                                    <Typography>{`${patient.email}`}</Typography>
                                </Box>
                            </CardContent>

                        </Card>
                    ))}
            </Box>
            <Patient patientId={patientId}></Patient>
        </Box>
    )
}

export default PatientTable;