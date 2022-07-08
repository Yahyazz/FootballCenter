document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");
    var isFromSaved = urlParams.get("saved");

    var s = document.getElementById("saveBtn");
    var d = document.getElementById("deleteBtn");
    s.style.display = 'block';
    d.style.display = 'none';

    if (isFromSaved) {
        s.style.display = 'none';
        d.style.display = 'block';
        getSavedTeamById();
    } else {
        var add = getTeamById();
        getById(idParams).then(function(team) {
            // console.log(team);
            if (team === undefined) {
                s.style.display = 'block';
            } else {
                d.style.display = 'none';
                d.style.display = 'block';
            }
        });
    }

    saveBtn.onclick = function() {
        s.style.display = "none";
        d.style.display = "block";
        console.log("FAB button is clicked.");
        add.then(function(team) {
            saveForLater(team);
        });
    };

    deleteBtn.onclick = function() {
        s.style.display = "block";
        d.style.display = "none";
        console.log("FAB button is clicked.");
        removeFavorite();
    };

});