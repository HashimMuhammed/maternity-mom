'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MapPin, Plus, Trash2, Edit2, ShieldAlert, Heart, Navigation, Check } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId } from '../utils/helpers'

export default function EmergencyContacts() {
  const [contacts, setContacts] = useLocalStorage('mamabear-emergency-contacts', [
    {
      id: 'c1',
      role: 'Lead Obstetrician (OB-GYN)',
      name: 'Dr. Sarah Mathews',
      phone: '+919876543210',
      hospital: 'City Maternity & Child Hospital',
      isPrimary: true,
    },
    {
      id: 'c2',
      role: 'Hospital Labor Ward / Emergency',
      name: 'Maternity Triage Desk',
      phone: '+919876500000',
      hospital: 'Apollo Cradle Hospital, Room 204',
      isPrimary: true,
    },
    {
      id: 'c3',
      role: 'Birth Partner / Husband',
      name: 'Alex',
      phone: '+919811122233',
      hospital: '',
      isPrimary: false,
    }
  ])

  const [medicalCard, setMedicalCard] = useLocalStorage('mamabear-medical-card', {
    bloodGroup: 'O Positive (O+)',
    allergies: 'Penicillin (mild)',
    rhFactor: 'Rh Positive',
    gbsStatus: 'Negative',
    hospitalAddress: 'City Maternity Hospital, Block B, Ring Road',
  })

  const [isAdding, setIsAdding] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newHospital, setNewHospital] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim()) return

    const newContact = {
      id: generateId(),
      role: newRole.trim() || 'Emergency Contact',
      name: newName.trim(),
      phone: newPhone.trim(),
      hospital: newHospital.trim(),
      isPrimary: false,
    }

    setContacts([...contacts, newContact])
    setIsAdding(false)
    setNewName('')
    setNewPhone('')
    setNewRole('')
    setNewHospital('')
  }

  const handleDelete = (id) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Emergency & Care Team 🚨" 
        subtitle="Instant one-tap dialing for labor & medical urgencies"
        showBack={true}
        rightAction={
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-2 rounded-xl gradient-primary text-white shadow-md shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* Emergency Hotline Alert */}
      <div className="mt-4 p-4 rounded-3xl bg-rose-500 text-white shadow-xl shadow-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl animate-pulse-soft">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm">Emergency Ambulance: 112 / 108</div>
            <div className="text-xs text-white/90">24/7 National Emergency Medical Response</div>
          </div>
        </div>
        <a
          href="tel:112"
          className="px-3.5 py-2 rounded-xl bg-white text-rose-600 font-bold text-xs flex items-center gap-1 shadow hover:bg-slate-50"
        >
          <Phone className="w-3.5 h-3.5 fill-rose-600" /> Dial 112
        </a>
      </div>

      {/* Quick Medical Summary Card */}
      <div className="mt-4 glass-card rounded-3xl p-5 border border-primary-200">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-primary-500" /> Essential Medical Info For Triage
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-2xl">
            <span className="text-slate-400 block text-[10px]">Blood Group:</span>
            <span className="font-bold text-slate-800">{medicalCard.bloodGroup}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl">
            <span className="text-slate-400 block text-[10px]">Rh Factor:</span>
            <span className="font-bold text-slate-800">{medicalCard.rhFactor}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl">
            <span className="text-slate-400 block text-[10px]">Known Allergies:</span>
            <span className="font-bold text-rose-600">{medicalCard.allergies}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl">
            <span className="text-slate-400 block text-[10px]">GBS Status:</span>
            <span className="font-bold text-slate-800">{medicalCard.gbsStatus}</span>
          </div>
        </div>

        {/* Hospital Address with Google Maps link */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 truncate pr-2">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span className="truncate">{medicalCard.hospitalAddress}</span>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(medicalCard.hospitalAddress)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 text-primary-600 font-bold flex items-center gap-1 hover:underline"
          >
            <Navigation className="w-3.5 h-3.5" /> Navigate
          </a>
        </div>
      </div>

      {/* Add Contact Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mt-4 glass-card rounded-3xl p-5 border-2 border-primary-200"
          >
            <h3 className="font-bold text-sm text-slate-800 mb-3">Add Care Provider / Contact</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Role (e.g. Doula, Midwife, Pediatrician)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="input-field text-xs py-2.5"
              />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field text-xs py-2.5"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number (e.g. +91 9876543210)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="input-field text-xs py-2.5"
              />
              <input
                type="text"
                placeholder="Hospital / Clinic Name (optional)"
                value={newHospital}
                onChange={(e) => setNewHospital(e.target.value)}
                className="input-field text-xs py-2.5"
              />

              <div className="flex gap-2 pt-1">
                <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                  Save Contact
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Contacts List */}
      <div className="mt-5 space-y-3">
        <h2 className="section-title">Your Medical Team & Contacts</h2>

        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            layout
            className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover border border-slate-100"
          >
            <div className="flex-1 pr-3">
              <span className="badge bg-primary-50 text-primary-700 text-[10px] font-bold py-0.5 px-2 mb-1">
                {contact.role}
              </span>
              <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
              {contact.hospital && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{contact.hospital}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="p-3 rounded-2xl bg-mint-500 hover:bg-mint-600 text-white shadow-md shadow-mint-500/20 active:scale-90 transition-transform"
                title="Call Now"
              >
                <Phone className="w-4 h-4 fill-white" />
              </a>
              <button
                onClick={() => handleDelete(contact.id)}
                className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

