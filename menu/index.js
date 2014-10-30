module.exports = function (gui) {
    var menu = new gui.Menu({ type: 'menubar' })
    ,   win = gui.Window.get()


    menu.append(new gui.MenuItem({
        label : '' // placeholder
    }))

    menu.append(new gui.MenuItem({
        label : 'File',
        submenu : new gui.Menu()
    }))

    menu.items[1].submenu.append(new gui.MenuItem({
        label : 'Debug',
        click : function () {
            win.showDevTools()
        }
    }))

    menu.items[1].submenu.append(new gui.MenuItem({
        type : 'separator'
    }))

    menu.items[1].submenu.append(new gui.MenuItem({
        label : 'Quit',
        click : function () {
            win.close()
        }
    }))

    win.menu = menu
}