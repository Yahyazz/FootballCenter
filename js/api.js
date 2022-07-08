var API_KEY = "b9c15a42298e494bafe39fd79c3195f3";
var BASE_URL = "https://api.football-data.org/v2/";

// LEAGUE_ID for Champion League
const LEAGUE_ID = 2001;

const ENDPOINT_TEAMS = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;

// Create dynamic API CALL
const fetchAPI = url => {
    return fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        })
        .then(response => {
            if (response.status !== 200) {
                console.log("Error: " + response.status);
                return Promise.reject(new Error(response.statusText))
            } else {
                return Promise.resolve(response)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        })
};

// Create reusable Component Card for teams
function showTeams(data) {
    let teamsHTML = "";
    data.teams.forEach(function(teams) {
        function imgUrl(url) {
            return (url === null) ? "./image/logo-256.png" : url;
        }

        let urlCrest = imgUrl(teams.crestUrl);
        teamsHTML += `
            <div class="col s12 m6">
                <div class="card medium hoverable">
                    <div class="card-image waves-effect waves-block waves-light">
                        <a href="./teams.html?id=${teams.id}">
                            <img src="${urlCrest.replace(/^http:\/\//i, 'https://')}" onerror="if(this.src === false) {this.src ='.image/logo-256.png'; this.onerror='';} else {this.src ='./image/logo-256.png'}" alt="${teams.name} Logo"/>
                        </a>
                    </div>
                    <div class="card-content">
                        <span class="card-title truncate">${teams.name}</span>
                        <p>${teams.address}, <i>${teams.area.name}</i></p>
                    </div>
                </div>
            </div>
        `;
    });

    hideLoader();

    document.getElementById("teams").innerHTML = teamsHTML;
}

// Create reusable Component Card for each teams
function showTeamById(data) {
    function imgUrl(url) {
        return (url === null) ? "./image/logo-256.png" : url;
    }

    let urlCrest = imgUrl(data.crestUrl);
    let teamHTML = `
            <div class="card">
                <div class="card-image">
                    <img src="${urlCrest.replace(/^http:\/\//i, 'https://')}" onerror="if(this.src === false) {this.src ='.image/logo-256.png'; this.onerror='';} else {this.src ='./image/logo-256.png'}" alt="${data.name} Logo"/>
                </div>
                <div class="card-content">
                    <span class="card-title activator">${data.name}</span>
                    <p>Address : ${data.address}, <i>${data.area.name}</i></p>
                    <p>Founded in : ${data.founded}</p>
                    <p>Stadion Venue : ${data.venue}</p>
                </div>
                <div class="card-action hoverable">
                    <p>For more information : <a class="red-text" href="${data.website}">Visit Website ${data.name}</a></p>
                </div>
            </div>
    `;

    hideLoader();

    document.getElementById("body-content").innerHTML = teamHTML;
}

// Request JSON data
function getTeams() {
    showLoader();
    if ('caches' in window) {
        caches.match(ENDPOINT_TEAMS)
            .then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        console.log("Teams Data: " + data);
                        showTeams(data);
                    })
                };
            })
    }

    fetchAPI(ENDPOINT_TEAMS)
        .then(data => {
            console.log(data);
            showTeams(data);
        })
        .catch(error => {
            console.log(error);
        });
}

function getTeamById() {
    return new Promise(function(resolve, reject) {

        // Get query parameter value (?id=)
        var urlParams = new URLSearchParams(window.location.search);
        var idParams = urlParams.get("id");

        showLoader();

        if ("caches" in window) {
            caches.match(BASE_URL + "teams/" + idParams)
                .then(function(response) {
                    if (response) {
                        response.json().then(function(data) {
                            console.log(data);
                            showTeamById(data);
                            resolve(data);
                        });
                    }
                });
        }

        fetchAPI(BASE_URL + "teams/" + idParams)
            .then(function(data) {
                console.log(data);
                showTeamById(data);
                resolve(data);
            });
    })
}

function getSavedTeams() {
    showLoader();

    getAll().then(function(data) {
        console.log(data);
        let teamsHTML = "";
        if (data.length === 0) {
            teamsHTML = `<div class="center-align">
                            <p>Favorite Teams not found.</p>
                        </div>`
        } else {
            data.forEach(function(teams) {
                function imgUrl(url) {
                    return (url === null) ? "./image/logo-256.png" : url;
                }

                let urlCrest = imgUrl(teams.crestUrl);
                teamsHTML += `
                    <div class="col s12 m6">
                        <div class="card medium hoverable">
                            <div class="card-image waves-effect waves-block waves-light">
                                <a href="./teams.html?id=${teams.id}&saved=true">
                                    <img src="${urlCrest.replace(/^http:\/\//i, 'https://')}" onerror="if(this.src === false) {this.src ='.image/logo-256.png'; this.onerror='';} else {this.src ='./image/logo-256.png'}" alt="${teams.name} Logo"/>
                                </a>
                            </div>
                            <div class="card-content">
                                <span class="card-title truncate">${teams.name}</span>
                                <p>${teams.address}, <i>${teams.area.name}</i></p>
                            </div>
                        </div>
                    </div>
                `;

            });
        }
        hideLoader();
        document.getElementById("teams").innerHTML = teamsHTML;
    });
}

function getSavedTeamById() {
    return new Promise(function(resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idParams = urlParams.get("id");

        showLoader();
        getById(idParams).then(data => {
            console.log(data);
            showTeamById(data);
            resolve(data)
        }).catch(err => {
            console.log("Error: ", err);
        })
    })
}

function removeFavorite() {
    return new Promise(function(resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idParams = urlParams.get("id");

        deleteFavTeam(idParams).then(data => {
            M.toast({ html: `Removed from Favorite Team.` })
        })
    })
}

const showLoader = () => {
    const htmlLoader = `<div class="preloader-background">
                            <div class="preloader-wrapper medium active"> 
                                <div class="spinner-layer spinner-red-only">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div>
                                    <div class"gap-patch">
                                        <div class="circle"></div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
    document.getElementById("loader").innerHTML = htmlLoader;
};

const hideLoader = () => {
    document.getElementById("loader").innerHTML = "";
};