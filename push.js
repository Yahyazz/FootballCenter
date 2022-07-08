var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BJG6yZKNsO_o5oYw-YIir59t7KHd-bHZP6HO3t9SAInFj_VmZSMs7DckG-5CK-zscouVehXjExuLF23IbcqNJvc",
    "privateKey": "mj2GsbLjEA2dHOLy0EDKaL3sVVoqsLAfyTf3JNump0o"
};

webPush.setVapidDetails(
    'mailto:yahyaz.zakaria.4@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/ejqyBd2g9gA:APA91bHKRSdEeLOygBvVStBwaGfJHKmfdR3ixfM9lpKCt810JG3sPA_WgyFWlufnBQN0jBIW9Wp44oqZTszCK-DU_ZESdPRTxyp2b42ThxTcC-1KGr9c-TlH2GukGgeL9B1ltoI7yhq_",
    "keys": {
        "p256dh": "BIlxSAwwbKk1XUQqO+V/edzYidQqz6q0+FuJE1q7RRvKwAzvVDSLi4+tCF4Rvxn6TZv7FJwXzhMwAAPlQJQx548=",
        "auth": "q8TrgRoVC+n5tRQhz6m+rA=="
    }
};

var payload = "Congratulation!! Your app can get push notification.";

var options = {
    gcmAPIKey: '450262557265',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
)