import { editOne, deleteOne, getAllFetch, getOneFetch, addOneFetch } from "./api.js";
import { Crypto } from "./Crypto.js";

document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
    let formularioCrypto;
    let cuerpoTablaCrypto;
    let botonEliminar;
    let botonEliminarTodos;
    let filtroAlgoritmo;
    let promedioPrecio;
    let spinner;
    let idEdicion = null;
    let cryptos = [];

    function mostrarSpinner() {
        spinner.style.display = 'block';
    }

    function ocultarSpinner() {
        spinner.style.display = 'none';
    }

    async function cargarCryptos() {
        mostrarSpinner();
        try {
            cryptos = await getAllFetch();
            aplicarFiltroYRenderizar();
        } catch (error) {
            console.error('Error cargando cryptos:', error);
        } finally {
            ocultarSpinner();
        }
    }

    function aplicarFiltroYRenderizar() {
        const algoritmoSeleccionado = filtroAlgoritmo.value;
        const cryptosFiltradas = algoritmoSeleccionado 
            ? cryptos.filter(crypto => crypto.algoritmo === algoritmoSeleccionado)
            : cryptos;
        renderizarTablaCryptos(cryptosFiltradas);
        mostrarPromedioPrecio(cryptosFiltradas);
    }

    function renderizarTablaCryptos(cryptos) {
        cuerpoTablaCrypto.innerHTML = '';
        cryptos.forEach(crypto => {
            const fila = crearFilaCrypto(crypto);
            cuerpoTablaCrypto.appendChild(fila);
        });
    }

    function crearFilaCrypto(crypto) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${crypto.nombre}</td>
            <td>${crypto.simbolo}</td>
            <td>${crypto.fechaCreacion}</td>
            <td>${crypto.precioActual}</td>
            <td>${crypto.tipoConsenso}</td>
            <td>${crypto.algoritmo}</td>
            <td>
                <button class="btn btn-primary btn-sm boton-editar">Editar</button>
                <button class="btn btn-danger btn-sm boton-eliminar">Eliminar</button>
            </td>
        `;
        fila.querySelector('.boton-editar').addEventListener('click', function() {
            editarCrypto(crypto.id);
        });
        fila.querySelector('.boton-eliminar').addEventListener('click', function() {
            eliminarCrypto(crypto.id);
        });
        return fila;
    }

    function mostrarPromedioPrecio(cryptos) {
        if (cryptos.length === 0) {
            promedioPrecio.textContent = 'Promedio de Precio: N/A';
        } else {
            const totalPrecio = cryptos.reduce((acc, crypto) => acc + parseFloat(crypto.precioActual), 0);
            const promedio = totalPrecio / cryptos.length;
            promedioPrecio.textContent = `Promedio de Precio: ${promedio.toFixed(2)}`;
        }
    }

    async function agregarOActualizarCrypto(evento) {
        evento.preventDefault();
        const id = idEdicion || Date.now().toString();
        const nombre = formularioCrypto.querySelector('#cryptoNombre').value;
        const simbolo = formularioCrypto.querySelector('#cryptoSimbolo').value;
        const fechaCreacion = formularioCrypto.querySelector('#cryptoFecha').value;
        const precioActual = formularioCrypto.querySelector('#cryptoPrecio').value;
        const tipoConsenso = formularioCrypto.querySelector('#cryptoConsensus').value;
        const algoritmo = formularioCrypto.querySelector('#cryptoAlgoritmo').value;

        if (!nombre || !simbolo || !fechaCreacion || !precioActual) {
            alert('Todos los campos son requeridos');
            return;
        }

        const crypto = new Crypto(id, nombre, simbolo, fechaCreacion, precioActual, tipoConsenso, algoritmo);

        try {
            mostrarSpinner();
            if (idEdicion) {
                await editOne(crypto);
            } else {
                await addOneFetch(crypto);
            }
            await cargarCryptos();
            resetearFormulario();
        } catch (error) {
            console.error('Error agregando/actualizando crypto:', error);
        } finally {
            ocultarSpinner();
        }
    }

    async function editarCrypto(id) {
        try {
            const crypto = await getOneFetch(id);
            formularioCrypto.querySelector('#cryptoNombre').value = crypto.nombre;
            formularioCrypto.querySelector('#cryptoSimbolo').value = crypto.simbolo;
            formularioCrypto.querySelector('#cryptoFecha').value = crypto.fechaCreacion;
            formularioCrypto.querySelector('#cryptoPrecio').value = crypto.precioActual;
            formularioCrypto.querySelector('#cryptoConsensus').value = crypto.tipoConsenso;
            formularioCrypto.querySelector('#cryptoAlgoritmo').value = crypto.algoritmo;
            idEdicion = id;
            botonEliminar.style.display = 'block';
        } catch (error) {
            console.error('Error editando crypto:', error);
        }
    }

    async function eliminarCrypto(id) {
        if (confirm('¿Estás seguro de querer eliminar esta crypto?')) {
            try {
                mostrarSpinner();
                deleteOne(id);
                await cargarCryptos();
            } catch (error) {
                console.error('Error eliminando crypto:', error);
            } finally {
                ocultarSpinner();
            }
        }
    }

    async function eliminarTodasCryptos() {
        if (confirm('¿Estás seguro de querer eliminar todas las cryptos?')) {
            try {
                mostrarSpinner();
                for (let crypto of cryptos) {
                    deleteOne(crypto.id);
                }
                cryptos = [];
                await cargarCryptos();
            } catch (error) {
                console.error('Error eliminando todas las cryptos:', error);
            } finally {
                ocultarSpinner();
            }
        }
    }

    function resetearFormulario() {
        formularioCrypto.reset();
        idEdicion = null;
        botonEliminar.style.display = 'none';
    }

    formularioCrypto = document.getElementById('cryptoForm');
    cuerpoTablaCrypto = document.getElementById('cryptoTableBody');
    botonEliminar = document.getElementById('deleteButton');
    botonEliminarTodos = document.getElementById('deleteAllButton');
    filtroAlgoritmo = document.getElementById('filtroAlgoritmo');
    promedioPrecio = document.getElementById('promedioPrecio');
    spinner = document.getElementById('spinner');

    formularioCrypto.addEventListener('submit', agregarOActualizarCrypto);
    botonEliminarTodos.addEventListener('click', eliminarTodasCryptos);
    filtroAlgoritmo.addEventListener('change', aplicarFiltroYRenderizar);

    cargarCryptos();
}