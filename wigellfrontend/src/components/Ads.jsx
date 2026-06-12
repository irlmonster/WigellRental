import { useState, useEffect } from 'react'
import '../styles/Ads.css'

export default function Ads() {
  // Tre olika sets av annonser
  const ads1 = [
    {
      title: 'Hyra bil i 5 dagar?',
      text: 'Betala bara för 7! Mycket bro pris, kompis!',
    },
    {
      title: 'WigellKörven™',
      text: 'Få en WigellKörv när du hämtar bilen. Max 47 per kund.',
    },
    {
      title: 'Wigell Trygg Premium Ultra™',
      text: 'Lägg till trygghetsförsäkring från 9999 kr/dygn. Helt rimligt.',
    },
  ]

  const ads2 = [
    {
      title: 'Nya elbilar!',
      text: 'WigellPower™ Fleet, mer ström än elnätet i Sundsvall.',
    },
    {
      title: 'Wigell Klimatbonus™',
      text: 'För varje mil du kör donerar vi en tanke.',
    },
    {
      title: 'Miljösmart hyrning',
      text: 'Hyr en bil när du egentligen borde cykla.',
    },
  ]

  const ads3 = [
    {
      title: 'VIP-kund',
      text: 'Hoppa före kön. Ja, även framför personalen.',
    },
    {
      title: 'WigellPoints™',
      text: 'Samla poäng. Lös in mot… mer poäng. Fantastiskt värde.',
    },
    {
      title: 'Klimatkompensering?',
      text: 'Vi skickar en GIF på ett träd till din mail.',
    },
  ]

  // Tre olika index states
  const [i1, setI1] = useState(0)
  const [i2, setI2] = useState(0)
  const [i3, setI3] = useState(0)

  // Tre olika fade states
  const [f1, setF1] = useState(true)
  const [f2, setF2] = useState(true)
  const [f3, setF3] = useState(true)

  // Funktion för rotering
  const setupRotation = (setFade, setIndex, arrayLength) => {
    return setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex(prev => (prev + 1) % arrayLength)
        setFade(true)
      }, 300)
    }, 5000)
  }

  useEffect(() => {
    const r1 = setupRotation(setF1, setI1, ads1.length)
    const r2 = setupRotation(setF2, setI2, ads2.length)
    const r3 = setupRotation(setF3, setI3, ads3.length)

    return () => {
      clearInterval(r1)
      clearInterval(r2)
      clearInterval(r3)
    }
  }, [ads1.length, ads2.length, ads3.length])

  return (
    <div className="ads-box">
      {/* BOX 1 */}
      <div className={`ads-card ${f1 ? 'fade-in' : 'fade-out'}`}>
        <h4>{ads1[i1].title}</h4>
        <p>{ads1[i1].text}</p>
      </div>

      {/* BOX 2 */}
      <div className={`ads-card ${f2 ? 'fade-in' : 'fade-out'}`}>
        <h4>{ads2[i2].title}</h4>
        <p>{ads2[i2].text}</p>
      </div>

      {/* BOX 3 */}
      <div className={`ads-card ${f3 ? 'fade-in' : 'fade-out'}`}>
        <h4>{ads3[i3].title}</h4>
        <p>{ads3[i3].text}</p>
      </div>
    </div>
  )
}
