import { useState } from 'react'

const eventDetails = {
  honoree: 'Joaquin Jeremias Rosales Perez',
  age: 4,
  date: 'Sabado 23 de mayo de 2026',
  time: '3:00 p. m.',
  place: 'En nuestro Salon de Clases, Fiestas y Aventuras; en el Centro Educativo Aprendo Jugando',
}

const birthdayPhotos = [
  {
    id: 1,
    src: '/cumple/foto-1.jpeg',
    alt: 'Joaquin con gafas azules sentado al aire libre',
    label: 'Modo superheroe',
  },
  {
    id: 2,
    src: '/cumple/foto-2.jpeg',
    alt: 'Joaquin pequeno entre motos con gorra',
    label: 'Explorador curioso',
  },
  {
    id: 3,
    src: '/cumple/foto-3.jpeg',
    alt: 'Joaquin sentado a la mesa mirando a camara',
    label: 'Mirada tierna',
  },
  {
    id: 4,
    src: '/cumple/foto-4.jpeg',
    alt: 'Joaquin frente al arbol de navidad iluminado',
    label: 'Brillo especial',
  },
  {
    id: 5,
    src: '/cumple/foto-5.jpeg',
    alt: 'Joaquin de noche en una mesa con gorra negra',
    label: 'Aventura nocturna',
  },
  {
    id: 6,
    src: '/cumple/foto-6.jpeg',
    alt: 'Joaquin con uniforme azul sentado en la cama',
    label: 'Listo para jugar',
  },
  {
    id: 7,
    src: '/cumple/foto-7.jpeg',
    alt: 'Joaquin caminando junto al agua al atardecer',
    label: 'Atardecer magico',
  },
  {
    id: 8,
    src: '/cumple/foto-8.jpeg',
    alt: 'Joaquin pequeno sentado en el piso con bigote de leche',
    label: 'Recuerdo divertido',
  },
]

const emptyForm = {
  childName: '',
  childLastName: '',
  parentName: '',
  parentLastName: '',
}

const initialGuests = [
  {
    id: 1,
    childName: 'Mateo',
    childLastName: 'Lopez',
    parentName: 'Carla',
    parentLastName: 'Lopez',
  },
  {
    id: 2,
    childName: 'Sofia',
    childLastName: 'Ramirez',
    parentName: 'Andres',
    parentLastName: 'Ramirez',
  },
]

