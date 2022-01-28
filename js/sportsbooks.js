const containerIdStr = 'containerId';
const columnLabelsMoneyline = ['Condition', 'Draftkings','Fanduel'];
const columnLabelsSpread = ['Line'].concat(columnLabelsMoneyline);
const moneylineString = 'moneyline';
const dtOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'};
var requestLoop = null;
var allowFormSubmit = true;

window.onload = function () {
    var form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function submitted(event){
    let curEvent = event;    
    curEvent.preventDefault();
    if (allowFormSubmit === false) {
        return
    }
    allowFormSubmit = false;
    try {
        clearInterval( requestLoop);
    } catch(error) {
        //pass
    }
    apiFetch(curEvent);  
    requestLoop = setInterval( function() {
        apiFetch(curEvent)
    }, 60000);
    await sleep(1000);
    allowFormSubmit = true;
}



function apiFetch( event ) {
    let fetcher = fetch(event.target.action, {
            method: 'POST',
            body: new URLSearchParams(new FormData(event.target)) 
        }).then((resp) => {              
            return resp.json(); 
        }).then((body) => {
            offerData.overwriteData(body);
        }).catch((error) => {
            // TODO handle error
    });
    return fetcher
}

function appendData(data) {
    var offerDisplayContainer = document.getElementById("offerDisplay");
    while (offerDisplayContainer.lastElementChild) {
        offerDisplayContainer.removeChild(offerDisplayContainer.lastElementChild)
    }
    for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = data[i].category;
        offerDisplayContainer.appendChild(div);
    }
}

class OfferData {
    constructor(){
        this.dataDictionary = {};
        this.displayContainers = {};
    }

    addRowToOfferTable(datum, offerTypeId, offerType) {
        var offerTable = document.getElementById(offerTypeId);
        var row = offerTable.insertRow();
        if (offerType !== moneylineString) {
            var line = row.insertCell();
            //line.innerHTML = datum.offerLine;
            line.innerHTML = datum.offerDisplayLine;
        } 
        var condition = row.insertCell();
        condition.innerHTML = datum.outcomeId;
        var draftkings = row.insertCell();
        draftkings.innerHTML = datum.draftkings;
        var fanduel = row.insertCell();
        fanduel.innerHTML = datum.fanduel;
    }

    createCategoryContainer( categoryIdString ) {
        var offerDisplayContainer = document.getElementById("offerDisplay");
        var categoryContainer = document.createElement('div');
        var categoryTitle = document.createElement('h3');
        categoryContainer.id = categoryIdString;
        categoryTitle.innerHTML = categoryIdString.toUpperCase();
        categoryTitle.classList.add('center_horizontal_text');
        categoryContainer.appendChild(categoryTitle);
        offerDisplayContainer.appendChild(categoryContainer);
        return categoryContainer
    }

    createEventContainer( categoryIdString, eventIdString, eventDisplayName, eventStartDateTime, eventStatus ) {
        var eventContainer = document.createElement('div');
        var eventTitleContainer = document.createElement('h4');
        var eventTitle = document.createElement('span');
        var eventLive = document.createElement('span');
        var categoryContainer = document.getElementById( categoryIdString );
        eventContainer.id = eventIdString;

        let clientEventDisplayTitle;
        // add eventStatus support
        // if eventStatus = live -> show live
        // else: show startDateTime
        if (eventStartDateTime !== null) {
            let dateTime = new Date(eventStartDateTime).toLocaleString('en-US', dtOptions);
            clientEventDisplayTitle = eventDisplayName.toUpperCase().concat('    --    ', dateTime);
        } else {
            clientEventDisplayTitle = eventDisplayName.toUperrCase();
        }
        console.log(eventStatus);
        if (eventStatus == 'live' ){
            eventLive.innerHTML = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +'LIVE';
        }
      
        eventTitle.innerHTML = clientEventDisplayTitle;
        eventTitleContainer.classList.add('center_horizontal_text');
        //eventTitle.classList.add('center_horizontal_text');
        eventLive.classList.add('live_text_box');
        eventContainer.appendChild(eventTitleContainer);
        eventTitleContainer.appendChild(eventTitle);
        eventTitleContainer.appendChild(eventLive);
        categoryContainer.appendChild(eventContainer);
        return eventContainer
    }
    
    createOfferTable( eventIdString, offerTypeIdString, offerTypeString ) {
        var offerContainer = document.createElement('div');
        var offerTable = document.createElement('table');
        var eventContainer = document.getElementById(eventIdString);
        offerTable.id = offerTypeIdString;
        offerTable.border = 1;
        //offerTable.style.border = "1px solid #000";
        offerTable.classList.add('center_horizontal');
        var offerTableCaption = offerTable.createCaption()
        offerTableCaption.textContent = offerTypeString;
        var row = offerTable.insertRow();
        var columnLabels;
        if (offerTypeString == moneylineString) {
            columnLabels = columnLabelsMoneyline;
        } else {
            columnLabels = columnLabelsSpread;
        }
        for (let i = 0; i < columnLabels.length; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = columnLabels[i];
            row.appendChild(headerCell);
        }
        offerContainer.appendChild(offerTable);
        offerContainer.appendChild(document.createElement('br'));
        eventContainer.appendChild(offerContainer);
    }

    displayEmptyPayloadMessage() {        
        var div = document.createElement("div");
        div.innerHTML = 'No offers were found for the given selection.';
        offerDisplayContainer.appendChild(div);        
    }

    displayServerMessage() {        
        var div = document.createElement("div");
        div.innerHTML = this.dataDictionary['serverMessage'];
        offerDisplayContainer.appendChild(div);
    }

    overwriteData( data ) {
        if (( data instanceof Array) == false) {
            console.log('Error: API offer data is improperly formatted');
            return
        }
        var offerDisplayContainer = document.getElementById("offerDisplay");
        while (offerDisplayContainer.lastElementChild) {
            offerDisplayContainer.removeChild(offerDisplayContainer.lastElementChild)
        }
        this.dataDictionary = {};
        this.displayContainers = {};
        if (data.length == 0) {
            this.displayEmptyPayloadMessage();
            return
        }
        if ( data[0].serverMessage !== undefined ) {     
            this.dataDictionary['serverMessage'] = data[0].serverMessage;
            this.displayServerMessage();  
            return
        }
        var datum, category, eventId, offerType, offerTypeId;
        for (let i = 0; i < data.length; i++) {     
            datum = data[i];       
            category = datum.category;
            //eventId = datum.eventId.replace(/ /g,'_');
            eventId = datum.eventId;
            offerType = datum.offerType;
            this.dataDictionary[datum.uniqueId] = datum;
            if ( this.displayContainers[category] == undefined ) {
                this.displayContainers[category] = {};
                this.createCategoryContainer(category);
            }
            if ( this.displayContainers[category][eventId] == undefined) {
                this.displayContainers[category][eventId] = {};
                this.createEventContainer( category, eventId, datum.eventDisplayName , datum.eventStartDateTime, datum.eventStatus);
            }
            //offerTypeId = eventId + '_' + offerType;
            offerTypeId = datum.offerTypeId;
            if (this.displayContainers[category][eventId][offerType] == undefined ) {
                this.displayContainers[category][eventId][offerType] = offerType;
                this.createOfferTable( eventId, offerTypeId, offerType);
            }
            this.addRowToOfferTable(datum, offerTypeId, offerType);
            //TODO add data to table
        }
    }

    updateData( data ) {
        //TODO Define me later
    }
}

const offerData = new OfferData();

