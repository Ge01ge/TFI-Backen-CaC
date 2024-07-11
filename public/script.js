document.addEventListener('DOMContentLoaded', () => {
    const mostrarCrearUsuarioFormBtn = document.getElementById('mostrarCrearUsuarioFormBtn');
    const crearUsuarioForm = document.getElementById('crearUsuarioForm');
    const editarUsuarioForm = document.getElementById('editarUsuarioForm');
    const cancelarCrearUsuarioBtn = document.getElementById('cancelarCrearUsuario');
    const listarUsuariosBtn = document.getElementById('listarUsuariosBtn');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const currentImage = document.getElementById('currentImage');

    mostrarCrearUsuarioFormBtn.addEventListener('click', () => {
        crearUsuarioForm.classList.toggle('hidden');
    });

    cancelarCrearUsuarioBtn.addEventListener('click', () => {
        crearUsuarioForm.classList.add('hidden');
        crearUsuarioForm.reset(); // Opcional: limpia los campos del formulario
    });

    crearUsuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(crearUsuarioForm);
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
        crearUsuarioForm.reset();
        crearUsuarioForm.classList.add('hidden');
        listarUsuarios();
    });

    editarUsuarioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editarUsuarioForm);
        const id = formData.get('editID');
        const data = {
            nombre: formData.get('editNombre'),
            apellido: formData.get('editApellido'),
            mail: formData.get('editMail')
        };
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        editarUsuarioForm.reset();
        editarUsuarioForm.classList.add('hidden');
        listarUsuarios();
    });

    listarUsuariosBtn.addEventListener('click', listarUsuarios);

    async function listarUsuarios() {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        listaUsuarios.innerHTML = '';

        usuarios.forEach(usuario => {
            const li = document.createElement('li');
            const imageSrc = usuario.ruta_archivo ? `/uploads/${usuario.ruta_archivo}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUBbNf8tPjjMylsbREVGlN1Dj30k5_JVDZOg&s';

            li.innerHTML = `
                <div class="card">
                    <img src="${imageSrc}" alt="Imagen de perfil">
                    <div class="card-content">
                        <p>ID: ${usuario.id}</p>
                        <p>Nombre: ${usuario.nombre}</p>
                        <p>Apellido: ${usuario.apellido}</p>
                        <p>Email: ${usuario.mail}</p>
                        <p>Archivo: ${usuario.ruta_archivo}</p>
                        <div class="actions">
                            <button class="update" data-id="${usuario.id}" data-nombre="${usuario.nombre}" data-apellido="${usuario.apellido}" data-email="${usuario.email}" data-image="${imageSrc}">Actualizar</button>
                            <button class="delete" data-id="${usuario.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;

            listaUsuarios.appendChild(li);
        });

        document.querySelectorAll('.update').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const nombre = e.target.getAttribute('data-nombre');
                const apellido = e.target.getAttribute('data-apellido');
                const email = e.target.getAttribute('data-email');
                const imagen = e.target.getAttribute('data-image');

                document.getElementById('editID').value = id;
                document.getElementById('editNombre').value = nombre;
                document.getElementById('editApellido').value = apellido;
                document.getElementById('editMail').value = email;
                currentImage.src = imagen;

                editarUsuarioForm.classList.remove('hidden');
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                alert(result.message);
                listarUsuarios();
            });
        });
    }
});
