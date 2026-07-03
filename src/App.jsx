import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Weddings from './pages/Weddings'
import InvitationEditor from './pages/InvitationEditor'
import InvitationSite from './pages/InvitationSite'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/weddings" element={<Weddings />} />
        <Route path="/weddings/editor/:id" element={<InvitationEditor />} />
        <Route path="/invite/:id" element={<InvitationSite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
