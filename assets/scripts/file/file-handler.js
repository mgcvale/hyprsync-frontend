import { getCookie } from "../cookie-manager.js";
import { imagesLoaded } from "./modal.js";

document.getElementById("image-upload").addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(event.target);
    formData.append("access_token", getCookie("access_token"));
    uploadFiles(formData);
});

function uploadFiles(formData) {
    const url = "http://localhost:5000/files/upload";

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if(!response.ok) {
            alert("erro ao enviar mensagens");
            throw new Error(response.status);
        }
        alert("imagens enviadas com sucesso");
        document.getElementById("image-upload").reset();
        window.location.reload();
        return response.json;
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log("Error: " + error);
    });
}

function getFiles(jsonData) {
    console.log(jsonData);
    const url = "http://localhost:5000/files"

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if(!response.ok)
            throw new Error(response.status)
        return response.json();
    })
    .then(data => {
        console.log(data);
        populateImages(data);
    })
    .catch(error => {
        console.log(error);
    })
}

function populateImages(jsonData) {
    const gallery = document.getElementsByClassName("gallery")[0];
    const files = JSON.parse(jsonData.files);
    files.forEach(file => {
        const li = document.createElement('li');
        const image = document.createElement("img");
        image.src = `data:image/jpeg;base64,${file.image}`;
        image.classList.add('gallery-image');
        image.id = file.name;
        
        image.style.height = '64px';
        li.appendChild(image);
        gallery.appendChild(li);
    });

    imagesLoaded();

}

function getImage(file) {
    console.log(file);
    return;
}

if(getCookie("access_token")) {
    const jsonData = {"access_token": getCookie("access_token")};
    getFiles(jsonData);
}