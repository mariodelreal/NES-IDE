/* 
PROGRAM LOCKS IF SPRITE OR BACKGROUND LABEL IS PRESSED TWICE

REMOVE REDUNDANT CODE IN CHANGING SPRITE/BACKGROUND EDITOR SINCE SELECTABLE LISTENER NOW SETS THE SPRITEPALETTE AND BACKGROUNDPALETTE

done - CHANGING OF UNIVERSAL COLOR NEEDS TO AFFECT BOTH SPRITES AND BACKGROUND TILE EDITOR

Shift tile editor down so tile-tools wont run into palette editor

Change tools color to always stand out against background color

Already okay - but maybe look into hiding tools and selectedTile = null when the user changes colors in a palette instead of checking everything

Make switching from background editor to sprite editor and vice verse faster by only calling getCells() once and optimizing any other points
*/

var currentEditorOpen = "sprite";

var paletteTable = document.getElementById("palette-table");

var activeColorToChange = null;

var selectedTile = null;

var tileEditor = document.getElementById("tile-editor");

var tools = document.getElementById("tile-tools");
var currentPalette = document.getElementById("current-palette");

var currentColor = document.getElementById("current-brush-color");
var colorOption0 = document.getElementById("current-brush-color-option0")
var colorOption1 = document.getElementById("current-brush-color-option1")
var colorOption2 = document.getElementById("current-brush-color-option2")
var colorOption3 = document.getElementById("current-brush-color-option3")

var maximizeTile = document.getElementById("maximize-tile");
var hideTile = document.getElementById("hide-tile");

//create a map with the hex addresses as keys to the rgb values
var selectables = document.getElementsByClassName("selectable");
var colorMap = {};
for (var i = 0; i < selectables.length; i++){
    colorMap[selectables[i].dataset.nes] = selectables[i].style.backgroundColor;
}

//init the four palettes' colors
var paletteColors = document.getElementsByClassName("palette-color");
for (var i = 0; i < paletteColors.length; i++){
    paletteColors[i].style.backgroundColor = colorMap[paletteColors[i].dataset.nes];
}
//init the universal color's color
currentColor.style.backgroundColor = document.getElementById("universal-color0").style.backgroundColor;

//init the current palette's color
colorOption0.style.backgroundColor = colorMap[colorOption0.dataset.nes];
colorOption1.style.backgroundColor = colorMap[colorOption1.dataset.nes];
colorOption2.style.backgroundColor = colorMap[colorOption2.dataset.nes];
colorOption3.style.backgroundColor = colorMap[colorOption3.dataset.nes];

//generate the tiles
for (let i = 0; i < 16; i++){
    var newRow = document.createElement("div");
    newRow.className = "rowOfTiles";
    for (let j = 0; j < 16; j++){
        appendTile(newRow, i * 16 + j);
    }
    tileEditor.appendChild(newRow);
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////HELPER FUNCTIONS//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function appendTile(row, tileNum){
    var newTile = document.createElement("div");
    newTile.addEventListener("click", function(){
        showTileTools(this);
    });
    newTile.id = "tile-num-" + tileNum;
    newTile.className = "tile";
    newTile.dataset.palette = "P1"; //default
    for (let i = 0; i < 8; i++){
        var newCellRow = document.createElement("div");
        newCellRow.className = "rowOfCells";
        for (let j = 0; j < 8; j++){
            var newCell = document.createElement("div");
            newCell.className = "tile-cell"
            newCell.dataset.color = "0";
            newCell.dataset.num = i * 8 + j;
            newCell.id = "tile-num-" + tileNum + "-cell-" + i * 8 + j;
            newCell.style.backgroundColor = colorMap[document.getElementById("universal-color0").dataset.nes];
            newCell.addEventListener("click", function(){
                drawPixel(this);
            })
            newCellRow.appendChild(newCell);
        }
        newTile.appendChild(newCellRow)
    }
    row.appendChild(newTile);
}

