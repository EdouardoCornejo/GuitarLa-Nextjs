import Link from "next/link"
import Layout from "../components/layout"

export default function Pagina404() {
  return (
    <Layout
        title={'Pagina no encontrada'}
    >

       <p className="error"> Pagina no encontrada</p>
       <Link href='/' className="error-enlace">
        <p > 
            Ir a Inicio
        </p>
       </Link>
    
    </Layout>
  )
}
