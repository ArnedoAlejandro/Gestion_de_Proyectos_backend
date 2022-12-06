//IMPORTACIONES DE RUTAS MEDIANTE EXPRES ROUTER

import  express  from "express";

import { 
        registrar,
        autenticar,
        confirmar,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        perfil
    } from "../controller/usuarioController.js"

import checkAuth from "../middleware/checkAuth.js"

//Constante donde se almacenan las rutas
const router = express.Router();

//autenticacion, registro y confirmacion de usuarios
router.post("/" , registrar) //CREAMOS UN NUEVO USUARIO
router.post("/login" , autenticar)
router.get("/confirmar/:token", confirmar )
router.post("/olvide-password", olvidePassword)
//Forma de enrutar mismas url pero con difenrentes metodos ( post, get )
router.route("/olvide-password/:token")
    .get(comprobarToken)
    .post(nuevoPassword)

router.get("/perfil", checkAuth, perfil)

export default router;