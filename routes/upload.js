const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const csv = require('csvtojson');
const Encounter = require('../models/Encounter');
const fs = require('fs');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jsonArray = await csv().fromFile(filePath);

    const formattedData = jsonArray.map((row) => ({
      encounter_id: row['Encounter ID'],
      video_id: row['Video ID'],
      video_type: row['Video Type'],
      appointment_id: row['Appointment ID'],
      create_date: row['Create Date'],
      appointment_date: row['Appointment Date'],
      start_date: row['Start Date'],
      encounter_duration: row['Encounter Duration'],
      reason_for_visit: row['Reason for Visit'],
      client_name: row['Client Name'],
      group_name: row['Group Name'],
      carepoint: row['CarePoint'],
      type: row['Type'],
      philhealth_tranche: row['PhilHealth Tranche'],
      philhealth_transaction_no: row['PhilHealth Transaction No'],
      philhealth_transmittal_id: row['PhilHealth Transmittal ID'],
      philhealth_case_no: row['PhilHealth Case No'],
      philhealth_member_pin: row['PhilHealth Member PIN'],
      philhealth_member_type: row['PhilHealth Member Type'],
      barangay: row['Barangay'],
      cancelled: row['Cancelled'],
      patient_mrn: row['Patient MRN'],
      patient_name: row['Patient Name'],
      patient_age: row['Patient Age'],
      patient_gender: row['Patient Gender'],
      patient_in: row['Patient In'],
      patient_out: row['Patient Out'],
      patient_duration: row['Patient Duration'],
      clinician_id: row['Clinician ID'],
      clinician_name: row['Clinician Name'],
      clinician_in: row['Clinician In'],
      clinician_out: row['Clinician Out'],
      clinician_duration: row['Clinician Duration'],
      state: row['State'],
      presenter_names: row['Presenter Name/s'],
      cpt_codes: row['CPT Codes'],
      medications: row['Medications'],
      lab_orders_total: row['Lab Orders Total'],
      imaging_orders_total: row['Imaging Orders Total'],
      other_orders_total: row['Other Orders Total'],
      forms: row['Forms'],
      icd_codes: row['ICD Codes'],
      encounter_signed: row['Encounter Signed'],
      status: row['Status'],
      cc_rcvd: row['CC Rcvd'],
      cash_rcvd: row['Cash Rcvd'],
      reason_for_cancel: row['Reason for Cancel']
    }));

    await Encounter.insertMany(formattedData);

    fs.unlinkSync(filePath); // Delete the file after processing

    res.status(200).json({ message: 'Upload successful', records: formattedData.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
