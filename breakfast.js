document.getElementById("close-button").addEventListener("click", function (event) {
    event.preventDefault();
    window.close();
});

document.getElementById("back-button").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "popup.html";
});