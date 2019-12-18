function uuid() {
    return Math.random().toString(32).slice(2, 6).toUpperCase();
}

db["a1-servidores-sancionados-edomex"].drop();

const s2_cursor = db["s2-edomex"].find();

let i = 0;
while (s2_cursor.hasNext()) {
    let s2_doc = s2_cursor.next();

    let s2_sancion_clu = s2_doc.sancion_clu || uuid();
    let s2_sancion_arr = s2_doc.sancion_arr || [];

    let s3_cursor = db["servidores-sancionados-edomex"].find({
        apellidos_enc: s2_doc.apellidos_enc
    });

    while (s3_cursor.hasNext()) {
        let s3_doc = s3_cursor.next();

        let s3_sanciones_clu = s3_doc.sanciones_clu || [];

        s3_sanciones_clu.push(s2_sancion_clu);

        s2_sancion_arr.push({
            _id: s3_doc._id,
            nombre: s3_doc.nombre,
            nombre_enc: s3_doc.nombre_enc,
            apellidos: s3_doc.apellidos,
            apellidos_enc: s3_doc.apellidos_enc,
        });

        db["servidores-sancionados-edomex"].updateOne({ _id: s3_doc._id }, {
            $set: {
                sanciones_clu: s3_sanciones_clu
            }
        })

        db["a1-servidores-sancionados-edomex"].insertOne({
            cluster: s2_sancion_clu,
            servidor: {
                _id: s2_doc._id,
                nombre: s2_doc.nombre,
                nombre_enc: s2_doc.nombre_enc,
                apellidos: s2_doc.apellidos,
                apellidos_enc: s2_doc.apellidos_enc,
            },
            sancionado: {
                _id: s3_doc._id,
                nombre: s3_doc.nombre,
                nombre_enc: s3_doc.nombre_enc,
                apellidos: s3_doc.apellidos,
                apellidos_enc: s3_doc.apellidos_enc,
            },
        })

        // print(s2_doc.nombre, s3_doc.nombre);
    }

    db["s2-edomex"].updateOne({ _id: s2_doc._id }, {
        $set: {
            sancion_clu: s2_sancion_clu,
            sancion_arr: s2_sancion_arr,
        }
    })

    i++;
    if (i % 100 === 0) print(`...(${i})`)
}