export class Persona
{
    private nombre: string = "";
    private primerApellido: string = "";
    private segundoApellido: string = "";
    private telefono: string = "";
    private nid: string = "";
    private fechaNacimiento: string = "";

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
    
}