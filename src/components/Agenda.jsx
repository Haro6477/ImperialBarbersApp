import React, { useState } from 'react'

const Agenda = () => {
  const [loading, setLoading] = useState(true)

  return (
    <div className='container'>
      <a className='btn btn-warning text-white my-2' target='_blank' href="https://calendar.google.com/calendar/u/0?cid=YWxpdmUzMDEwMjBAZ21haWwuY29t"><strong>Abrir calendario</strong> </a>
      <div className="mb-5 px-3 py-3 bg-light rounded shadow-sm">
        {loading &&
          <div className="position-absolute top-50 start-50">
            <i className="fa-solid fa-calendar-days fa-beat-fade fa-2xl"></i>
          </div>
        }
        <iframe onLoad={() => setLoading(false)} className='w-100' style={{ height: '600px' }} src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=America%2FMexico_City&showTitle=0&showNav=1&showPrint=0&showTabs=1&mode=WEEK&hl=es_419&src=YWxpdmUzMDEwMjBAZ21haWwuY29t&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZXMubWV4aWNhbiNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23D50000&color=%238E24AA&color=%230B8043" ></iframe>
      </div>
    </div>
  )
}

export default Agenda