var backgroundPalette = null;
var spritePalette = null;
var spriteTiles = null;
var backgroundTiles = null;
var spriteTilePalettes = null;
var backgroundTilePalettes = null;
var code = null;

window.onload = () => {
    //clear out the current project data on the server
    fetch('/',{method: "POST"}).then((response) => {
        return response.json();
    }).then(data => {
        console.log(data.projectstatus);
    });

    let openProjectWidget = document.getElementById('open-project-widget');
    let fileOption = document.getElementById('file-option');
    let fileDropdown = document.getElementById('file-dropdown');
    let fileDropdownList = document.getElementById('file-dropdown-list');

    fileDropdown.style.display = 'none';

    openProjectWidget.addEventListener('change', (event) => {
        var file = event.target.files[0];
        if (file){
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                alert(file.name);
            };
        }
        reader.readAsText(file);
    });
    fileOption.addEventListener('click', () => {
        if (fileDropdown.style.display === 'none'){
            fileDropdown.style.display = 'inline-block';
        }
        else if (fileDropdown.style.display === 'inline-block'){
            fileDropdown.style.display = 'none';
        }
    });
}


function showNewProjectModal(){
    document.getElementById("new-project-modal").className = "modal-visiible new-project-modal";
}

function showOpenProjectModal(){
    document.getElementById("open-project-modal").className = "modal-visible open-project-modal";
}

function sendCloseProjectRequest(){
    const url="/closeproject";
}

function sendNewProjectRequest(){
    const url="/newproject";
    const requestedName = document.getElementById("new-project-modal-text").value;
    const params = JSON.stringify({name: requestedName});
    fetch(url,{method: "POST", headers: {'Content-Type': 'application/json'}, body: params}).then((response) => {
        return response.json();
    }).then(data => {
        backgroundPalette = data.backgroundPalette;
        spritePalette = data.spritePalette;
        spriteTiles = data.sprites;
        spriteTilePalettes = data.sprPalPairs;
        backgroundTiles = data.backgrounds;
        backgroundTilePalettes = data.bkgPalPairs;
        code = data.code;

        //set the palette colors to the sprite's because the tile editor starts off on sprites
        var paletteColors = document.getElementsByClassName('palette-color');
        for (var i = 0; i < paletteColors.length; i++){
            paletteColors[i].dataset.nes = spritePalette[i];
            paletteColors[i].style.backgroundColor = colorMap[spritePalette[i]];
        }

        //set the tiles (and palette) to the sprite's because the tile editor starts off on sprites
        var tiles = document.getElementsByClassName('tile');
        for (var i = 0; i < tiles.length; i++){
            //determine and set palette for current tile
            if (spriteTilePalettes[i] === '0'){
                tiles[i].dataset.palette = 'P1';
            }
            else if (spriteTilePalettes[i] === '1'){
                tiles[i].dataset.palette = 'P2';
            }
            else if (spriteTilePalettes[i] === '2'){
                tiles[i].dataset.palette = 'P3';
            }
            else if (spriteTilePalettes[i] === '3'){
                tiles[i].dataset.palette = 'P4';
            }

            var cellsForCurrentTile = getCells(tiles[i]);
            var cellColorsForCurrentTile = spriteTiles[i];

            for (var j = 0; j < cellsForCurrentTile.length; j++){
                //get the id for the palette color that needs to be applied to the current cell
                var paletteId = '';
                if (cellColorsForCurrentTile[j] === '0'){
                    paletteId = 'universal-color0';
                }
                else{
                    paletteId = tiles[i].dataset.palette + '-color' + cellColorsForCurrentTile[j];
                }

                //set the data-color attribute - logial
                cellsForCurrentTile[j].dataset.color = cellColorsForCurrentTile[j];

                //set the background color for the cell - physical
                cellsForCurrentTile[j].style.backgroundColor = colorMap[document.getElementById(paletteId).dataset.nes];
            }
        }

        //set the code
        document.getElementById("code-textarea").value = code;

        document.getElementById("project-editor-container").className = "project-editor-container-visible";
    }).catch(err => {

    });

    document.getElementById("new-project-modal").className = "modal-hidden new-project-modal";
}

