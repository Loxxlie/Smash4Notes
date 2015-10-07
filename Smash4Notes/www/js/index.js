/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var currentID;
var editing;
var ios;
var paused = false;

$(document).ready(function() {
    console.log("DEVICE READY");
    window.addEventListener('native.keyboardshow', function(){
        if(!ios && !paused){
            if(!$('#search').is(":focus")){
                $('#scroll-bar').css("display", "none");
                $('#search-bar').css("display", "none");
            }else if($('#search').is(":focus")){
                $('#search-bar').css("height", "10%");
                $('#scroll-bar').css("height", "25%");
            }
        }
    });
    window.addEventListener('native.keyboardhide', function(){
        if(!ios && !paused){
            $('#scroll-bar').css("display", "block");
            $('#search-bar').css("display", "block");
            $('#search-bar').css("height", "6%");
            $('#scroll-bar').css("height", "14%");
        }
    });
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    $('.iconDiv').bind("tap", iconClicked);
    initialize();
});

function iconClicked () {
    $.jAlert({
        'title': 'About',
        'content': '<center><h2 style="margin: 0px">Smash4Notes</h2><br>' +
        '<span class="about-content"><b><u>Author</u></b><br>Ethan Lie<br>' +
        '<b><u>Website</u></b><br>moogcode.com<br>' +
        '<b><u>Frame Data</u></b><br>Aerodome & kuroganehammer.com<br><br>' +
        'Thanks to NorCal Sm4sh for the support!</span></center>',
        'theme': 'yellow',
        'size': 'sm'
    });
    /*if(!aboutOpen){
        aboutOpen = true;
        $('#about').css("display", "block");
        $('#about-blanket').css("display", "block");
        "Smash4Notes\nAuthor: Ethan Lie\nWebsite: www.moogcode.com\nFrame Data: Aerodome & kuroganehammer.com\nThanks to NorCal Sm4sh for the support!", "About"
    }*/
}

function onPause() {
    paused = true;
}

function onResume() {
    paused = false;
}

var characterlist = [
    'Mario',
    'Luigi',
    'Peach',
    'Bowser',
    'Yoshi',
    'Rosalina & Luma',
    'Bowser Jr.',
    'Wario',
    'Donkey Kong',
    'Diddy Kong',
    'Mr Game & Watch',
    'Little Mac',
    'Link',
    'Zelda',
    'Shiek',
    'Ganondorf',
    'Toon Link',
    'Samus',
    'Zero Suit Samus',
    'Palutena',
    'Marth',
    'Ike',
    'Robin',
    'Duck Hunt',
    'Kirby',
    'King Dedede',
    'Meta Knight',
    'Fox',
    'Falco',
    'Pikachu',
    'Charizard',
    'Lucario',
    'Jigglypuff',
    'Greninja',
    'R.O.B.',
    'Ness',
    'Captain Falcon',
    'Villager',
    'Olimar',
    'Wii Fit Trainer',
    'Shulk',
    'Dr. Mario',
    'Dark Pit',
    'Lucina',
    'Pac-Man',
    'Mega Man',
    'Lucas',
    'Roy',
    'Ryu'
];

function initialize() {
    console.log("Initializing Smash4Notes...");

    var standalone = window.navigator.standalone,
    userAgent = window.navigator.userAgent.toLowerCase(),
    safari = /safari/.test( userAgent );
    ios = /iphone|ipod|ipad/.test( userAgent );
    if(!ios){
        console.log("This is not an iPhone");
        $('#status-bar-spacer').css("display", "none");
    }else{
        console.log("This is an iPhone");
        $('#status-bar-spacer').css("display", "block");
    }

    // Create Notes if first time booting
    for(var i = 0; i < characterlist.length; i++){
        if(localStorage.getItem(truncname(characterlist[i]) + "Box") == null)
            localStorage.setItem(truncname(characterlist[i]) + "Box", characterlist[i] + " notes.");
    }

    // Populate portrait list
    var scrollbar = document.getElementById('scroll-bar');

    for(var i = 0; i < characterlist.length; i++){
        scrollbar.innerHTML +=
            '<input id=\'' + truncname(characterlist[i]) + 'Box\' type=\'button\' onclick=\'pressedPort(this)\' data-role=\'none\'/><label for=\'' + truncname(characterlist[i]) + 'Box\' class=\'portraitINPUT\' id=\'' + truncname(characterlist[i]) + '\'><img class=\'portraitIMG\' src=\'img/Portraits/' + truncname(characterlist[i]) + '.png\' /></label>';
    }

    currentID = "marioBox";
    var textarea = document.getElementById("notes");
    textarea.innerHTML = localStorage.getItem(currentID);

    var backimg = document.getElementById("charBG");
    backimg.setAttribute("src", "img/Background/" + currentID + ".jpg");

}

function searchNotes(){
    var searchfield = truncname(document.getElementById("search").value);
    var portraits = document.getElementsByClassName("portraitINPUT");
    for(var i = 0; i < portraits.length; i++)
    {
        if(portraits[i].id.indexOf(searchfield) != 0){
            portraits[i].setAttribute("style", "display: none;");
        }else{
            portraits[i].setAttribute("style", "display: inline;");
        }
    }
}

function truncname(name) {
    return name.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
}

function editClick(){
    console.log("Pressed the Edit button.");
    var textarea = document.getElementById("notes");
    textarea.readOnly = false;

    var button = document.getElementById("edit");
    button.setAttribute("value", "Save");
    button.setAttribute("onclick", "saveClick()");
    editing = true;
}

function saveContent() {
    var textarea = document.getElementById("notes");
    localStorage[currentID] = textarea.value;
}

function saveClick() {
    console.log("Pressed the Save button.");
    var textarea = document.getElementById("notes");
    textarea.readOnly = true;

    saveContent();

    var button = document.getElementById("edit");
    button.setAttribute("value", "Edit");
    button.setAttribute("onclick", "editClick()");
    editing = false;
}

function pressedPort(el){
    console.log("Pressed a portrait.");

    // Save changes to old notes
    saveContent();
    if(editing){
        var button = document.getElementById("edit");
        button.setAttribute("value", "Edit");
        button.setAttribute("onclick", "editClick()");
        editing = false;
        var textarea = document.getElementById("notes");
        textarea.readOnly = true;
    }

    var backimg = document.getElementById("charBG");
    var selectedID = el.id;
    var textarea = document.getElementById("notes");
    textarea.value = localStorage[selectedID];
    currentID = selectedID;

    backimg.setAttribute("src", "img/Background/" + selectedID + ".jpg");

}

$('#search').autocomplete({
    lookup: characterlist,
    onSelect: function (suggestion){
        console.log("Selected.");
        searchNotes();
    }
});

function clearClick() {
    document.getElementById("search").value = "";
    searchNotes();
}

function framedataClick() {
    window.open('http://kuroganehammer.com/Smash4', '_system');
}

function aboutClick() {
    $('#about-drop-down').css("display", "inline");
    $('#blanket').css("display", "inline");
}

function aboutCloseClick() {
    $('#about-drop-down').css("display", "none");
    $('#blanket').css("display", "none");
}