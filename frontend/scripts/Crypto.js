class CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual) {
        this.id = id;
        this.nombre = nombre;
        this.simbolo = simbolo;
        this.fechaCreacion = fechaCreacion;
        this.precioActual = precioActual;
    }
}

class Crypto extends CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual, tipoConsenso, algoritmo) {
        super(id, nombre, simbolo, fechaCreacion, precioActual);
        this.tipoConsenso = tipoConsenso;
        this.algoritmo = algoritmo;
    }
}

export {Crypto, CryptoBase};