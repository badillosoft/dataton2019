/**
 * Backhouse Consulting
 * Alan Badillo Salas & José Eduardo Badillo Salas
 * Diciembre 2019
 * 
 * Pipeline para generar extraer los proveedores de dataton2019.contratos2019
 * 
 */

[{
    $project: {
        "proveedor": "$proveedor-o-contratista",
        "rfc": "$rfc",
        "rfc_verificado": { $eq: ["$rfc-verificado-en-el-sat", "1"] },
        "estrato": "$estratificacixn-de-la-empresa",
        "pais": "$clave-del-paxs-de-la-empresa",

    }
}, {
    $group: {
        _id: "$rfc",
        proveedor: {
            $first: "$proveedor"
        },
        rfc_verificado: {
            $first: "$rfc_verificado"
        },
        estrato: {
            $first: "$estrato"
        },
        pais: {
            $first: "$pais"
        },
        contratos: {
            $push: "$_id"
        },
    }
}, { $out: 'proveedores' }]