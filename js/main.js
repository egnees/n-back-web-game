var counter = 0;

function button_clicked(button) {
    counter++;
    button.innerHTML = "Button pressed " + counter + " times";
    button.style.width = 500;
    button.style.height = 500;
    button.style.background = "red";
    button.style.color = "blue";
    button.style.cssText = "border-radius: 5px; border: 0px; font-size: 30px";
}

function onInput(input) {
    console.log(input.value);
    if (input.value == "hello") {
        alert("hello you too!");
    }
}