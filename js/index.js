//Create the audio context  
if (! window.AudioContext){
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}
var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;

function setupAudioNodes(){
    //Setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    //Connect our javascript node to the audio context destination
    javascriptNode.connect(context.destination);

    //Setup an analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.6;
    analyser.fftSize = 512;
    //Create a buffer source node
    sourceNode = context.createBufferSource();
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);
}

//Retrieves, loads and plays an audio URL
function loadSound(url){
    $("#loading").show();
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    //When loaded, decode the data and play it
    request.onload = function(){
        $("#loading").hide();

        context.decodeAudioData(request.response, function(buffer){
            playSound(buffer);
        }, onError);
    };
    request.send();
}

//Gotta log those errors
function onError(e){
    console.log(e);
}

var inkBarHeight = 358;
var inkBarSurfaces = undefined;
var inkBarEmpties = undefined;

//Animate our ink bars
function drawSpectrum(barsArray){
    for(var i = 0; i < 5; i++){
        var value = barsArray[i];
        var changeInkShape = (Math.random() * 5) > 3; //Okay-ish chance of ink surface changing shape

        //Lets lie a bit about our audio levels, to make the visualizaton look a bit more crazy
        var newBarTop = inkBarHeight - Math.floor(((value - 140) / 112) * inkBarHeight);

        //Uncomment this to get the original accurate bar levels, no lies.
        var newBarTop = inkBarHeight - Math.floor((value / 256) * inkBarHeight);

        //Change the amount of ink in the tank!
        $(inkBarEmpties).eq(i).css("height", newBarTop + 1);
        $(inkBarSurfaces).eq(i).css("top", newBarTop);
        //Change the shape of our ink surface!
        if(changeInkShape){
            if( $("#toggle_audio").hasClass("pause") ){
                var newPosX = Math.floor(Math.random() * 1158);
                $(inkBarSurfaces).eq(i).css("background-position", "-" + newPosX + "px 0px");
            }
        }
    }
}

var splatoonURL = "https://thepastplayer.github.io/audio.ogg";


//Start doing stuff once the page is loaded!
$(document).ready(function(){
    //Prepare everything that uses the DOM
    inkBarSurfaces = $("#equalizer_container .ink .ink_surface");
    inkBarEmpties = $("#equalizer_container .ink .ink_empty");

    $("#toggle_audio").on("click",function(el){
        if($(el.target).hasClass("pause")){
            sourceNode.disconnect();
        }
        else{
            sourceNode.connect(analyser);
            analyser.connect(javascriptNode);
            sourceNode.connect(context.destination);
        }
        $(el.target).attr("class", $(el.target).hasClass("pause") ? "play":"pause");
    });

    //Init and load the music
    setupAudioNodes();

    //Analyze our sound node, using an analyzer (duh)!
    javascriptNode.onaudioprocess = function(){
        //var barsArray =  new Uint8Array(analyser.frequencyBinCount); //256 equalizer bars by default
        var barsArray =  new Uint8Array(5); //5 equalizer bars
        //Get the channel average
        analyser.getByteFrequencyData(barsArray);
        //Splat the audio spectrum into our ink tanks
        drawSpectrum(barsArray);
    };

    loadSound(splatoonURL);
});

var bufferStarted = false;
//Lay down the beats, looped
function playSound(buffer){
    sourceNode.buffer = buffer;
    sourceNode.loop = true;
    sourceNode.disconnect();

    if(!bufferStarted){
        sourceNode.start(0);
        bufferStarted = true;
    }

    $("#toggle_audio").attr("class", "pause");
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
}