
function getWagers() {
  
  const url = 'https://www.steveconsevage.com/api/localbooks/getall';
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
    'entry_id',
    'entry_post_time',
    'category',
    'match_name',
    'match_date',
    'match_time',
    'participant_1',
    'participant_2',
    'game_team_player',
    'wager_name',
    'wager_condition',
    'wager_value',
    '_888east',
    'easytowager',
    'magnumbets',
    'playcrag',
    'str8bet',
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