import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { RecoilRoot } from 'recoil'
import RoutePage from './components/Routes'

function App() {
  return (
    <RecoilRoot>
      <RoutePage />
    </RecoilRoot>
  )
}

export default App
