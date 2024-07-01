const ENDPOINT = "http://localhost:3000/monedas";

function editOne(model) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Actualizado con exito");
            } else {
                console.log("ERR " + xhr.status + " :" + xhr.statusText);
            }
        }
    });

    xhr.open("PUT", `${ENDPOINT}/${model.id}`);
    xhr.setRequestHeader("content-type", "application/json");

    xhr.send(JSON.stringify(model));
}

function deleteOne(id) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Eliminado con exito");
            } else {
                console.log("ERR " + xhr.status + " :" + xhr.statusText);
            }
        }
    });

    xhr.open("DELETE", `${ENDPOINT}/${id}`);
    xhr.send();
}

async function getAllFetch() {
    const options = {
        method: "GET",
        headers: { "content-type": "application/json" },
    };

    let res = await fetch(`${ENDPOINT}`, options);
    res = await res.json();
    return res;
}

async function getOneFetch(id) {
    const options = {
        method: "GET",
        headers: { "content-type": "application/json" },
    };

    let res = await fetch(`${ENDPOINT}/${id}`, options);
    res = await res.json();
    return res;
}

async function addOneFetch(model) {
    const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(model),
    };

    let res = await fetch(`${ENDPOINT}`, options);
    res = await res.json();
    return res;
}

export {
    editOne,
    deleteOne,
    getAllFetch,
    getOneFetch,
    addOneFetch,
};