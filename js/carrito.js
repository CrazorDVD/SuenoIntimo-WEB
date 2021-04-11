document.addEventListener('DOMContentLoaded', () => {

});

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.btn-add');

    botones.forEach(boton => {
        const id = boton.parentElement.parentElement.children[0].value;

        boton.addEventListener('click', e => {
            addItemToCarrito(id);
        });
    });
    const cookies = document.cookie.split(';');
    let cookie = null;
    cookies.forEach(item => {
        if (item.indexOf('items') > -1) {
            cookie = item;
        }
    });
    if (cookie != null) {
        const count = cookie.split('=')[1];
        console.log(count);
    }
})

const bCarrito = document.querySelector('.carrito1');

bCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    const carritoContainer = document.querySelector('#carrito-container');

    if (carritoContainer.style.display == 'none') {
        carritoContainer.style.display = 'block';

        actualizarCarritoUI();
    } else {
        carritoContainer.style.display = 'none';
    }
});

function actualizarCarritoUI() {
    fetch('http://localhost/SuenoIntimo-WEB/api/carrito/api-carrito.php?action=mostrar')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            let tablaCont = document.querySelector('#tabla');
            let precioTotal = '';
            let html = '';
            data.items.forEach(element => {
                html += `
                <div class='fila'>
                    <div class='imagen'><img src='../imgs/items/${element.imagen}' width='100' /></div>
                    <div class='info'>
                        <input type='hidden' value='${element.id}' />
                        <div class='nombre'>${element.nombre}</div>
                        <div>${element.cantidad} items de $${element.precio}</div>
                        <div>Subtotal: $${element.subtotal}</div>
                        <div class='botones'><button class='btn-remove'>Quitar 1 del carrito</button></div>
                    </div>
                </div>
            `;
            });


            precioTotal = `<p>Total: $${data.info.total}</p>`;
            tablaCont.innerHTML = precioTotal + html;
            document.cookie = `items=${data.info.count}`;

            document.querySelectorAll('.btn-remove').forEach(boton => {
                boton.addEventListener('click', () => {
                    const id = boton.parentElement.parentElement.children[0].value;
                    removeItemFromCarrito(id);
                })
            });

        });

};



const addItemToCarrito = id => {
    fetch('http://localhost/SuenoIntimo-WEB/api/carrito/api-carrito.php?action=add&id=' + id)
        .then(response => {
            return response.text();
        })
        .then(data => {
            actualizarCarritoUI();
        });
};

const removeItemFromCarrito = id => {
    fetch('http://localhost/SuenoIntimo-WEB/api/carrito/api-carrito.php?action=remove&id=' + id)
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data.statuscode);
            actualizarCarritoUI();
        });
};