import { ObjectId } from "mongodb";
import client from "../common/db.js";
import { Actor } from "./actor.js";

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')


// FUNCION PARA INGRESAR UN NUEVO REGISTRO DENTRO DE LA COLECCION
async function handleInsertActorRequest(req, res){
    let data = req.body
    let actor = Actor

    try {
        // Buscar la película por su nombre en la colección de Peliculas
        const pelicula = await peliculaCollection.findOne({ nombre: data.nombrePelicula });
        
        // Validar que la película exista
        if (!pelicula) {
            return res.status(404).send('La película especificada no existe');
        }

        actor.idPelicula = pelicula._id;
        actor.nombre = data.nombre
        actor.edad = data.edad
        actor.estaRetirado = data.estaRetirado
        actor.premios = data.premios

    await actorCollection.insertOne(actor)
    .then((data) => {
        if(data === null) return res.status(400).send('Error al guardar registro')
        return res.status(201).send(data)
    })
    .catch((e) => {
        return res.status(500).send({ error: e });
    });

    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}


// FUNCION PARA OBTENER TODOS LOS REGISTROS DESDE LA COLECCION
async function handleGetActoresRequest(req, res){
    await actorCollection.find().toArray()
    .then((data) => { return res.status(200).send(data) })
    .catch((e) => { return res.status(500).send({ error: e}) })
}

// FUNCION PARA OBTENER UN REGISTRO EN BASE A SU ID
async function handleGetActorByIdRequest(req, res){
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
        .then((data) => {
            if(data === null) return res.status(404).send(data)

            return res.status(200).send(data) 
        })

        .catch((e) => { 
            return res.status(500).send({ error: e.code })
        })


    }catch(e){
        return res.status(400).send('Id mal formado')
    }
}


// FUNCIÓN PARA OBTENER TODOS LOS ACTORES DE UNA PELÍCULA SEGÚN SU _ID
async function handleGetActoresByPeliculaIdRequest(req, res) {
    const idPelicula = req.params.id

    try {
        // Convertir el id de la película a ObjectId
        let oid = ObjectId.createFromHexString(idPelicula)
        
        // Buscar todos los actores que tengan el idPelicula igual al peliculaId proporcionado
        await actorCollection.find({ idPelicula: oid.toString }).toArray()
            .then((data) => {
                if (data.length === null) return res.status(404).send(data);

                return res.status(200).send(data);
            })
            .catch((e) => {
                return res.status(500).send({ error: e.code });
            });

    } catch (e) {
        return res.status(400).send('Id de película mal formado');
    }
}

// exportar cada una de estas funciones para luego crear el enrutador...
export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}


