import { useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/guitarras.module.css'
import Layout from "../../components/layout"

export default function Producto({guitarra, agregarCarrito}) {

  const [cantidad, setCantidad] = useState(0)
  const {nombre, descripcion, imagen, precio } = guitarra[0].attributes


  const handleCantidad = (e ,guitarra) => {
    setCantidad(parseInt(e.target.value))
  }

  const handleSubmit = e => {
    e.preventDefault()

    if(cantidad < 1) {
      alert('Cantidad no valida')
      return
    }

    //Construir objeto para almacenar en local storage
    const guitarraSeleccionada = {
      nombre,
      precio,
      cantidad,
      id: guitarra[0].id,
      imagen: imagen.data.attributes.url,
    }

    //Pasar la informacion a context
    agregarCarrito(guitarraSeleccionada)

    if(guitarraSeleccionada.cantidad > 1){
      alert(`Se agregaron ${guitarraSeleccionada.cantidad} guitarras ${guitarraSeleccionada.nombre} al carrito`)
    }else {
        alert(`Se agregó ${guitarraSeleccionada.cantidad} guitarra ${guitarraSeleccionada.nombre} al carrito`)
    }
  }


  return (
    <Layout
      title={`Guitarra ${nombre}`}
    >
      <div className={styles.guitarra}>
        <Image src={imagen.data.attributes.url} width={600} height={400} alt={`Imagen guitarra ${nombre}`} />
        
        <div className={styles.contenido}>
          <h3>{nombre}</h3>
          <p className={styles.descripcion}>{descripcion}</p>
          <p className={styles.precio}>${precio}</p>

          <form
            onSubmit={handleSubmit} 
            className={styles.formulario}
          >
            <label htmlFor='cantidad'>Cantidad:</label>

            <select 
              id='cantidad'
              onChange={handleCantidad}
            >
              <option value='0'>--Seleccione--</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
            <input
              type='submit'
              value='Agregar al carrito'
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const respuesta = await fetch(`${process.env.API_URL}/api/guitarras`)
  const { data } = await respuesta.json()

  const paths = data.map(guitarra => ({
    params: {
      url: guitarra.attributes.url
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({params: {url}}) {
  const respuesta = await fetch(`${process.env.API_URL}/api/guitarras?filters[url]=${url}&populate=imagen`)
  const {data : guitarra} = await respuesta.json()
  return {
    props: {
      guitarra
    }
  }
} 

// export async function getServerSideProps({query: {url}}) {
//   console.log(url)
//   const respuesta = await fetch(`${process.env.API_URL}/api/guitarras?filters[url]=${url}&populate=imagen`)  // /guitarras?filters[url]=${url}&populate=imagen
//   const {data: guitarra} = await respuesta.json()
//   return {
//     props: {
//       guitarra
//     }
//   }
// }