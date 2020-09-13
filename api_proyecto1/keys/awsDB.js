let awsDB = {
    table : "uAttendance",
    fields : {
        id : "id",
        imagen : "imagen",
        pass : "password",
        rol : "rol",
        asistencias : "asistencias"
    },
    roles : {
        user : "U",
        student : "E",
        groupPhoto : "G"
    }
}

module.exports = awsDB;