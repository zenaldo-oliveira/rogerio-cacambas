import { WhatsAppFlutuante } from './components/WhatsAppFlutuante'
import { useRevelarAoRolar } from './hooks/useRevelarAoRolar'
import { Cacambas } from './sections/Cacambas'
import { Galeria } from './sections/Galeria'
import { Inicio } from './sections/Inicio'
import { Rodape } from './sections/Rodape'
import { Servicos } from './sections/Servicos'
import { Topo } from './sections/Topo'

function App() {
  useRevelarAoRolar()

  return (
    <>
      <Topo />
      <main>
        <Inicio />
        <Servicos />
        <Cacambas />
        <Galeria />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
    </>
  )
}

export default App
