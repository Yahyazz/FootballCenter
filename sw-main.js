// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function() {
                console.log("Regristation Service Worker succeed");
            })
            .catch(function() {
                console.log("Regristation Service Worker failed");
            });
        requestPermission();
    });
} else {
    console.log("Service Worker is not supported in this browser");
}

function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(function(result) {
            if (result === "denied") {
                console.log("Notification isn't allowed.");
                return;
            } else if (result === "default") {
                console.error("User close dialog box.");
                return;
            }

            navigator.serviceWorker.ready.then(() => {
                if (("PushManager" in window)) {
                    navigator.serviceWorker.getRegistration().then((reg) => {
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BJG6yZKNsO_o5oYw-YIir59t7KHd-bHZP6HO3t9SAInFj_VmZSMs7DckG-5CK-zscouVehXjExuLF23IbcqNJvc")
                        }).then(function(subs) {
                            var endpointSubs = subs.endpoint
                            var p256dhKey = btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subs.getKey('p256dh'))));
                            var authKey = btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subs.getKey('auth'))));
                            console.log(`Succeed to Subscribe with endpoint ${endpointSubs}`);
                            console.log(`Succeed to Subscribe with p256dh key ${p256dhKey}`);
                            console.log(`Succeed to Subscribe with auth key ${authKey}`);
                        }).catch(function(err) {
                            console.log('Cannot do Subscribe', err.message);
                        })
                    });
                }
            })

        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}