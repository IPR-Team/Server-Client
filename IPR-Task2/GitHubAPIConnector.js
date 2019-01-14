//Constructor and Class
function GitHubAPIConnector(){
  var statusCode = 200;
  //public function of object GitHubAPIConnector / each kind of connector do need this function!!!
  this.searchForProjects = function(search_string, amount_of_results, page, createdBeforeDate, callback){
    //Header: link - ...    auswerten für maximale Anzahl der Seiten
    var url = "https://api.github.com/search/repositories";
    var query = "?q=".concat(search_string);
    var created = "&created%3A<".concat(createdBeforeDate);
    var maxResults = "&per_page=" + amount_of_results;
    var page = "&page=" + page;
    var sort = "&sort=updated";
    var url = url.concat(query, created, maxResults, page,sort);
    console.log(url);
    var pullProjectResponse = [];
    fetch(url)
    .then(function(response){
      console.log("Requested: " + url);
      statusCode = response.status;
      return response.json();
    })
    .then(function(jsonString){
      if(statusCode < 299 && statusCode >= 200){
        var object = jsonString.items;
        console.log("Received " + object.length + " items");
        for(i = 0; i < object.length; i++){
          pullProjectResponse.push(parseObjectToProjectData(object[i]));
        }
        callback(pullProjectResponse);
      }else{
        throw new Error("Request: " + statusCode + " " + jsonString.message);
      }
    }).
    catch(function(error){
      console.log(error);
    });
  }

  //use this function to get complete data set of a project
  this.getProjectDetails = function (id, project, callback) {
    var url = "https://api.github.com"
    var query = "/repos/".concat(project.owner.name, "/", project.general.name, "/stats/contributors")
    url = url.concat(query);
    fetch(url)
    .then(function(response){
      console.log("Requested: " + url);
      statusCode = response.status;
      return response.json();
    })
    .then(function(object){
      if(statusCode < 299 && statusCode >= 200){
        project.amount_contributors = object.length;
        callback(id, project);
      }else{
        throw new Error("Request: " + statusCode + " " + object.message);
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }
  //private function: Shortened description by triming full string
  var processDescription = function(description){
    if(description != null){
      description = description.replace(/[\s\r\n\t]+/g, " "); //regex -> check me on regexr.com
    }
    return description;
  }

  var parseObjectToProjectData = function(object){
    //Name Projekt/Repository + Url
    //Description
    //Quelle (GitHub, GitLab or BitBucket)
    //Datum letzte Aktualisierung
    //Owner + Profpic + Url
    //Anzahl beteiligte Personen/Orgnaisationen (Contributors)
    //Projektseite/Homepage außerhalb repo
    var project = {};
    project.general = {};
    project.general.name = object.name;
    project.general.url = object.html_url;
    project.description = processDescription(object.description);
    project.source = "GitHub";
    project.last_updated = object.updated_at;
    project.owner = {};
    project.owner.name = object.owner.login;
    project.owner.url = object.owner.html_url;
    project.owner.image = object.owner.avatar_url;
    project.amount_contributors = 0;
    project.external_homepage = object.homepage;
    return project;
  }
};
