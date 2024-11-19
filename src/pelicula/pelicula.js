import { BSONType, ObjectId } from "mongodb"

export const Pelicula = {
    _id: ObjectId,
    nombre: BSONType.string,
    genero: BSONType.array,
    anioEstreno: BSONType.int
}