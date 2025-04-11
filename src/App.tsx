import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import EnquiryForm from './pages/EnquiryForm'
import EnquiryDetails from './pages/EnquiryDetails'
import EnquiryList from './pages/EnquiryList'
import EnquiryHistoryDetails from './pages/EnquiryHistoryDetails'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EnquiryForm />} />
          <Route path="/enquiry/:id" element={<EnquiryDetails />} />
          <Route path="/enquiries" element={<EnquiryList />} />
          <Route path="/enquiry/:id/history/:historyId" element={<EnquiryHistoryDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
