/*
######################################################################### 
# Copyright (C) 2007, 2008, 2009 
# Alex Clemesha <alex@clemesha.org> & Dorian Raymer <deldotdr@gmail.com>
# 
# This module is part of codenode, and is distributed under the terms 
# of the BSD License:  http://www.opensource.org/licenses/bsd-license.php
#########################################################################
    Spawner.js - methods for that thing that makes a new cell in the notebook.
*/


Notebook.Spawner = function() {
}; 


/** setFocus - for cell spawners */
Notebook.Spawner.prototype.setFocus = function() {
    this.firstChild.focus(); // the INPUT
    $('#auxdisplay').html('spawner');
};

/** beBlured - for cell spawners */
Notebook.Spawner.prototype.beBlured = function() {
};

/** focusUp - more general than focus previousSibling? */
Notebook.Spawner.prototype.focusUp = function() {
    this.parentNode.setFocus();
};

/** Change focus to nextSibling cell (or spawner) */
Notebook.Spawner.prototype.focusDown = function() {
    this.parentNode.focusNextCell();
};

/** parentCell !-this might be unused now! *
Notebook.Spawner.prototype.parentCell = function() {
    if ( this.parentNode.id == 'notebook') {
        return $j('#notebook')[0];
    } else {
        return getFirstParentByTagAndClassName($(this.id),'div','cell');
    }
};
*
Notebook.Spawner.SpawnPrompt = function(pos) {
    //var b = MochiKit.Base;
    b.bindMethods(this);
    this.pos = pos;
};
*

Notebook.Spawner.SpawnPrompt.prototype = {
    beBlured: function() {
        //this.blur();
    },
    focusUp: function() {
        $j('#'+this.cellid)[0].setFocus();
    },
    focusDown: function() {
        $j('#'+this.cellid)[0].focusNextCell();
    }
};
*/



