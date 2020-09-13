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
        var url2 = "https://t8gc9ume1m.execute-api.us-east-2.amazonaws.com/test3/carga";
        xhr2.open("POST", url2, true);
        xhr2.setRequestHeader("Content-Type", "application/json");
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                var json = JSON.parse(xhr2.responseText);
                console.log(json);
            }
        };

        var data2 = JSON.stringify({ "grupo": { "id": $('#user').val(), "imagen": sourcebase64.split(",")[1], "ruta": ruta }, "estudiantes": estudiantes });
        xhr2.send(data2);
    });

    $('#guardarEstudiantes').click(function() {
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

        console.log(data)
        xhr.send(data);
    });
});
var estudiantes = []
var sourcebase64
var ruta

function mostrar() {
    ruta = files[0]
    var archivo = document.getElementById("file").files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function() {
            sourcebase64 = reader.result;
            document.getElementById("img").src = reader.result;
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
        console.log(json);
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
var url2 = "https://t8gc9ume1m.execute-api.us-east-2.amazonaws.com/test3/s3/obtenerimagenes";
xhr2.open("GET", url2, true);
xhr2.setRequestHeader("Content-Type", "application/json");
let images2 = '<ul>';
xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
        var json = JSON.parse(xhr2.responseText);
        console.log(json);
        json.body.forEach(image => {
            images2 += "<lo>"
            images2 += `<img width="150" height="150"  label="dfghjk" src="https://pro1-images-grupo21.s3.amazonaws.com/` + image.imagen + `" height="33%">`;
            images2 += `<h3>` + image.id + `</h3>`;
            images2 += "</lo>"

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Set width and height
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image
            ctx.drawImage(img, 0, 0);

            estudiantes.add({ "id": image.id, "imagen": canvas.toDataURL(image.imagen), "ruta": image.imagen });
        });

        document.getElementById('imgUsers').innerHTML = images2 + "</ul>";
    }
};
xhr2.send('');

var xhr3 = new XMLHttpRequest();
var url3 = "https://t8gc9ume1m.execute-api.us-east-2.amazonaws.com/test3/s3/obtenerimagenes";
xhr3.open("GET", url3, true);
xhr3.setRequestHeader("Content-Type", "application/json");
let images3 = '<table class="egt">' +
    "<tr>";
xhr3.onreadystatechange = function() {
    if (xhr3.readyState === 4 && xhr3.status === 200) {
        var json = JSON.parse(xhr3.responseText);

        json.body.Items.forEach(item => {
            images3 += `<th>` + `<a href=https://pro1-images-grupo21.s3.amazonaws.com/"` +
                item.grupo.ruta + `">` + item.grupo.id + `</a></th>` +
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
            item.estudiantes.forEach(est => {
                images3 += "<tr>"
                images3 += "<th>"
                images3 += est.id
                images3 += "</th>"
                images3 += "<th>"
                images3 += `<a href=https://pro1-images-grupo21.s3.amazonaws.com/"` +
                    est.ruta + `">ver</a>`
                images3 += "</th>"
                images3 += "<th>"
                images3 += est.asistencia
                images3 += "</th>"
                images3 += "</tr>"

            });
            images3 += "<br><br><br>"
        });

        document.getElementById('asistTable').innerHTML = images3 + "</table>";
    }
};
xhr3.send('');