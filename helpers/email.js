import nodemailer from "nodemailer";

export  const emailRegistro = async (datos)=>{
    
    const { nombre, email, token } = datos;


    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:  process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERS,
          pass: process.env.EMAIL_PASS
        }
    });

    //Informacion Email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cue ta en UpTask",
        html: `
        <p> Hola ${nombre} Comprueba tu cuenta </p>
        
        <p>Solo debes hacer click en el siguiente enlace: </p>

        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        
        <p>Si tu no creaste la cuenta desestima el Email</p>
        `
    })
}


export  const emailOlvidePassword = async (datos) =>{
    
    const { nombre, email, token } = datos;


    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:  process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERS,
          pass: process.env.EMAIL_PASS
        }
    });

    //Informacion Email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Restablece tu Password",
        text: "Restablece tu Password",
        html: `
        <p> Hola ${nombre} Se reestablecera tu Password </p>
        
        <p>Sigue el siguiente enlace para reestablecer tu password: </p>

        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        
        <p>Si tu no solicitaste este email desestima el Email</p>
        `
    })
}