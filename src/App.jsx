import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing          from './pages/Landing'
import RoleSelect       from './pages/RoleSelect'
import Login            from './pages/Login'
import Home             from './pages/Home'
import CreateEvent      from './pages/CreateEvent'
import Weddings         from './pages/Weddings'
import Birthdays        from './pages/Birthdays'
import Gallery          from './pages/Gallery'
import InvitationEditor from './pages/InvitationEditor'
import InvitationSite   from './pages/InvitationSite'
import BirthdayEditor   from './pages/BirthdayEditor'
import BirthdaySite     from './pages/BirthdaySite'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Landing />} />
        <Route path="/select-role"         element={<RoleSelect />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/home"                element={<Home />} />
        <Route path="/create-event"        element={<CreateEvent />} />
        <Route path="/weddings"            element={<Weddings />} />
        <Route path="/birthdays"           element={<Birthdays />} />
        <Route path="/gallery"             element={<Gallery />} />
        <Route path="/weddings/editor/:id"  element={<InvitationEditor />} />
        <Route path="/invite/:id"           element={<InvitationSite />} />
        <Route path="/birthdays/editor/:id" element={<BirthdayEditor />} />
        <Route path="/birthday/:id"         element={<BirthdaySite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
