const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const morgan = require('morgan');
var uuid = require('uuid');

const aws_bucket = require('../keys/awsBucket');
const aws_db = require('../keys/awsDB');
const aws_keys = require('../keys/awsKeys');

//Inicializaciones
const app = express();

// settings
app.set('port', process.env.PORT || 3000);
app.use(cors());

//Midlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

//AWS
const s3 = new AWS.S3(aws_keys.s3);
const dynDb = new AWS.DynamoDB(aws_keys.dynamodb);
const rekognition = new AWS.Rekognition(aws_keys.rekognition);

// ########### RUTAS ###########

//registro
app.post('/api/signin', (req, res) => {
    let body = req.body;

    const user = body.user;
    const pass = body.pass;

    //verificando si es registro de usuario con imagen
    if(body.sourceBase64){
        //decoded image
        const sourceBase64 = body.sourceBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)[2];
        const bufferSource = new Buffer.from(sourceBase64, 'base64');
        //creando nombre de imagen
        let image = `${uuid()}.jpg`;
        let filepath = `${aws_bucket.filepath.capturas}${image}`;
        
        //creando parametros para imagen
        var paramsUploadImage = {
            Bucket : aws_bucket.name,
            Key : filepath,
            Body : bufferSource,
            ACL: 'public-read'
        }
        
        s3.upload(paramsUploadImage, function sync(err1, data1){
            if(err1){
                console.log('Error uploading file: ', err1);
                res.send({
                    status : false,
                    message : `Internal server error.`
                });
            }
            else{
                console.log('Upload success at:', data1.Location);
                //creando parametros para nuevo registro
                let paramsUser = {
                    TableName : aws_db.table,
                    Item : {
                        "id" : { S: user},
                        "imagen" : { S: data1.Location},
                        "password" : { S: pass},
                        "rol" : { S: aws_db.roles.user},
                        "asistencias" : { L: [] }
                    },
                    ConditionExpression: 'attribute_not_exists(id)'
                }

                dynDb.putItem(paramsUser, (err, data) => {
                    if(err){
                        console.log('Error saving user: ', err);
                        res.send({
                            status : false,
                            message : `El usuario '${user}' ya existe.`
                        });
                    }
                    else{
                        res.send({
                            status : true,
                            message : `Se creo exitosamente el usuario '${user}'.`
                        });
                    }
                });
            }
        });
    }
    else{
        
        //creando parametros para nuevo registro
        let paramsUser = {
            TableName : aws_db.table,
            Item : {
                "id" : { S: user},
                "imagen" : { S: ''},
                "password" : { S: pass},
                "rol" : { S: aws_db.roles.user},
                "asistencias" : { L: [] }
            },
            ConditionExpression: 'attribute_not_exists(id)'
        }

        dynDb.putItem(paramsUser, (err, data) => {
            if(err){
                console.log('Error saving user: ', err);
                res.send({
                    status : false,
                    message : `El usuario '${user}' ya existe.`
                });
            }
            else{
                res.send({
                    status : true,
                    message : `Se creo exitosamente el usuario '${user}'.`
                });
            }
        });
    }
});

