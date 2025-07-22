async function setFromQueueBasedOnCase(formContext) {
    try {
        // 1. Get Regarding Case reference
        let regarding = formContext.getAttribute("regardingobjectid").getValue();
        if (!regarding || regarding[0].entityType !== "incident") {
            console.log("No Case linked in Regarding field.");
            return;
        }
        console.log("Regarding: "+ regarding);

        let caseId = regarding[0].id.replace("{", "").replace("}", "");
        console.log("CaseID is"+caseId);

        // 2. Retrieve the Case to get new_businessunit
        let caseResponse = await Xrm.WebApi.retrieveRecord("incident", caseId, "?$select=new_businessunit");

        if (!caseResponse.new_businessunit) {
            console.log("Case does not have a new_businessunit value.");
            return;
        }

        let businessUnitId = caseResponse.new_businessunit;

        // 3. Find Queue with matching new_businessunit
        let queueQuery = `/queues?$select=queueid,name&$filter=new_businessunit eq ${businessUnitId}`;
        let queueResponse = await Xrm.WebApi.retrieveMultipleRecords("queue", queueQuery);

        if (queueResponse.entities.length === 0) {
            console.log("No matching Queue found for this business unit.");
            return;
        }

        let queue = queueResponse.entities[0];

        // 4. Set the From field with the found Queue
        let fromField = formContext.getAttribute("from");
        if (!fromField) {
            console.log("'From' field not found on the form.");
            return;
        }

        let queueParty = [{
            id: queue.queueid,
            name: queue.name,
            entityType: "queue"
        }];

        fromField.setValue(queueParty);
        console.log(`'From' field set to Queue: ${queue.name}`);

    } catch (error) {
        console.error("Error in setting From field:", error);
    }
}

// Example: To call this function on form load
function onFormLoad(executionContext) {
    let formContext = executionContext.getFormContext();
    setFromQueueBasedOnCase(formContext);
}


