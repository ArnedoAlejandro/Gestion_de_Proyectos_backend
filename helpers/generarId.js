
const generarId = () =>{
    const randon = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);

    return randon + fecha
}

export default generarId