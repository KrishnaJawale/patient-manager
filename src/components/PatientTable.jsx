import React from "react";
import TextField from '@mui/material/TextField';
import { Box, Button } from "@mui/material";
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
  } from "@mui/material";

const client = generateClient({
  authMode: "userPool",
});

const PatientTable = () => {
    const [patientModalOpen, setPatientModalOpen] = useAtom(patientModalOpenAtom);
    const [patientsList, setPatientsList] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [search, setSearch] = useState("");

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

    return (
        <Box sx={{mt: 5}}>
            <TextField fullWidth label="Search by Patient Name" variant="outlined" onChange={(e)=>setSearch(e.target.value)} />
            <TableContainer sx={{mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Birth Date</TableCell>
                            <TableCell>Add Visit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patientsList.filter((patient) => 
                            patient.firstName.toLowerCase().includes(search.toLowerCase()) || patient.lastName.toLowerCase().includes(search.toLowerCase())
                        ).map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.firstName}</TableCell>
                                <TableCell>{patient.lastName}</TableCell>
                                <TableCell>{patient.dob}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" size="medium" onClick={() => openPatientModal(patient.id)}>Update Patient</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Patient patientId={patientId}></Patient>
        </Box>
    )
}

export default PatientTable;