function getCells(tile){
    var listOfCells = [];

    var rows = tile.children;
    for (var i = 0; i < rows.length; i++){
        var cells = rows[i].children;
        for (var j = 0; j < cells.length; j++){
            listOfCells.push(cells[j]);
        }
    }
    
    return listOfCells;
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////LISTENERS////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
function showTileTools(evt){
    if (selectedTile !== evt){
        selectedTile = evt;
    
        currentPalette.innerHTML = selectedTile.dataset.palette;

        tools.className = "tile-tools-visible";

        var pos = selectedTile.getBoundingClientRect();
        tools.style.left = pos.left + "px";
        tools.style.top = pos.top - tools.offsetHeight + window.pageYOffset + "px";

        //load the right palette label and available colors
        currentPalette.innerHTML = selectedTile.dataset.palette;
        currentColor.style.backgroundColor = document.getElementById("universal-color0").style.backgroundColor;
        colorOption0.style.backgroundColor = document.getElementById("universal-color0").style.backgroundColor;
        colorOption1.style.backgroundColor = document.getElementById(selectedTile.dataset.palette + "-color1").style.backgroundColor
        colorOption2.style.backgroundColor = document.getElementById(selectedTile.dataset.palette + "-color2").style.backgroundColor;
        colorOption3.style.backgroundColor = document.getElementById(selectedTile.dataset.palette + "-color3").style.backgroundColor;
    }
    //shouldnt need to be done
    // while (selectedTile.className !== "tile"){
    //     selectedTile = selectedTile.parentNode;
    // }
}

function changePalette(evt){
    //hide current tools
    currentPalette.className = currentPalette.className.replace("tile-tool-visible", "tile-tool-hidden");
    currentColor.className = currentColor.className.replace("tile-tool-visible", "tile-tool-hidden");
    maximizeTile.className = maximizeTile.className.replace("tile-tool-visible", "tile-tool-hidden");
    hideTile.className = hideTile.className.replace("tile-tool-visible", "tile-tool-hidden");

    //show new options in place of the tools
    var options = document.getElementsByClassName("current-palette-option");
    for (var i = 0; i < options.length; i++){
        options[i].className = options[i].className.replace("tile-tool-hidden", "tile-tool-visible");
    }
}

//MAKE SURE CHANGING PALETTE CHANGES ALL COLORS IN THE SELECTED TILE
function setPalette(evt){
    //update the sprite/backgroundTilePalettes list
    var index = selectedTile.id.split("tile-num-")[1];
    var num = parseInt(evt.innerHTML[1] - 1);

    if (currentEditorOpen === "sprite"){
        spriteTilePalettes = spriteTilePalettes.substr(0, index) + ('' + num) + spriteTilePalettes.substr(index + 1);
    }
    else if (currentEditorOpen === "background"){
        backgroundTilePalettes = backgroundTilePalettes.substr(0, index) + ('' + num) + backgroundTilePalettes.substr(index + 1);
    }

    //set current palette to new choice
    currentPalette.innerHTML = evt.innerHTML;

    //update the default palette for the tile
    selectedTile.dataset.palette = evt.innerHTML;

    //reset currentColor to 0
    currentColor.dataset.current = "0";

    //make changes to possible colors
    colorOption0.style.backgroundColor = document.getElementById("universal-color0").style.backgroundColor;
    colorOption1.style.backgroundColor = document.getElementById(currentPalette.innerHTML + "-color1").style.backgroundColor;
    colorOption2.style.backgroundColor = document.getElementById(currentPalette.innerHTML + "-color2").style.backgroundColor;
    colorOption3.style.backgroundColor = document.getElementById(currentPalette.innerHTML + "-color3").style.backgroundColor;

    //make changes to the cells' background color
    var cells = getCells(selectedTile);
    for (var i = 0; i < cells.length; i++){
        //only the cells' cbackground color will change - dataset color will stay the same
        var color = cells[i].dataset.color;
        if (color === '0'){
            cells[i].style.backgroundColor = document.getElementById('universal-color0').style.backgroundColor;
        }
        else{
            var paletteId = currentPalette.innerHTML + '-color' + color;
            cells[i].style.backgroundColor = document.getElementById(paletteId).style.backgroundColor;
        }
    }

    //hide options
    var options = document.getElementsByClassName("current-palette-option");
    for (var i = 0; i < options.length; i++){
        options[i].className = options[i].className.replace("tile-tool-visible", "tile-tool-hidden");
    }

    //restore the tools
    currentPalette.className = currentPalette.className.replace("tile-tool-hidden", "tile-tool-visible");
    currentColor.className = currentColor.className.replace("tile-tool-hidden", "tile-tool-visible");
    maximizeTile.className = maximizeTile.className.replace("tile-tool-hidden", "tile-tool-visible");
    hideTile.className = hideTile.className.replace("tile-tool-hidden", "tile-tool-visible");

    //set the current color to the universal color after swapping palettes
    currentColor.style.backgroundColor = colorOption0.style.backgroundColor;
}

function changeBrushColor(evt){
    currentPalette.className = currentPalette.className.replace("tile-tool-visible", "tile-tool-hidden");
    currentColor.className = currentColor.className.replace("tile-tool-visible", "tile-tool-hidden");
    maximizeTile.className = maximizeTile.className.replace("tile-tool-visible", "tile-tool-hidden");
    hideTile.className = hideTile.className.replace("tile-tool-visible", "tile-tool-hidden");

    //show new options in place of the tools
    var options = document.getElementsByClassName("current-brush-color-option");
    for (var i = 0; i < options.length; i++){
        options[i].className = options[i].className.replace("tile-tool-hidden", "tile-tool-visible");
    }
}

function setBrushColor(evt){
    //set current palette to new choice
    currentColor.style.backgroundColor = evt.style.backgroundColor;
    var colorIndex = evt.id[evt.id.length - 1];
    currentColor.dataset.current = colorIndex;

    //hide options
    var options = document.getElementsByClassName("current-brush-color-option");
    for (var i = 0; i < options.length; i++){
        options[i].className = options[i].className.replace("tile-tool-visible", "tile-tool-hidden");
    }

    //restore the tools
    currentPalette.className = currentPalette.className.replace("tile-tool-hidden", "tile-tool-visible");
    currentColor.className = currentColor.className.replace("tile-tool-hidden", "tile-tool-visible");
    maximizeTile.className = maximizeTile.className.replace("tile-tool-hidden", "tile-tool-visible");
    hideTile.className = hideTile.className.replace("tile-tool-hidden", "tile-tool-visible");
}

function drawPixel(evt){
    //only draw a pixel if the user has made the parent tile selected
    if (evt.parentNode.parentNode === selectedTile){ 
        //make the change happen with the data stored in spriteTiles and backgroundTiles
        var tileIndex = parseInt(selectedTile.id.split("tile-num-")[1]);
        var cellIndex = parseInt(evt.dataset.num);
        if (currentEditorOpen === "sprite"){
            spriteTiles[tileIndex][cellIndex] = currentColor.dataset.current;
        }
        else if (currentEditorOpen === "background"){
            backgroundTiles[tileIndex][cellIndex] = currentColor.dataset.current;
        }
        evt.dataset.color = currentColor.dataset.current;
        evt.style.backgroundColor = currentColor.style.backgroundColor;
    }
}

function paletteColorListener(evt){
    //make visible all the colors the user can set a palette color to
    paletteTable.style.visibility = "visible";
    //set the activeColorToChange so when the user clicks a color from the color table, its color can be reflected onto the palette color the user originally clicked
    activeColorToChange = evt;
}

function selectableListener(evt){
    var newColor = window.getComputedStyle(evt, null).getPropertyValue("background-color");
    activeColorToChange.style.backgroundColor = newColor;
    paletteTable.style.visibility = "hidden"; 
    activeColorToChange.dataset.nes = evt.dataset.nes;

    var paletteToChange = activeColorToChange.id.split("-")[0];
    var colorToChange = activeColorToChange.id[activeColorToChange.id.length - 1];

    //get index of palette into the sprite/backgroundTilePalettes list
    if (currentEditorOpen === "sprite"){
        var index = 0; //handles universal color

        //make sure changing the universal color affects both sprites and backgrounds
        if (activeColorToChange.id === "universal-color0"){
            backgroundPalette[index] = evt.dataset.nes;
        }

        //get index for the sprite palette list
        else if (activeColorToChange.id !== "universal-color0"){
            //parse out # in P# and base indices off 0 and add 1 to final result to skip over universal color
            index = (parseInt(paletteToChange[1]) - 1) * 3 + (parseInt(colorToChange) - 1) + 1;
        }

        //set the change into the spriteTilePalettes list
        spritePalette[index] = evt.dataset.nes;
    }
    else if (currentEditorOpen === "background"){
        var index = 0; //handles universal color

        //make sure changing the universal color affects both sprites and backgrounds
        if (activeColorToChange.id === "universal-color0"){
            spritePalette[index] = evt.dataset.nes;
        }

        //get index for the background palette list
        else if (activeColorToChange.id !== "universal-color0"){
            //parse out # in P# and base indices off 0 and add 1 to final result to skip over universal color
            index = (parseInt(paletteToChange[1]) - 1) * 3 + (parseInt(colorToChange) - 1) + 1;
        }

        //set the change into the backgroundTilePalettes list
        backgroundPalette[index] = evt.dataset.nes;
    }
    
    //determine if the universal color was changed or not
    if (paletteToChange === "universal"){
        //change all the existing tiles with set colors to match the new palette
        var tilesArray = document.getElementsByClassName("tile");
        for (var i = 0; i < tilesArray.length; i++){
            var cells = getCells(tilesArray[i]);
            for (var j = 0; j < cells.length; j++){
                if (cells[j].dataset.color === colorToChange){
                    cells[j].style.backgroundColor = newColor;
                }
            }
        }
    }
    else{
        //change all the existing tiles with set colors to match the new palette
        var tilesArray = document.getElementsByClassName("tile");
        for (var i = 0; i < tilesArray.length; i++){
            //the palette of the tile matches the palette that was changed - carry out the changes to the cells
            if (tilesArray[i].dataset.palette === paletteToChange){
                var cells = getCells(tilesArray[i]);
                for (var j = 0; j < cells.length; j++){
                    if (cells[j].dataset.color === colorToChange){
                        cells[j].style.backgroundColor = newColor;
                    }
                }
            }
        }
    }
    
    //change colorOption1 if universal color was changed
    if (activeColorToChange.id === "universal-color0"){
        colorOption0.style.backgroundColor = newColor;
        //change currentColor if it was set to the universal color at the time of changing
        if (currentColor.dataset.current === "0"){
            currentColor.style.backgroundColor = newColor;
        }
    }

    //change the tools available colors if the currentPalette matches the palette that was just changed ---
    //the id will only have a numeric ending character if it is not the universal color    
    if (currentPalette.innerHTML === paletteToChange){
        switch (colorToChange){
            case "1":
                colorOption1.style.backgroundColor = newColor;
                break;
            case "2":
                colorOption2.style.backgroundColor = newColor;
                break;
            case "3":
                colorOption3.style.backgroundColor = newColor;
                break;
        }

        //change the current color if it was changed in the palette editor
        if (currentColor.dataset.current === colorToChange){
            currentColor.style.backgroundColor = newColor;
        }
    }
}

function showSpriteEditor(evt){
    evt.className = "active-editor-on";
    document.getElementById("background-editor-label").className = "active-editor-off";

    currentEditorOpen = "sprite";

    var paletteColors = document.getElementsByClassName('palette-color');

    //save background palette color changes that may have occured
    for (var i = 0; i < paletteColors.length; i++){
        backgroundPalette[i] = paletteColors[i].dataset.nes;
    }

    //set palette colors
    for (var i = 0; i < paletteColors.length; i++){
        paletteColors[i].dataset.nes = spritePalette[i];
        paletteColors[i].style.backgroundColor = colorMap[spritePalette[i]];
    }

    //force hide the tile tools and set the selected tile to nothing - make sure user triggers the refresh of the current/available palettes after the switch
    tools.className = 'tile-tools-hidden';
    selectedTile = null;


    //save tile modifications & set sprite tiles
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++){
        //save current palette state for current tile
        var currentPaletteValue = ((parseInt(tiles[i].dataset.palette[1]) - 1) + ''); //index at 1 to avoid P prefix and get just the number
        backgroundTilePalettes = backgroundTilePalettes.substr(0, i) + currentPaletteValue + backgroundTilePalettes.substr(i + 1);

        //save background tile changes that may have occured
        var cells = getCells(tiles[i]);
        var currentBackgroundTile = backgroundTiles[i];
        for (var j = 0; j < cells.length; j++){
            currentBackgroundTile[j] = cells[j].dataset.color;
        }

///////////////////////////////////////////////////////code to go from background -> sprite editor
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
}

function showBackgroundEditor(evt){
    evt.className = "active-editor-on";
    document.getElementById("sprite-editor-label").className = "active-editor-off";

    currentEditorOpen = "background";

    var paletteColors = document.getElementsByClassName('palette-color');

    //save sprite palette color changes that may have occured
    for (var i = 0; i < paletteColors.length; i++){
        spritePalette[i] = paletteColors[i].dataset.nes;
    }

    //set palette colors
    for (var i = 0; i < paletteColors.length; i++){
        paletteColors[i].dataset.nes = backgroundPalette[i];
        paletteColors[i].style.backgroundColor = colorMap[backgroundPalette[i]];
    }

    //force hide the tile tools and set the selected tile to nothing - make sure user triggers the refresh of the current/available palettes after the switch
    tools.className = 'tile-tools-hidden';
    selectedTile = null;


    //save tile modifications & set background tiles
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++){
        //save current palette state for current tile
        var currentPaletteValue = ((parseInt(tiles[i].dataset.palette[1]) - 1) + ''); //index at 1 to avoid P prefix and get just the number
        spriteTilePalettes = spriteTilePalettes.substr(0, i) + currentPaletteValue + spriteTilePalettes.substr(i + 1);

        //save sprite tile changes that may have occured
        var cells = getCells(tiles[i]);
        var currentSpriteTile = spriteTiles[i];
        for (var j = 0; j < cells.length; j++){
            currentSpriteTile[j] = cells[j].dataset.color;
        }

///////////////////////////////////////////////////////code to go from sprite -> background editor
        //determine and set palette for current tile
        if (backgroundTilePalettes[i] === '0'){
            tiles[i].dataset.palette = 'P1';
        }
        else if (backgroundTilePalettes[i] === '1'){
            tiles[i].dataset.palette = 'P2';
        }
        else if (backgroundTilePalettes[i] === '2'){
            tiles[i].dataset.palette = 'P3';
        }
        else if (backgroundTilePalettes[i] === '3'){
            tiles[i].dataset.palette = 'P4';
        }

        var cellsForCurrentTile = getCells(tiles[i]);
        var cellColorsForCurrentTile = backgroundTiles[i];

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
}


