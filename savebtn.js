function saveRecord() {
    Xrm.Page.data.entity.save();
}
/////////////////////////////////////

/////////////////////////
function isOrderEditable() {
    debugger;
    var statusReason = Xrm.Page.getAttribute("statecode").getValue();

    if (statusReason === 1) {
        return true; // Enable Save button
    }
    return false; // Keep it hidden otherwise
}

function enableSpecificFields() {
    var editableFields = [
        "new_customerpono",
        "new_orderclass",
        "cc_ordernotifications",
        "new_logoname",
        "cc_udf_alert_email",
        "new_salesperson",
        "cc_confirmto",
        "new_poclass",
        "cc_udf_in_hand_date",
        "cc_shipexpiredate",
        "new_comment",
        "new_instructions",
        "new_worksheetspecialinstructions"
    ];

    debugger;
    var statusReason = Xrm.Page.getAttribute("statecode").getValue();

    if (statusReason === 1) {
        editableFields.forEach(function (field) {
            var control = Xrm.Page.getControl(field);
            if (control) {
                control.setDisabled(false); // Unlock field
            }
        });
    }

}



