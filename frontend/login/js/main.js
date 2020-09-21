(function($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function() {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val().trim() == '') {
            return false;
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
})(jQuery);

'use strict';

const video = document.getElementById('video');
const snap = document.getElementById("snap");
const canvas = document.getElementById('canvas');
const errorMsgElement = document.querySelector('span#errorMsg');

const constraints = {
    audio: true,
    video: {
        width: 800,
        height: 600
    }
};

// Acceso a la webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}
// Correcto!
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}
// Load init
init();
// Dibuja la imagen
var context = canvas.getContext('2d');
snap.addEventListener("click", function() {
    context.drawImage(video, 0, 0, 250, 200);
});

$(function() {

    $('#login1').click(function() {
        var xhr = new XMLHttpRequest();
        var url = "http://semi1-lb-proyecto1-1129256119.us-east-1.elb.amazonaws.com/api/login";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                if (json.status) {
                    location.href = "../home/index.html";
                }
            }
        };
        console.log($('#pass').val())
        if ($('#pass').val() == "" || $('#user').val() == "") {
            return;
        }

        var data = JSON.stringify({ "user": $('#user').val(), "pass": $('#pass').val() });
        console.log(data)
        xhr.send(data);
    });

    $('#login2').click(function() {
        var xhr = new XMLHttpRequest();
        var url = "http://semi1-lb-proyecto1-1129256119.us-east-1.elb.amazonaws.com/api/login";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
                if (json.status) {
                    location.href = "../home/index.html";
                }
            }
        };

        var data = JSON.stringify({ "sourceBase64": canvas.toDataURL() });

        xhr.send(data);
    });
});