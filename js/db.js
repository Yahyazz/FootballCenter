const dbPromised = idb.open("football-center", 1, upgradeDb => {
    var articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", { unique: false });
});

const saveForLater = team => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction("teams", `readwrite`);
            tx.objectStore("teams").put(team);
            return tx;
        }).then(tx => {
            if (tx.complete) {
                resolve(true)
                console.log(`Added ${team.name} as Favorite Team.`);
                M.toast({ html: `Added ${team.name} as Favorite Team.` });
            } else {
                reject(new Error(M.toast({ html: `${team.name} Team has been added to Favorite` }), transaction.onerror))
            }
        }).catch(err => {
            M.toast({ html: `${team.name} Team has been added to Favorite` });
        })
    })
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction("teams", `readonly`);
            return tx.objectStore("teams").getAll();
        }).then(teams => {
            if (teams !== undefined) {
                resolve(teams)
            } else {
                reject(new Error("Favorite team not found."))
            }
        })
    })
};

const getById = id => {
    var ID = parseInt(id);
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction("teams", `readonly`);
            return tx.objectStore("teams").get(ID);
        }).then(function(data) {
            resolve(data)
            console.log(data);
        })
    })
};

const deleteFavTeam = id => {
    var ID = parseInt(id);
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction("teams", `readwrite`);
            tx.objectStore("teams").delete(ID);
            return tx;
        }).then(tx => {
            if (tx.complete) {
                resolve(true)
                M.toast({ html: `Remove team with id : ${id} from favorite teams.` })
            } else {
                reject(new Error(tx.onerror))
            }
        })
    })
};