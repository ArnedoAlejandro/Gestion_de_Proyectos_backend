import Usuario from "../models/Usuario.js"
//TOKEN
import generarId from "../helpers/generarId.js";
//IMPORTACION DE ARCHIVO JWT
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";


//VARIABLE DE REGISTRAR CLIENTE RUTA ("/", registrar)
const  registrar = async (req, res) => {
//Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({email}) //.findOne (busca un parametro ya existente o igual)
    
//Validacion y Creacion de error en caso que exista el usuario
    if( existeUsuario ){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }

    try {
//Obtencion y creacion de un nuevo usuario 
        const usuario = new Usuario(req.body);
        //Generar id o token
        usuario.token = generarId();
//Creacion de usuario nuevo almacenado
        await usuario.save(); //.save nos permite obtener un objeto, modificarlo, almacenarlo
        res.json({
            msg: "Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta"
        });
//Enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

    } catch (error) {
        console.log(error)
    }
}

const autenticar = async ( req, res ) =>{

    const { email, password } = req.body;
//COMPROBAR SI EL USUARIO EXISTE
    const usuario = await Usuario.findOne({email}) //findOne nos permite realizar una busqueda
 
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
//COMPROBAR SI EL USUARIO ESTA AUTENTICADO
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no a sido confirmada")
        return res.status(403).json({msg: error.message})
    }
// COMPROBAR SU PASSWORD
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id : usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("Password incorrecto")
        return res.status(403).json({msg: error.message})
    }
}


// VALIDACION DE TOKEN
const confirmar = async ( req, res ) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token })

   if(!usuarioConfirmar){
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message })
   };
   try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado"});
   } catch (error) {
        console.log(error)
   };
}


const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      const error = new Error("El Usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
  
    try {
      usuario.token = generarId();
      await usuario.save();
  
      // Enviar el email
      emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token,
      });
  
      res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
      console.log(error);
    }
  };
const comprobarToken = async (req, res)=>{
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({token});

    if(tokenValido){
        res.json({msg: "Token valido Usuario existente"});
    }else{
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }
};
const nuevoPassword = async (req, res) =>{
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token })

    if(usuario){
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({msg: "Password Modificado Correctamente"})    
        } catch (error) {
            console.log(error)
        }
    }else{
        const error = new Error("Pasword incorrecto");
        return res.status(404).json({msg: error.message})
    }
    
}

const perfil = async (req,res) =>{
    const {usuario} = req;
    res.json(usuario)
}

export { registrar,
        autenticar, 
        confirmar, 
        olvidePassword, 
        comprobarToken, 
        nuevoPassword,
        perfil
        } 