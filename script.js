function readText(id) {
    let text = document.getElementById(id).innerText;
    let speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function submitForm(formId, outputId) {
    document.getElementById(formId).style.display = "none";
    document.getElementById(outputId).style.display = "block";
}