function sendOpenProjectRequest(){
    const url="/openproject";
    const requestedName = document.getElementById("open-project-modal-text").value;
    const params = JSON.stringify({name: requestedName});
    fetch(url,{method: "POST", headers: {'Content-Type': 'application/json'}, body: params}).then((response) => {
        return response.json();
    }).then(data => {
        backgroundPalette = data.backgroundPalette;
        spritePalette = data.spritePalette;
        spriteTiles = data.sprites;
        spriteTilePalettes = data.sprPalPairs;
        backgroundTiles = data.backgrounds;
        backgroundTilePalettes = data.bkgPalPairs;
        code = data.code;

        //set the palette colors to the sprite's because the tile editor starts off on sprites
        var paletteColors = document.getElementsByClassName('palette-color');
        for (var i = 0; i < paletteColors.length; i++){
            paletteColors[i].dataset.nes = spritePalette[i];
            paletteColors[i].style.backgroundColor = colorMap[spritePalette[i]];
        }

        //set the tiles (and palette) to the sprite's because the tile editor starts off on sprites
        var tiles = document.getElementsByClassName('tile');
        for (var i = 0; i < tiles.length; i++){
            //determine and set palette for current tile
            if (spriteTilePalettes[i] === '0'){
                tiles[i].dataset.palette = 'P1';
            }
            else if (spriteTilePalettes[i] === '1'){
                tiles[i].dataset.palette = 'P2';
            }
            else if (spriteTilePalettes[i] === '2'){
                tiles[i].dataset.palette = 'P3';
            }
            else if (spriteTilePalettes[i] === '3'){
                tiles[i].dataset.palette = 'P4';
            }

            var cellsForCurrentTile = getCells(tiles[i]);
            var cellColorsForCurrentTile = spriteTiles[i];

            for (var j = 0; j < cellsForCurrentTile.length; j++){
                //get the id for the palette color that needs to be applied to the current cell
                var paletteId = '';
                if (cellColorsForCurrentTile[j] === '0'){
                    paletteId = 'universal-color0';
                }
                else{
                    paletteId = tiles[i].dataset.palette + '-color' + cellColorsForCurrentTile[j];
                }

                //set the data-color attribute - logial
                cellsForCurrentTile[j].dataset.color = cellColorsForCurrentTile[j];

                //set the background color for the cell - physical
                cellsForCurrentTile[j].style.backgroundColor = colorMap[document.getElementById(paletteId).dataset.nes];
            }
        }

        //set the code
        document.getElementById("code-textarea").value = code;

        document.getElementById("project-editor-container").className = "project-editor-container-visible";
    }).catch(err => {

    });

    document.getElementById("open-project-modal").className = "modal-hidden new-project-modal";   
}

function sendSaveProjectRequest(){
    //update the latest code to send back to the server
    code = document.getElementById('code-textarea').value;

    const url="/saveproject";
    const savedata = {spritePalette: spritePalette, backgroundPalette: backgroundPalette, code: code, sprites: spriteTiles, backgrounds: backgroundTiles, sprPalPairs: spriteTilePalettes, bkgPalPairs: backgroundTilePalettes};
    const saveParams = JSON.stringify({savedata: savedata});

    //send data to save to server
    fetch(url,{method: "POST", headers: {'Content-Type': 'application/json'}, body: saveParams}).then((response) => {
        //wait for response and return the json
        return response.json();
    }).then(data => {
        if (data.savedataresponse === "A project must be opened first"){
            console.log(data.savedataresponse);
        }
        else{
            //if the data stored locally matches the data sent from the server, then send the confirmation
            if (JSON.stringify(data.savedataresponse) === JSON.stringify(savedata)){
                var confirmParams = JSON.stringify({confirmation: "good"});
                fetch(url,{method: "POST", headers: {'Content-Type': 'application/json'}, body: confirmParams}).then((response) => {
                    return response.json();
                }).then(data => {
                    if (data.confirmationresponse === "saved"){
                        console.log("confirmed good data saved");
                    }
                    else if (data.confirmationresponse === "unsaved"){
                        console.log("confirmed good data not saved");
                    }
                    else{
                        console.log("confirmed good data but unknown server response received on confirmationresponse");
                    }
                }).catch(err => {

                });
            }
            else{
                console.log("save failed")
                var confirmParams = JSON.stringify({confirmation: "bad"});
                fetch(url,{method: "POST", headers: {'Content-Type': 'application/json'}, body: confirmParams}).then((response) => {
                    return response.json();
                }).then(data => {
                    if (data.confirmationresponse === "unsaved"){
                        console.log("confirmed bad data not saved");
                    }
                    else{
                        console.log("confirmed bad data but unknown server response received on confirmationresponse");
                    }
                }).catch(err => {

                });
            }
        }  
    }).catch(err => {

    });
}

function sendRunProjectRequest(){
    const url = '/runproject';
    
    fetch(url, {method: "POST"}).then((response) => {
        return response.json();
    }).then(data => {
        console.log(data.response);
    });
}