function App() {
  const [form, setForm] = useState(emptyForm)
  const [guests, setGuests] = useState(initialGuests)
  const [editingId, setEditingId] = useState(null)
  const [selectedPhotoId, setSelectedPhotoId] = useState(birthdayPhotos[0].id)
  const [statusMessage, setStatusMessage] = useState(
    'Completa los datos para registrar a un pequeno heroe.',
  )

  const totalGuests = guests.length
  const selectedPhoto =
    birthdayPhotos.find((photo) => photo.id === selectedPhotoId) ?? birthdayPhotos[0]

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedForm = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    )

    if (Object.values(normalizedForm).some((value) => !value)) {
      setStatusMessage('Todos los campos son obligatorios para guardar el invitado.')
      return
    }

    if (editingId !== null) {
      setGuests((current) =>
        current.map((guest) =>
          guest.id === editingId ? { ...guest, ...normalizedForm } : guest,
        ),
      )
      setStatusMessage(
        `${normalizedForm.childName} ${normalizedForm.childLastName} fue actualizado correctamente.`,
      )
    } else {
      setGuests((current) => [
        {
          id: Date.now(),
          ...normalizedForm,
        },
        ...current,
      ])
      setStatusMessage(
        `${normalizedForm.childName} ${normalizedForm.childLastName} quedo confirmado para la fiesta.`,
      )
    }

    resetForm()
  }

  const handleEdit = (guest) => {
    setEditingId(guest.id)
    setForm({
      childName: guest.childName,
      childLastName: guest.childLastName,
      parentName: guest.parentName,
      parentLastName: guest.parentLastName,
    })
    setStatusMessage(
      `Editando a ${guest.childName} ${guest.childLastName}. Ajusta los datos y guarda.`,
    )
  }

  const handleDelete = (guestId) => {
    const guestToDelete = guests.find((guest) => guest.id === guestId)
    setGuests((current) => current.filter((guest) => guest.id !== guestId))

    if (editingId === guestId) {
      resetForm()
    }

    if (guestToDelete) {
      setStatusMessage(
        `${guestToDelete.childName} ${guestToDelete.childLastName} fue eliminado de la lista.`,
      )
    }
  }

  const whatsappUrl = (guest) => {
    const message = `Hola, confirmo la asistencia de ${guest.childName} ${guest.childLastName} a la fiesta de ${eventDetails.honoree} el ${eventDetails.date} a las ${eventDetails.time} en ${eventDetails.place}.`
    return `https://wa.me/?text=${encodeURIComponent(message)}`
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Cumpleanos Aracnido</p>
          <h1>{eventDetails.honoree}</h1>
          <p className="hero-text">
            Celebra sus {eventDetails.age} anos con una aventura inspirada en
            Spidey y sus amigos, ahora protagonizada por las mejores fotos del
            cumpleanero.
          </p>

          <div className="hero-badges" aria-label="Resumen del evento">
            <article>
              <strong>Fecha</strong>
              <span>{eventDetails.date}</span>
            </article>
            <article>
              <strong>Hora</strong>
              <span>{eventDetails.time}</span>
            </article>
            <article>
              <strong>Lugar</strong>
              <span>{eventDetails.place}</span>
            </article>
            <article>
              <strong>Confirmados</strong>
              <span>{totalGuests} invitados</span>
            </article>
          </div>

          <a
            className="whatsapp-hero"
            href={`https://wa.me/?text=${encodeURIComponent(
              `Hola, quiero confirmar asistencia a la fiesta de ${eventDetails.honoree} el ${eventDetails.date} a las ${eventDetails.time} en ${eventDetails.place}.`,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Confirmar asistencia por WhatsApp
          </a>

          <article className="panel hero-form-panel">
            <div className="panel-heading">
              <p className="eyebrow">Registro</p>
              <h2>{editingId !== null ? 'Editar invitado' : 'Agregar invitado'}</h2>
              <p>{statusMessage}</p>
            </div>

            <form className="invite-form" onSubmit={handleSubmit}>
              <label>
                Nombre del nino invitado
                <input
                  name="childName"
                  value={form.childName}
                  onChange={handleChange}
                  placeholder="Ej. Tomas"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label>
                Apellido del nino invitado
                <input
                  name="childLastName"
                  value={form.childLastName}
                  onChange={handleChange}
                  placeholder="Ej. Martinez"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label>
                Nombre del padre o madre
                <input
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="Ej. Laura"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Apellido del padre o madre
                <input
                  name="parentLastName"
                  value={form.parentLastName}
                  onChange={handleChange}
                  placeholder="Ej. Gomez"
                  autoComplete="family-name"
                  required
                />
              </label>

              <div className="form-actions">
                <button type="submit">
                  {editingId !== null ? 'Guardar cambios' : 'Guardar invitado'}
                </button>
                {editingId !== null ? (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancelar edicion
                  </button>
                ) : null}
              </div>
            </form>
          </article>
        </div>

        <div className="birthday-gallery">
          <article className="featured-photo-card">
            <img
              className="featured-photo"
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
            />
            <div className="featured-photo-overlay">
              <p className="eyebrow">Protagonista</p>
              <strong>{selectedPhoto.label}</strong>
              <span>Joaquin en su mejor version para celebrar los 4 anos.</span>
            </div>
          </article>

          <div className="thumbnail-strip" aria-label="Galeria del cumpleanero">
            {birthdayPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className={`thumbnail-button${
                  photo.id === selectedPhoto.id ? ' is-active' : ''
                }`}
                onClick={() => setSelectedPhotoId(photo.id)}
                aria-label={photo.label}
              >
                <img src={photo.src} alt={photo.alt} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel memories-panel">
        <div className="panel-heading">
          <p className="eyebrow">Momentos de Joaquin</p>
          <h2>Una galeria dinamica para su gran dia</h2>
          <p>
            Selecciona una foto principal arriba y recorre este collage con
            escenas tiernas, divertidas y aventureras del cumpleanero.
          </p>
        </div>

        <div className="memories-grid">
          {birthdayPhotos.map((photo, index) => (
            <article
              key={photo.id}
              className={`memory-card memory-card-${(index % 5) + 1}`}
            >
              <img src={photo.src} alt={photo.alt} />
              <div className="memory-caption">
                <strong>{photo.label}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <aside className="panel list-panel">
          <div className="panel-heading">
            <p className="eyebrow">CRUD de invitados</p>
            <h2>Lista de confirmados</h2>
            <p>
              Puedes crear, editar, eliminar y compartir cada invitacion desde la
              misma pantalla.
            </p>
          </div>

          <div className="guest-list">
            {guests.map((guest) => (
              <article className="guest-card" key={guest.id}>
                <div className="guest-summary">
                  <div>
                    <p className="guest-label">Invitado</p>
                    <strong>
                      {guest.childName} {guest.childLastName}
                    </strong>
                  </div>
                  <div>
                    <p className="guest-label">Adulto responsable</p>
                    <span>
                      {guest.parentName} {guest.parentLastName}
                    </span>
                  </div>
                </div>

                <div className="guest-actions">
                  <button
                    className="action-button edit-button"
                    type="button"
                    onClick={() => handleEdit(guest)}
                  >
                    Editar
                  </button>
                  <button
                    className="action-button delete-button"
                    type="button"
                    onClick={() => handleDelete(guest.id)}
                  >
                    Eliminar
                  </button>
                  <a
                    className="action-button whatsapp-button"
                    href={whatsappUrl(guest)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <article className="panel info-panel">
          <div className="panel-heading">
            <p className="eyebrow">Detalles del evento</p>
            <h2>Todo listo para la fiesta</h2>
            <p>
              Usa el formulario de arriba para registrar invitados y aqui revisa
              rapidamente la informacion general del cumpleanos.
            </p>
          </div>

          <div className="event-summary-cards">
            <article>
              <strong>Fecha</strong>
              <span>{eventDetails.date}</span>
            </article>
            <article>
              <strong>Hora</strong>
              <span>{eventDetails.time}</span>
            </article>
            <article>
              <strong>Lugar</strong>
              <span>{eventDetails.place}</span>
            </article>
            <article>
              <strong>Tema</strong>
              <span>Spidey y sus amigos con galeria del cumpleanero</span>
            </article>
          </div>
        </article>
      </section>

      <section className="panel deploy-panel">
        <div className="panel-heading">
          <p className="eyebrow">Despliegue</p>
          <h2>Lista para publicarse gratis</h2>
          <p>
            El proyecto quedo preparado como una app React con Vite, por lo que
            se puede subir facilmente a un servicio gratuito.
          </p>
        </div>

        <ol className="deploy-steps">
          <li>Instala Node.js en tu equipo si aun no lo tienes.</li>
          <li>Ejecuta <code>npm install</code> y luego <code>npm run build</code>.</li>
          <li>Sube el repositorio a GitHub.</li>
          <li>Importa el repositorio en Vercel y despliega el proyecto.</li>
        </ol>
      </section>
    </main>
  )
}

export default App