//inicio de sesion
app.post('/api/login', (req, res) => {
    let body = req.body;

    //verificando si es registro de usuario con imagen
    if(body.sourceBase64){
        //decoded image
        const sourceBase64 = body.sourceBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)[2];
        const bufferSource = new Buffer.from(sourceBase64, 'base64');

        //recorriendo tabla
        let paramsTable = {
            TableName : aws_db.table
        };

        //porcentaje de similitud
        const similarity = 90;
        //creando nombre de imagen
        let image = `${uuid()}.jpg`;
        let filepath = `${aws_bucket.filepath.capturas}${image}`;
        
        //creando parametros para imagen
        var paramsUploadImage = {
            Bucket : aws_bucket.name,
            Key : filepath,
            Body : bufferSource,
            ACL: 'public-read'
        }
        //guardando captura
        s3.upload(paramsUploadImage, (err, data) =>{
            if(err){
                console.log('Error uploading file: ', err);
            }
            else{
                console.log('Saved file: ', data.Location);
            }
        });       


        dynDb.scan(paramsTable, async function(err, data){
            if(err){
                console.log('Failed to search for users', err);
                res.send({
                    status : false,
                    message : `Internal server error.`
                });
            }
            else{
                let respuesta = {
                    status : false,
                    message : `No existe usuario`
                }

                for(let i = 0; data.Items.length; i++){
                    console.log(data.Items[i]);
                    //verificando que sea rol=usuario y que tenga imagen
                    if( !(data.Items[i].rol.S == aws_db.roles.user && data.Items[i].imagen.S != '') ){
                        continue;
                    }

                    const imagen = data.Items[i].imagen.S.replace('https://pro1-images-grupo21.s3.amazonaws.com/', '');
                    //parametros para comparar las imagenes
                    var paramsCompare = {
                        SimilarityThreshold: similarity,
                        SourceImage: {
                            Bytes: bufferSource
                        },
                        TargetImage: {
                            S3Object:
                            {
                                Bucket: aws_bucket.name,
                                Name: imagen
                            }
                        }
                    }

                    const datos = await rekognition.compareFaces(paramsCompare).promise();

                    if(datos.FaceMatches.length > 0){
                        respuesta = {
                            status : true,
                            user : data.Items[i].id.S,
                            src : data.Items[i].imagen.S
                        }
                        //console.log(datos);
                        break;
                    }

                }

                res.send(respuesta);
            }
        });
    }
    else{
        const user = body.user;
        const pass = body.pass;

        //validando si existe usuario
        let paramsUser = {
            TableName : aws_db.table,
            KeyConditionExpression : 'id = :user',
            ExpressionAttributeValues : {
                ':user': { 'S': user }
            }
        };

        dynDb.query(paramsUser, async function(err, data){
            if(err){
                console.log('Error finding user: ', err);
                res.send({
                    status : false,
                    message : `Internal server error.`
                });
            }
            else{
                let respuesta = {
                    status : false,
                    message : `Usuario o Contraseña no validos`
                }

                for (const element of data.Items) {
                    //console.log(element.id.S);
                    if(element.id.S == user){
                        if(element.password.S == pass){
                            respuesta = {
                                status : true,
                                user : user,
                                src : element.imagen.S == null || undefined ? "" : element.imagen.S
                            }
                        }
                    }
                }

                res.send(respuesta);
            }
        });
    }
});

//registar estudiante
app.post('/api/registerStudent', (req, res) => {
    let body = req.body;

    const user = body.user;
    const extension = body.extension;

    //decoded image
    const sourceBase64 = body.sourceBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)[2];
    const bufferSource = new Buffer.from(sourceBase64, 'base64');
    //creando nombre de imagen
    let image = `${uuid()}.${extension}`;
    let filepath = `${aws_bucket.filepath.estudiantes}${image}`;

    //creando parametros para imagen
    var paramsUploadImage = {
        Bucket : aws_bucket.name,
        Key : filepath,
        Body : bufferSource,
        ACL: 'public-read'
    }
    
    s3.upload(paramsUploadImage, function sync(err1, data1){
        if(err1){
            console.log('Error uploading file: ', err1);
            res.send({
                status : false,
                message : `Internal server error`
            });
        }
        else{
            console.log('Upload success at:', data1.Location);
            //creando parametros para nuevo registro
            let paramsUser = {
                TableName : aws_db.table,
                Item : {
                    "id" : { S: user},
                    "imagen" : { S: data1.Location},
                    "password" : { S: '' },
                    "rol" : { S: aws_db.roles.student },
                    "asistencias" : { L: [] }
                },
                ConditionExpression: 'attribute_not_exists(id)'
            }

            dynDb.putItem(paramsUser, (err, data) => {
                if(err){
                    console.log('Error saving student: ', err);
                    res.send({
                        status : false,
                        message : `El estudiante '${user}' ya existe.`
                    });
                }
                else{
                    res.send({
                        status : true,
                        message : `Se creo exitosamente el estudiante '${user}'.`
                    });
                }
            });
        }
    });

});

//obtener estudiantes
app.get('/api/getStudents', (req, res) => {
    //validando si existe usuario
    let paramsEstudiantes = {
        TableName : aws_db.table,
        FilterExpression : 'rol = :role',
        ExpressionAttributeValues : {
            ':role': { 'S': aws_db.roles.student }
        }
    };
    
    dynDb.scan(paramsEstudiantes, function(err, data){
        if(err){
            console.log('Failed to get students', err);
            res.send({
                status : false,
                message : `Internal server error`
            });
        }
        else{
            //console.log(data);
            res.send({
                status : true,
                data : data
            });
        }
    });

});

//Inicio del servidor
app.listen(app.get('port'), () => {
    console.log("Servidor corriendo en el puerto " + app.get('port'));
});