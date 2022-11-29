import Image from 'next/image'
import Layout from '../components/layout'
import styles from '../styles/nosotros.module.css'

export default function Nosotros() {
  return (
    <Layout
      title={'Nosotros'}
      description='Sobre nosotrs, GuitarLA, tienda de música'
    >
     <main className='contenedor'>
    <h1 className='heading'>Nosotros</h1>

      <div className={styles.contenido}>
      <Image src='/img/nosotros.jpg' width={1000} height={800} alt='Imagen sobre nosotros'/>
        <div>
          <p>
          Esse eu minim ut mollit est qui irure quis. Occaecat cillum incididunt anim 
          pariatur ex magna amet incididunt ea fugiat qui. Deserunt dolore labore 
          cupidatat ea deserunt do ipsum Lorem veniam. Anim reprehenderit consequat aliquip 
          consequat in exercitation duis voluptate irure Lorem. Eu esse nisi anim cupidatat
           deserunt nulla enim tempor ipsum duis dolore.
           cupidatat ea deserunt do ipsum Lorem veniam. Anim reprehenderit consequat aliquip 
          consequat in exercitation duis voluptate irure Lorem. Eu esse nisi anim cupidatat
           deserunt nulla enim tempor ipsum duis dolore.
          
      
          Esse eu minim ut mollit est qui irure quis. Occaecat cillum incididunt anim 
          pariatur ex magna amet incididunt ea fugiat qui. Deserunt dolore labore 
          
          </p>

        </div>
      </div>
     </main>
    </Layout>
  )
}
