var rowCounter = -1;
var createdDataCounter = 0;

function addElementToTable(general, description, source, last_updated, owner, amount_contributors, external_homepage){
  rowCounter++;
  var newRow = document.createElement("tr");
  newRow.setAttribute("id", "row".concat(rowCounter));

  var numberElement = document.createElement("td");
  numberElement.innerHTML = rowCounter;

  var nameElement = document.createElement("td");
  nameElement.innerHTML = general.name.concat("<br/>", general.url);

  var descriptionElement = document.createElement("td");
  descriptionElement.innerHTML = description;

  var sourceElement = document.createElement("td");
  sourceElement.innerHTML = source;

  var lastUpdatedElement = document.createElement("td");
  lastUpdatedElement.innerHTML = last_updated;

  var ownerElement = document.createElement("td");
  var userDescription = document.createElement("p");
  var image = document.createElement("img");
  image.setAttribute("src", owner.image);
  image.setAttribute("id", "picture");
  userDescription.innerHTML = owner.name.concat("<br/>", owner.url);
  ownerElement.appendChild(image);
  ownerElement.appendChild(userDescription);

  var amountContributorsElement = document.createElement("td");
  amountContributorsElement.innerHTML = amount_contributors;

  var externalHomepageElement = document.createElement("td");
  externalHomepageElement.innerHTML = external_homepage;

  newRow.appendChild(numberElement);
  newRow.appendChild(nameElement);
  newRow.appendChild(descriptionElement);
  newRow.appendChild(sourceElement);
  newRow.appendChild(lastUpdatedElement);
  newRow.appendChild(ownerElement);
  newRow.appendChild(amountContributorsElement);
  newRow.appendChild(externalHomepageElement);
  document.getElementById("resultTable").appendChild(newRow);
}

//Will be accessed by connectors!
function addProjectToTable(project){
  addElementToTable(project.general, project.description, project.source, project.last_updated,
    project.owner, project.amount_contributors, project.external_homepage);
}

function deleteOldTableEntries(){
  if(rowCounter > 0){
    while(rowCounter >= 0){
      var child = document.getElementById("row".concat(rowCounter));
      child.remove();
      rowCounter--;
    }
  }
}

function processSearchString(searchString){
  var newSearchString = searchString.replace(/[^\w\d]+/g," ");
  newSearchString = newSearchString.trim().toLowerCase();
  newSearchString = newSearchString.replace(/\s+/g,"+");
  return newSearchString;
}

function activateResultTable(){
  var table = document.getElementById("resultArea");
  if(table.style.display === "none"){
    table.style.display = "block";
  }
}

function searchButtonClicked(){
  var sources = new Array();
  if(document.getElementById("bitBucketCheckbox").checked == true){
    sources.push("BitBucket");
  }
  if(document.getElementById("gitHubCheckbox").checked == true){
    sources.push("GitHub");
  }
  if(document.getElementById("gitLabCheckBox").checked == true){
    sources.push("GitLab");
  }
  var searchString = document.getElementById("input").value;
  document.getElementById("input").value = "";
  document.getElementById("lastSearchedOutput").innerHTML = searchString;
  searchString = processSearchString(searchString);
  activateResultTable();
  searchForProjects(searchString, sources);
}
