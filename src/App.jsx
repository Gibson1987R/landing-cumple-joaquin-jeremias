import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, db, facebookProvider, firebaseReady, googleProvider } from './firebase'

const eventDetails = {
  honoree: 'Joaquin Jeremias Rosales Perez',
  age: 4,
  date: 'Sabado 25 de abril de 2026',
  time: '3:00 p. m.',
  place:
    'En nuestro Salon de Clases, Fiestas y Aventuras; en el Centro Educativo Aprendo Jugando',
}

const spideyStickers = [
  {
    id: 1,
    src: 'https://image.tmdb.org/t/p/original/vzeSGXStZVZpSZV5p9Hy39r8x3o.jpg',
    label: 'Mision pastel',
  },
  {
    id: 2,
    src: 'https://image.tmdb.org/t/p/original/yoyKcHIlTk00SFxbx7N4vWpWQHx.jpg',
    label: 'Equipo arana',
  },
  {
    id: 3,
    src: 'https://image.tmdb.org/t/p/original/30gQXSUuLWJ4VvuRCmWvFfQNh8U.jpg',
    label: 'Aventura en accion',
  },
]

const sayingsRows = [
  [
    'Mio mi Joaquin',
    'La Guaaaan',
    'Liht',
    'El Spider',
  ],
  [
    'La cierra cuerta',
    'para que',
    'Tope Tope Ton',
    'Robet de la Escalera',
  ],
  [
    'Armas matan',
    'Subo a las paredes',
    'Beso a la boco',
    'Abracho',
  ],
]

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

