
function getWagers() {
  
    const url = 'https://www.steveconsevage.com/api/sportsbookoddslive/getall';
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);  
    req.onload  = () => {
       updateTable(req.response);
    };
    req.send(null);
  }
  
  function updateTable(jsonResponse) {
    const TABLE_ELEMENTS = [
      'uniqueId',
      'updateTime',
      'category',
      'eventStartTime',
      'eventStartDate',
      'eventId',
      'eventDisplayName',
      'eventParticipant1',
      'eventParticipant2',
      'offerId',
      'offerType',
      'offerSubject',
      'offerDuration',
      'offerParticipant',
      'offerLine',
      'outcomeId',
      'outcomeParticipantCondition',
      'draftkings',
      'fanduel',
    ];
    var tbl = document.getElementById("myTable");
    for (let i = 0; i < jsonResponse.length; i++ ) {
      var row = tbl.insertRow();
      for (let j = 0; j < TABLE_ELEMENTS.length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = jsonResponse[i][TABLE_ELEMENTS[j]];
      }      
    }
  }
  
  
  
  
  //var tbl = document.getElementById("myTable");
  //var row = tbl.insertRow();