import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js'



const app = express();
app.use(express.json())

dotenv.config();

conectarDB();

//Configurar cors
//Constante que almacena la ruta de nuestro servidor que envia los datos del formulario
const whitelist = [process.env.FRONTEND_URL];

const corsOption = {
    origin: function(origin, callback){
       
        if(whitelist.includes(origin)){
            //Puede consultar la api
            callback( null, true );
        }else{
            //No esta permitido 
            callback(new Error("Error de cors"));
        }
    }
}

app.use(cors(corsOption));

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes )




const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});


//Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout : 60000,
  cors: {   
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {

  //Definir eventos de socket.io
    socket.on("abrir proyecto", (proyecto) =>{
        //Conecta el soket al proyecto 
        socket.join(proyecto)
    });
    //Nueva tarea
    socket.on("nueva tarea", (tarea) =>{
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea agregada", tarea)
    })
    //Eliminar tarea
    socket.on("eliminar tarea", tarea=>{
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea eliminada", tarea)
    })
    //Editar tarea
    socket.on("editar tarea", tarea =>{
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit("tarea editada", tarea)
    })
    //Completar tarea
    socket.on("cambiar estado", (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit("nuevo estado", tarea);
    });
    //Eliminar colaborador
    // socket.on("eliminar colaborador nuevo", (colaborador)=>{
    //     const colaboradorEliminada = colaborador.colaborarEliminado._id;
    //     socket.to(colaboradorEliminada).emit("eliminar colaborador", colaborador)
    // })

})