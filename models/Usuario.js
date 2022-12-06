import mongoose from "mongoose";
import bcrypt from "bcrypt";

//MODELO DE NUESTRO SCHEMA
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type : String,
        required: true,
        trim: true //ELIMINA LOS ESPACIOS EN BLANCO DEL COMIENZO Y DEL FINAL
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true //ES SIMILAR A UNA AUTENTICACION SI YA EXISTE EL EMAIL REGISTRADO,
    },
    token: {
        type:String,
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},{
    timestamp: true //CREA DOS COLUMNAS MAS, UNA DE CREADO Y OTRA DE ACTUALIZADO
})

//APLICANDO un midleware para hashear el pasword (funcion que toma el control durante la ejecucion de una funcion asincrona)
usuarioSchema.pre("save", async function(next){
    
    //Validacion de si el pasword fue modificado 
    if(!this.isModified("password")){
        next() //Te manda al siguiente midleware
    }
    
    //Creacion de constanste de pasword haseado
    const salt = await bcrypt.genSalt(10); //.genSatl (GENERA UN HAS DE 10) 
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario