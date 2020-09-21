function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null;
    };
    img.src = url;
}

$(function() {
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate: '<div class="title">#title#</div>',
        labels: {
            previous: 'Back Step',
            next: 'Next Step',
            finish: 'Submit',
            current: ''
        },
    });
    $("#date").datepicker({
        dateFormat: "MM - DD - yy",
        showOn: "both",
        buttonText: '<i class="zmdi zmdi-chevron-down"></i>',
    });

    $('#guardar').click(function() {
        var xhr = new XMLHttpRequest();
        var url = "https://t8gc9ume1m.execute-api.us-east-2.amazonaws.com/test3/carga";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
            }
        };
        if ($('#user').val() == "") {

            return;
        }
        var data = JSON.stringify({ "id": $('#user').val(), "imagen": sourcebase64.split(",")[1] });
        xhr.send(data);

        var xhr2 = new XMLHttpRequest();
        var url2 = "https://ypmaohrq61.execute-api.us-east-1.amazonaws.com/test/asistencia";
        xhr2.open("POST", url2, true);
        xhr2.setRequestHeader("Content-Type", "application/json");
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                var json = JSON.parse(xhr2.responseText);
                console.log(json);
            }
        };

        var data2 = JSON.stringify({ "grupo": { "id": $('#user').val(), "imagen": sourcebase64, "ruta": "https://pro1-images-grupo21.s3.amazonaws.com/grupos/" + $('#user').val() + ".jpg" }, "estudiantes": estudiantes });

        xhr2.send(data2);
    });

    $('#guardarEstudiantes').click(function() {
        var xhr = new XMLHttpRequest();
        var url = "http://semi1-lb-proyecto1-1129256119.us-east-1.elb.amazonaws.com/api/registerStudent";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
            }
        };

        if ($('#user2').val() == "") {
            return;
        }

        var data = JSON.stringify({ "user": $('#user2').val(), "extension": "jpg", "sourceBase64": sourcebase64 });
        xhr.send(data);
    });

    $('#back').click(function() {
        location.href = "../login/index.html";
    });

});
var estudiantes = []
var sourcebase64
var ruta

function mostrar() {
    var archivo = document.getElementById("file").files[0];
    ruta = archivo
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function() {
            sourcebase64 = reader.result;
            document.getElementById("img").src = reader.result;
        }
    }
}

function mostrar2() {
    var archivo = document.getElementById("file2").files[0];
    ruta = archivo
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function() {
            sourcebase64 = reader.result;
            document.getElementById("img2").src = reader.result;
        }
    }
}

var xhr = new XMLHttpRequest();
var url = "https://t8gc9ume1m.execute-api.us-east-2.amazonaws.com/test3/s3/obtenerimagenes";
xhr.open("GET", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
let images = '<ul>';
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        json.body.forEach(image => {
            images += "<lo>"
            images += `<img width="150" height="150"  label="dfghjk" src="https://pro1-images-grupo21.s3.amazonaws.com/` + image.imagen + `" height="33%">`;
            images += `<h3>` + image.id + `</h3>`;
            images += "</lo>"

        });

        document.getElementById('imgGroups').innerHTML = images + "</ul>";
    }
};
xhr.send('');

var xhr2 = new XMLHttpRequest();
var url2 = "http://semi1-lb-proyecto1-1129256119.us-east-1.elb.amazonaws.com/api/getStudents";
xhr2.open("GET", url2, true);
xhr2.setRequestHeader("Content-Type", "application/json");
let images2 = '<ul>';
xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
        var json = JSON.parse(xhr2.responseText);
        json.data.Items.forEach(item => {
            images2 += "<lo>"
            images2 += `<img width="150" height="150"  label="dfghjk" src="` + item.imagen.S + `" height="33%">`;
            images2 += "<h3>" + item.id.S + "</h3>";
            images2 += "</lo>"

            let canvas2 = document.createElement('canvas');
            var context = canvas2.getContext('2d');
            canvas2.getContext('2d');

            estudiantes.push({ "id": item.id.S, "imagen": canvas2.toDataURL(item.imagen.S).split(",")[1], "ruta": item.imagen.S });

        });
        console.log(json.data.Items)
        document.getElementById('imgUsers').innerHTML = images2 + "</ul>";

    }
};
xhr2.send('');

var xhr3 = new XMLHttpRequest();
var url3 = "https://ypmaohrq61.execute-api.us-east-1.amazonaws.com/test/asistencia";
xhr3.open("GET", url3, true);
xhr3.setRequestHeader("Content-Type", "application/json");
let images3 = '<ul>'
xhr3.onreadystatechange = function() {
    if (xhr3.readyState === 4 && xhr3.status === 200) {
        var json = JSON.parse(xhr3.responseText);
        console.log("---------------------")
        console.log(json)
        console.log("---------------------")

        json.body.Items.forEach(item => {
            images3 += "<lo>"
            images3 += '<table style="text-align:center; class="egt">' +
                "<tr>";
            images3 += `<th>--------------------</th><th style="text-align:center">` + `<a href="` + item.imagen + `">` +
                item.grupo + `</a></th><th>----------</th>` +
                "</tr>" +
                "<tr>" +
                "<th>" +
                "Estudiantes" +
                "</th>" +
                "<th>" +
                "Imagen Estudiantes" +
                "</th>" +
                "<th>" +
                "Asistio" +
                "</th>" +
                "</tr>"
            cont = 0
            item.asistencia.forEach(est => {
                images3 += "<tr>"
                images3 += "<th>"
                images3 += item.nombre[cont]
                images3 += "</th>"
                images3 += "<th>"
                images3 += `<a href="` +
                    item.ruta[cont] + `">ver</a>`
                images3 += "</th>"
                images3 += "<th>"
                images3 += est
                images3 += "</th>"
                images3 += "</tr>"
                cont++
            });
            images3 += "</table><br><br>"
            images3 += "</lo>"
        });
        document.getElementById('asistTable').innerHTML = images3 + "</ul>";
    }
};
xhr3.send('');