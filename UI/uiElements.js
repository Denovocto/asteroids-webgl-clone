// TODO: Update to dictionary
function button()
{
    var button = document.getElementById("button");
    button.addEventListener("click", function () {
    direction = direction == rotation_direction.LEFT? rotation_direction.RIGHT : rotation_direction.LEFT;
});
}

// TODO: Update to dictionary
function slider()
{
    var slider = document.getElementById("slider");
    slider.addEventListener("change", function () {
        speed = parseFloat(this.value);
    });
}

/**
 * creates a select menu in an html file in an element with id 'container'
 * @param  {string} name is the name of the select menu to be created.
 * @param  {string} id is the id that the select menu will receive.
 * @param  {Object} menu_options is an dictionary object which contains the text of the select option as a key and the function to be perform when selected as values.
 * @return {None}
 */
function dropDown(name, id, menu_options)
{
    var dropDown = document.createElement("select");
    var count = 0;
    dropDown.name = name;
    dropDown.id = id;
    for(option in menu_options){
        var newOpt = document.createElement("option");
        newOpt.value = count;
        newOpt.text = option;
        dropDown.appendChild(newOpt);
        count++;
    }
    document.getElementById("container").appendChild(dropDown);
    var listenerDrop = document.getElementById(id);
    listenerDrop.addEventListener("change", function () {
        for(option in menu_options){
            var opt = listenerDrop.selectedOptions[0].innerText;
            if(opt == option){
                menu_options[option]();
                break;
            }
        }
    });
}

/**
 * assigns the events to happen once certain keys are pressed
 * @param  {Object} key_events is a dictionary in which the keys to be presses are the keys all in lowercase, and the values are the functions to be performed once pressed.
 * @return {None}
 */
function keys(keysPressed = {})
{
    document.onkeydown = function (e) {
        if(e.key != undefined){
            keysPressed[e.key.toLowerCase()] = true;
        }
    };
    document.onkeyup = function (e) {
        if(e.key != undefined){
            keysPressed[e.key.toLowerCase()] = false;
        }
    };
}
/**
 * writes a new line in an html element with id 'container' 
 * @param  {string} id is the id that the paragraph element will receive, if called twice with the same id, it will be overwritten.
 * @param  {string} message is the message that the paragraph element will receive.
 * @param  {Number} value is a float number of which only a precision of 1 decimal places are to be considered.
 * @return {None}
 */
function write(id, message, value = null){
    var text = document.createElement("p");
    text.id = id;
    if(value != null){
        text.innerHTML = `${message}: ${value.toFixed(1)}\n`;
    }
    else{
        text.innerHTML = `${message}\n`;
    }
    try {
        document.getElementById("container").replaceChild(text, document.getElementById(id));
    } catch {
        document.getElementById("container").appendChild(text);
    }
    
}