function App() {
  const [form, setForm] = useState(emptyForm)
  const [guests, setGuests] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [selectedPhotoId, setSelectedPhotoId] = useState(birthdayPhotos[0].id)
  const [lightboxPhotoId, setLightboxPhotoId] = useState(null)
  const [statusMessage, setStatusMessage] = useState(
    'Completa el formulario para registrar a tu invitado. Solo el administrador puede editar o eliminar registros.',
  )
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingGuests, setLoadingGuests] = useState(firebaseReady)

  const totalGuests = guests.length
  const selectedPhoto =
    birthdayPhotos.find((photo) => photo.id === selectedPhotoId) ?? birthdayPhotos[0]
  const lightboxPhoto =
    birthdayPhotos.find((photo) => photo.id === lightboxPhotoId) ?? null

  useEffect(() => {
    if (!firebaseReady || !auth) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (!user || !db) {
        setIsAdmin(false)
        return
      }

      const adminSnapshot = await getDoc(doc(db, 'admins', user.uid))
      setIsAdmin(adminSnapshot.exists())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!firebaseReady || !db) {
      setLoadingGuests(false)
      return undefined
    }

    const guestsQuery = query(collection(db, 'guests'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      guestsQuery,
      (snapshot) => {
        setGuests(
          snapshot.docs.map((guestDoc) => ({
            id: guestDoc.id,
            ...guestDoc.data(),
          })),
        )
        setLoadingGuests(false)
      },
      () => {
        setLoadingGuests(false)
        setStatusMessage(
          'No se pudo cargar la lista. Revisa la configuracion de Firebase y las reglas.',
        )
      },
    )

    return unsubscribe
  }, [])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!firebaseReady || !db) {
      setStatusMessage(
        'Falta configurar Firebase para guardar invitados correctamente.',
      )
      return
    }

    const normalizedForm = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    )

    if (Object.values(normalizedForm).some((value) => !value)) {
      setStatusMessage('Todos los campos son obligatorios para guardar el invitado.')
      return
    }

    if (editingId !== null) {
      if (!isAdmin) {
        setStatusMessage(
          'Solo el administrador puede editar registros existentes.',
        )
        return
      }

      await updateDoc(doc(db, 'guests', editingId), {
        ...normalizedForm,
        updatedAt: serverTimestamp(),
      })
      setStatusMessage(
        `${normalizedForm.childName} ${normalizedForm.childLastName} fue actualizado correctamente.`,
      )
    } else {
      await addDoc(collection(db, 'guests'), {
        ...normalizedForm,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setStatusMessage(
        `${normalizedForm.childName} ${normalizedForm.childLastName} quedo confirmado para la fiesta.`,
      )
    }

    resetForm()
  }

  const handleEdit = (guest) => {
    if (!isAdmin) {
      return
    }

    setEditingId(guest.id)
    setForm({
      childName: guest.childName ?? '',
      childLastName: guest.childLastName ?? '',
      parentName: guest.parentName ?? '',
      parentLastName: guest.parentLastName ?? '',
    })
    setStatusMessage(
      `Editando a ${guest.childName} ${guest.childLastName}. Ajusta los datos y guarda.`,
    )
  }

  const handleDelete = async (guestId) => {
    if (!firebaseReady || !db || !isAdmin) {
      return
    }

    const guestToDelete = guests.find((guest) => guest.id === guestId)
    await deleteDoc(doc(db, 'guests', guestId))

    if (editingId === guestId) {
      resetForm()
    }

    if (guestToDelete) {
      setStatusMessage(
        `${guestToDelete.childName} ${guestToDelete.childLastName} fue eliminado de la lista.`,
      )
    }
  }

  const signIn = async (provider) => {
    if (!auth) {
      return
    }

    try {
      await signInWithPopup(auth, provider)
      setStatusMessage(
        'Sesion iniciada. Si tu usuario esta en la coleccion admins, ya puedes administrar invitados.',
      )
    } catch {
      setStatusMessage('No se pudo iniciar sesion. Revisa la configuracion del proveedor.')
    }
  }

  const handleSignOut = async () => {
    if (!auth) {
      return
    }

    await signOut(auth)
    setIsAdmin(false)
    setEditingId(null)
    setForm(emptyForm)
    setStatusMessage('Sesion cerrada.')
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
            Spidey y sus amigos, con una invitacion pensada para compartir sus
            mejores fotos y permitir que cada familia confirme su asistencia con
            claridad.
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

          <div className="auth-panel">
            <div className="auth-copy">
              <strong>Acceso de administradores</strong>
              <span>
                {!firebaseReady
                  ? 'Falta configurar Firebase en las variables de entorno.'
                  : currentUser
                    ? isAdmin
                      ? `Sesion activa como ${currentUser.email}.`
                      : `Sesion activa como ${currentUser.email}, pero sin permisos de administrador.`
                    : 'Los invitados pueden registrarse sin iniciar sesion. Google o Facebook solo se usan para administracion.'}
              </span>
            </div>

            <div className="auth-actions">
              <button type="button" onClick={() => signIn(googleProvider)}>
                Entrar con Google
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => signIn(facebookProvider)}
              >
                Entrar con Facebook
              </button>
              {currentUser ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleSignOut}
                >
                  Cerrar sesion
                </button>
              ) : null}
            </div>
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
              onClick={() => setLightboxPhotoId(selectedPhoto.id)}
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
                onClick={() => {
                  setSelectedPhotoId(photo.id)
                  setLightboxPhotoId(photo.id)
                }}
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
              onClick={() => setLightboxPhotoId(photo.id)}
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
              {loadingGuests
                ? 'Cargando invitados confirmados...'
                : 'Los invitados pueden registrarse y ver esta lista. Solo el administrador puede editar o eliminar registros.'}
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
                {isAdmin ? (
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
                ) : null}
              </article>
            ))}
          </div>
        </aside>

        <article className="panel info-panel">
          <div className="panel-heading">
            <p className="eyebrow">Detalles del evento</p>
            <h2>Todo listo para la celebracion</h2>
            <p>
              Consulta aqui la informacion principal de la fiesta y manten la
              invitacion clara para cada familia.
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
              <span>Spidey y sus amigos con fotos del cumpleanero</span>
            </article>
            <article>
              <strong>Registro</strong>
              <span>Abierto para invitados; administracion protegida</span>
            </article>
          </div>
        </article>
      </section>

      <footer className="panel celebration-footer">
        <div className="footer-copy">
          <p className="eyebrow">Cierre de la invitacion</p>
          <h2>Mis palabritas favoritas tambien llegan a la fiesta</h2>
          <p>
            Spidey y sus amigos ponen la energia. Joaquin pone la chispa, las
            ocurrencias y las frases que hacen unica esta celebracion.
          </p>
        </div>

        <div className="sayings-banner" aria-label="Palabritas de Joaquin">
          {sayingsRows.map((row, rowIndex) => (
            <div
              key={row[0]}
              className={`sayings-track sayings-track-${rowIndex + 1}`}
            >
              {[...row, ...row].map((saying, itemIndex) => (
                <span key={`${saying}-${itemIndex}`}>{saying}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="sticker-row" aria-label="Stickers tematicos de Spidey">
          {spideyStickers.map((sticker) => (
            <article className="sticker-card" key={sticker.id}>
              <img src={sticker.src} alt={sticker.label} />
              <span>{sticker.label}</span>
            </article>
          ))}
        </div>
      </footer>

      {lightboxPhoto ? (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.label}
          onClick={() => setLightboxPhotoId(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxPhotoId(null)}
            aria-label="Cerrar imagen"
          >
            x
          </button>
          <div
            className="lightbox-web lightbox-web-top-left"
            aria-hidden="true"
          ></div>
          <div
            className="lightbox-web lightbox-web-top-right"
            aria-hidden="true"
          ></div>
          <div
            className="lightbox-web lightbox-web-bottom-left"
            aria-hidden="true"
          ></div>
          <div
            className="lightbox-web lightbox-web-bottom-right"
            aria-hidden="true"
          ></div>
          <article
            className="lightbox-card"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={lightboxPhoto.src} alt={lightboxPhoto.alt} />
            <div className="lightbox-caption">
              <strong>{lightboxPhoto.label}</strong>
              <span>Joaquin en un recuerdo especial de su aventura.</span>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  )
}

export default App
