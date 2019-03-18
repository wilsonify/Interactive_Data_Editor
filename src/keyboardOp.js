ipcRenderer.on("rf", function (e, d) {
    fileReader(d);
})


ipcRenderer.on("back", function (e, d) {
    data = d.map(x => transpose(x))
    updatePlot(1);
    startDragBehavior();
    updateOnServer();
})


ipcRenderer.on('checkClose', function (e, d) {
    if (!saved) var res = dialog.showMessageBox({
        type: "warning",
        title: "Unsaved data found!!!",
        message: "There are some modified data, that you haven't saved yet.\n Are you sure to quit without saving?",
        buttons: ['Yes', "No"]
    });
    if (!res) ipcRenderer.send('checkClose', 'closeIt');
})


ipcRenderer.on("menuTrigger", function (e, d) {
    if (show) console.log(e, d);
    switch (d) {
        case "open":
            fileLoader();
            break;
        case "save":
            if(firstSave){
                saveAs()
            }else{
                saveData()
            }
            break;

        case "saveas":
            saveAs();
            break;

        case "wire":
            openViewer(0);
            break;
        case "surface":
            openViewer(1);
            break;
        case "spread":
            editor();
            break;

        case "openc":
            compfileLoader();
            break;

        case "compf":
            incRefData();
            break;

        case "pa":
            isswap();
            break;
        case "pamh":
            lockXc = menu.getMenuItemById("pamh").checked ? 1 : 0;
            break;
        case "fullscreen":
            resizePlot();
            break;

        case 'swapen':
            initSwapper();
            break;

        case 'swapex':
            delSwapper();
            break;

        case "edat":
            $("#extend").slideDown();
            // $("#einp").val(dpsx[dpsx.length-1]);
            break;
        case 'fill':
            $("#filler").slideDown();
            break;
        case 'filter':
            $('#filter').slideDown();
            break;
    }
});



function hotDKeys(e) {
    if (document.activeElement.type == "text") {
        return;
    };
    switch (e.key){
        case 'm':
        case 'ArrowDown':
        case 'ArrowUp':
            ma = 1;
            updateOnServer();
    }
}



function hotKeys(e) {
    if (document.activeElement.type == "text") {
        return;
    };
    switch (e.key) {
        case " ":
            Plotly.relayout(figurecontainer, {
                "xaxis.autorange": true,
                "yaxis.autorange": true
            });
            break;
        case ",":
            if (th_in == 0) break;
            th_in = th_in - 1
            sliderChanged();
            break;
        case ".":
            if (th_in == data.length - 1) break;
            th_in = th_in + 1
            sliderChanged();
            break;
        case "s":
        case "S":
            if (!e.ctrlKey) {
                Plotly.relayout(figurecontainer, {
                    dragmode: "select"
                });
            }
            break;

        case "z":
        case "Z":
            if (e.ctrlKey & !e.shiftKey) {
                unDo();
            } else if (e.ctrlKey & e.shiftKey) {
                reDo();
            }else {
                Plotly.relayout(figurecontainer, {
                    dragmode: "zoom"
                });
            };
            break;
        case "p":
        case "P":
            swapData();
            break;

        case "d":
        case "D":
            deleteInterpolate()
            break;

        case "m":
        case "M":
            autoSmooth();
            break;

        case "c":
        case "C":
            if (e.ctrlKey) {
                copyThis();
            } else {
                changeSign();
            }
            break;
        case 'v':
        case "V":
            if (e.ctrlKey) {
                pasteThis();
            }
            break;
        case 'ArrowDown':
            keyBoardDrag(0);
            break;
        case 'ArrowUp':
            keyBoardDrag(1);
            break
        case 'o':
        case 'O':
            if(!app.isPackaged) sSwapper();
            break
    };
};


$(window).keydown(hotKeys);
$(window).keyup(hotDKeys);