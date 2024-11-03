export class Persona
{
    private nombre: string = "";
    private primerApellido: string = "";
    private segundoApellido: string = "";
    private telefono: string = "";
    private nid: string = "";
    private fechaNacimiento: string = "";
    private correo_electronico: string = "";
    private nid_socio: string = "";

    public setNid(nid: string)
    {
        this.nid = nid;
    }

    public setNombre(nombre: string)
    {
        this.nombre = nombre;
    }

    public setPrimerApellido(primerApellido: string)
    {
        this.primerApellido = primerApellido;
    }

    public setSegundoApellido(segundoApellido: string)
    {
        this.segundoApellido = segundoApellido;
    }

  
    public setTelefono(telefono: string)
    {
        this.telefono = telefono;
    }

    public setFechaNacimiento(fechaNacimiento: string)
    {
        this.fechaNacimiento = fechaNacimiento;
    }

    public setCorreoElectronico(correo_electronico: string)
    {
        this.correo_electronico = correo_electronico;
    }

    public setNidSocio(nid_socio: string)
    {
        this.nid_socio = nid_socio;
    }

    public getNid()
    {
        return this.nid;
    }
    public getNombre() : string
    {
        return this.nombre
    }

    public getPrimerApellido() : string
    {
        return this.primerApellido
    }

    public getSegundoApellido() : string
    {
        return this.segundoApellido
    }

    public getTelefono() : string{
        return this.telefono;
    }

    public getFechaNacimiento(): string{
        return this.fechaNacimiento;
    }
    
    public getCorreoElectronico(): string
    {
        return this.correo_electronico;
    }

    public getNidSocio(): string
    {
        return this.nid_socio
    }
}