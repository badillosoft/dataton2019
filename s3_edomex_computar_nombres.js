const cursor = db["servidores-sancionados-edomex"].find();

function encode(text) {
    return `${text}`.toLowerCase().replace(/\s+/g, "-")
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u")
        .replace(/[^\w-]/g, "x");
}

let i = 0;
while (cursor.hasNext()) {
    let doc = cursor.next();
    
    let nombre = `
        ${doc.servidor_publico_sancionado.nombres} 
        ${doc.servidor_publico_sancionado.primer_apellido} 
        ${doc.servidor_publico_sancionado.segundo_apellido}
    `.replace(/[\s\t\n]+/g, " ").trim();
    
    let nombre_enc = encode(nombre);
    
    let apellidos = `
        ${doc.servidor_publico_sancionado.primer_apellido} 
        ${doc.servidor_publico_sancionado.segundo_apellido}
    `.replace(/[\s\t\n]+/g, " ").trim();
    
    let apellidos_enc = encode(apellidos);
    
    db["servidores-sancionados-edomex"].updateOne({ _id: doc._id }, {
        $set: {
            nombre,
            nombre_enc,
            apellidos,
            apellidos_enc
        }
    })
    
    if (i < 3) {
        print(nombre);
        print(nombre_enc);
    }

    i++;
    if (i % 100 === 0) print(`...(${i})`)
}