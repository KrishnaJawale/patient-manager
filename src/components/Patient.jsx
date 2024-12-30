import React from "react";
import TextField from '@mui/material/TextField';
import { Dialog, DialogTitle, Button, DialogContent, Grid, FormControl, Select, InputLabel, MenuItem, Typography, Box, DialogActions} from "@mui/material";
import { patientModalOpenAtom } from "../atoms";
import { useAtom } from "jotai";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputAdornment,
    IconButton
  } from "@mui/material";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import jsPDF from "jspdf";

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
    const [visitUpdatedWeight, setVisitUpdatedWeight] = useState(0.00);
    const [visitUpdatedHeight, setVisitUpdatedHeight] = useState(0.00);

    const [prescriptionPDFURL, setPrescriptionPDFURL] = useState("");
    const [prescriptionPDFDialogOpen, setPrescriptionPDFDialogOpen] = useState(false);

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

        console.log(patient);

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
        const patient = {
            id: patientId,
            height: visitUpdatedHeight ? visitUpdatedHeight : patientData.height,
            weight: visitUpdatedWeight ? visitUpdatedWeight : patientData.weight
        }

        const { data : updatedPatient } = await client.models.Patient.update(patient);

        const { data: newVisit } = await client.models.Visit.create({
            visitDateTime: visitDate.toISOString(),
            reason: visitReason,
            notes: visitNotes,
            prescription: visitPrescriptions,
            diagnosis: visitDiagnosis,
            patientId: patientId,
        });

        fetchPatientVisits();
        fetchPatient();
        setPatientAddVisitModalOpen(false);
    }

    function getEditVisitData (visitId) {
        setEditVisitData(visits.filter(visit => visit.id == visitId)[0]);
        setPatientAddVisitModalOpen(true);
        setVisitAction("EDIT");
        console.log("interesting");
    }

    const printPrescriptionPDF = () => {
        const currentDate = new Date();
        const currentDateFormatted = currentDate.toISOString().slice(0, 10);

        const prescriptionPDF = new jsPDF();
        prescriptionPDF.text("Pushpai Childrens Clinic", 20, 20);
        prescriptionPDF.text("Clinic Address Here", 20, 30);
        prescriptionPDF.text("Dr. Amol Jawale", 20, 40);
        prescriptionPDF.text(`Patient: ${patientData.firstName} ${patientData.lastName}`, 20, 70);
        prescriptionPDF.text(`Birth Date: ${patientData.dob}`, 20, 80);
        prescriptionPDF.text("Diagnosis:", 20, 110);
        prescriptionPDF.text(visitDiagnosis, 20, 120, {maxWidth: 160, lineHeightFactor: 2});
        prescriptionPDF.text("Prescription:", 20, 150);
        prescriptionPDF.text(visitPrescriptions, 20, 160, {maxWidth: 160, lineHeightFactor: 2});
        prescriptionPDF.text(`Date: ${currentDateFormatted}`, 120, 230);
        //prescriptionPDF.text("Signature: ", 120, 240);
        
        const prescriptionPDFURL = prescriptionPDF.output('datauristring');
        setPrescriptionPDFURL(prescriptionPDFURL);
        setPrescriptionPDFDialogOpen(true);
    }

    const handlePrescriptionPDFLoad = () => {
        setTimeout(() => {
            const prescriptioniframe = document.getElementById("prescrptionPDFIframe");
            prescriptioniframe.focus();
            prescriptioniframe.contentWindow.print();
        }, 1000)
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
                        <DialogContent sx={{mt: 2}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Patient Information</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`First Name`}</Typography>
                                    <Typography>{patientData?.firstName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Last Name`}</Typography>
                                    <Typography>{patientData?.lastName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Birth Date`}</Typography>
                                    <Typography>{patientData?.dob}</Typography>                                    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Gender`}</Typography>
                                    <Typography>{patientData?.gender}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Weight (kg)`}</Typography>
                                    <Typography>{patientData?.weight}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Height (m)`}</Typography>
                                    <Typography>{patientData?.height}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Father Name`}</Typography>
                                    <Typography>{patientData?.fatherName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="overline">{`Mother Name`}</Typography>
                                    <Typography>{patientData?.motherName}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 3}}>
                                    <Typography variant="h6">Contact</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="overline">{`Phone`}</Typography>
                                    <Typography>{patientData?.phone}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="overline">{`Email`}</Typography>
                                    <Typography>{patientData?.email}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="overline">Address</Typography>
                                    <Typography>{patientData?.address}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 3}}>
                                    <Box sx={{display: "flex"}}>
                                        <Typography variant="h6">Patient Visits </Typography>
                                        <Button variant="contained" color="primary" size="small"
                                            onClick={() => {setPatientAddVisitModalOpen(true); setVisitAction("CREATE");}} sx={{ml: 3}}>Add </Button>
                                    </Box>
                                </Grid>
                                {visits.length > 0 && (<Grid item xs={12}>
                                    <TableContainer>
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
                                                            <Button variant="contained" color="primary" size="small" onClick={() => getEditVisitData(visit.id)}>View</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                )}
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
                                    <Typography variant="h6">Add New Visit</Typography>
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
                                <Grid item xs={5}>
                                    <TextField fullWidth label="Weight (kg)" variant="outlined" onChange={(e)=>setVisitUpdatedWeight(parseFloat(e.target.value))}
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">{`${patientData.weight ? patientData.weight : `None`} →`}</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField fullWidth label="Height (m)" variant="outlined" onChange={(e)=>setVisitUpdatedHeight(parseFloat(e.target.value))}
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">{`${patientData.height ? patientData.height : `None`} →`}</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Reason for Visit" variant="outlined" onChange={(e)=>setVisitReason(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Diagnosis" variant="outlined" onChange={(e)=>setVisitDiagnosis(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField multiline rows={4}  fullWidth label="Prescription(s)" variant="outlined" onChange={(e)=>setVisitPrescriptions(e.target.value)}
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end"><IconButton onClick={()=>printPrescriptionPDF()}><DownloadIcon/></IconButton></InputAdornment>
                                            }
                                        }}    
                                    />
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
                        
                        <Dialog open={prescriptionPDFDialogOpen} onClose={() => setPrescriptionPDFDialogOpen(false)} fullWidth maxWidth="md">
                            <DialogTitle>Prescription PDF</DialogTitle>
                            <DialogContent>
                                <iframe
                                    id="prescrptionPDFIframe"
                                    src={prescriptionPDFURL}
                                    width="100%"
                                    height="500px"
                                    title="Prescription PDF"
                                    style={{border: "none"}}
                                    onLoad={handlePrescriptionPDFLoad}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setPrescriptionPDFDialogOpen(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
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
                                            <TextField fullWidth label="Diagnosis" variant="outlined" value={editVisitData.diagnosis}/>
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