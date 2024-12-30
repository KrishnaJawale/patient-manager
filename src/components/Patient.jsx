import React from "react";
import TextField from '@mui/material/TextField';
import { Dialog, DialogTitle, Button, DialogContent, Grid, FormControl, Select, InputLabel, MenuItem, Typography, Box, DialogActions} from "@mui/material";
import { patientModalOpenAtom } from "../atoms";
import { useAtom } from "jotai";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@mui/material";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
const client = generateClient({
    authMode: "userPool",
  });

const Patient = ({patientId}) => {
    const [patientModalOpen, setPatientModalOpen] = useAtom(patientModalOpenAtom);
    const [patientAddVisitModalOpen, setPatientAddVisitModalOpen] = useState(false);
    const [patientData, setPatientData] = useState([]);
    const [visits, setVisits] = useState([]);
    const [visitAction, setVisitAction] = useState("");
    const [editVisitData, setEditVisitData] = useState([]);

    const [visitDate, setVisitDate] = useState(null);
    const [visitReason, setVisitReason] = useState("");
    const [visitDiagnosis, setVisitDiagnosis] = useState("");
    const [visitPrescriptions, setVisitPrescriptions] = useState("");
    const [visitNotes, setVisitNotes] = useState("");

    const closePatientModal = () => {
        setPatientModalOpen(false);
        setPatientAddVisitModalOpen(false);
    }
    
    useEffect(() => {
        patientId && fetchPatient();
        patientId && fetchPatientVisits();
    }, [patientId]);

    async function fetchPatient () {
        const {data: patient } = await client.models.Patient.get ({
            id: patientId,
        })

        setPatientData(patient);
    }

    async function fetchPatientVisits () {
        const {data: patientVisits } = await client.models.Patient.get (
            { id: patientId },
            { selectionSet: ["id", "visits.*"] },
        )

        setVisits(patientVisits.visits);
        console.log("patient visits: ", patientVisits.visits);
    }

    async function createVisit () {
        const { data: newVisit } = await client.models.Visit.create({
            visitDateTime: visitDate.toISOString(),
            reason: visitReason,
            notes: visitNotes,
            prescription: visitPrescriptions,
            patientId: patientId,
        });

        fetchPatientVisits();
        setPatientAddVisitModalOpen(false);
    }

    function getEditVisitData (visitId) {
        setEditVisitData(visits.filter(visit => visit.id == visitId)[0]);
        setPatientAddVisitModalOpen(true);
        setVisitAction("EDIT");
        console.log("interesting");
    }

    return (
        <Dialog open={patientModalOpen} onClose={closePatientModal} fullWidth maxWidth="lg">
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h5" sx={{mt: 1}}>
                    {patientAddVisitModalOpen ? ( visitAction === "CREATE" ? `${patientData?.firstName} ${patientData?.lastName}`
                        : `${patientData.firstName} ${patientData.lastName}`
                    ) : `${patientData.firstName} ${patientData.lastName}`}
                </Typography>  
            </DialogTitle>
            {
                !patientAddVisitModalOpen ? (
                    <>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Patient Details</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`First Name`}</Typography>
                                    <Typography>{patientData?.firstName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Last Name`}</Typography>
                                    <Typography>{patientData?.lastName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Birth Date`}</Typography>
                                    <Typography>{patientData?.dob}</Typography>                                    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Gender`}</Typography>
                                    <Typography>{`Male`}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Weight (kg)`}</Typography>
                                    <Typography>{patientData?.weight}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Height (m)`}</Typography>
                                    <Typography>{`1.89`}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Father Name`}</Typography>
                                    <Typography>{patientData?.fatherName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{`Mother Name`}</Typography>
                                    <Typography>{patientData?.motherName}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 3}}>
                                    <Typography variant="h6">Contact</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>{`Phone`}</Typography>
                                    <Typography>{patientData?.phone}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>{`Email`}</Typography>
                                    <Typography>{patientData?.email}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>Address</Typography>
                                    <Typography>123 Green Avenue</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 3}}>
                                    <Typography variant="h6">Patient Visits </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="contained" color="primary" size="medium" onClick={() => {setPatientAddVisitModalOpen(true); setVisitAction("CREATE");}}> New Visit</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer sx={{mt: 3}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Visit Date
                                                    </TableCell>
                                                    <TableCell>
                                                        Visit Reason
                                                    </TableCell>
                                                    <TableCell>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {console.log("visits here: ", visits)}
                                                {visits.map((visit) => (
                                                    <TableRow key={visit.id}>
                                                        <TableCell>{visit.visitDateTime.slice(0, 10)}</TableCell>
                                                        <TableCell>{visit.reason}</TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" color="primary" size="medium" onClick={() => getEditVisitData(visit.id)}>View Visit Details</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closePatientModal}>Close</Button>
                        </DialogActions>
                    </>
                ) : (visitAction === "CREATE" ? (
                    <>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Visit Details</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Visit Date"
                                            value={visitDate}
                                            onChange={(e) => setVisitDate(e)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField fullWidth label="Reason for Visit" variant="outlined" onChange={(e)=>setVisitReason(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Diagnosis" variant="outlined" onChange={(e)=>setVisitDiagnosis(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField multiline rows={4}  fullWidth label="Prescription(s)" variant="outlined" onChange={(e)=>setVisitPrescriptions(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Visit Notes" variant="outlined" multiline rows={4}
                                        onChange={(e)=>setVisitNotes(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => createVisit()}>Add Visit</Button>
                            <Button onClick={() => setPatientAddVisitModalOpen(false)}>Back</Button>
                        </DialogActions>
                    </>
                    ) : (
                        <>
                            <>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Visit Details</Typography>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <TextField fullWidth label="Visit Date" variant="outlined" value={editVisitData.visitDateTime.slice(0, 10)}/>
                                        </Grid>
                                        <Grid item xs={10.5}>
                                            <TextField fullWidth label="Reason for Visit" variant="outlined" value={editVisitData.reason}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Diagnosis" variant="outlined" value=""/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth multiline rows={4}  label="Prescription(s)" variant="outlined" value={editVisitData.prescription}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Visit Notes" variant="outlined" multiline rows={4} value={editVisitData.notes}/>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => createVisit()}>Add Visit</Button>
                                    <Button onClick={() => setPatientAddVisitModalOpen(false)}>Back</Button>
                                </DialogActions>
                            </>
                        </>
                    )
                )
            }    
        </Dialog>
    )
}

export default Patient;