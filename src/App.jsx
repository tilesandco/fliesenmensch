import { useEffect, useState } from 'react';
import CursorGrid from './CursorGrid.jsx';

const slides = [
  { src: '/IMG_0943.jpg', alt: 'Moderne Fliesenarbeit', label: 'Innenausbau' },
  { src: '/fliesen_maler.jpg', alt: 'Fliesenfassade und Fliesenhandwerk', label: 'Fassade' },
  { src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', alt: 'Hochwertige Oberflächen und Materialmix', label: 'Oberflächen' }
];

const services = [
  { number: '01', title: 'Arbeit nach Maß', text: 'Präzise Verlegung von Boden- und Wandfliesen mit Fokus auf saubere Linien, exakte Fugen und langlebige Qualität.' },
  { number: '02', title: 'Abdichten nach DIN-Norm 18534', text: 'Ein ganzheitliches Abdichtsystem erfordert höchste Qualitätsanforderungen bei der Verarbeitung und Langlebigkeit.' },
  { number: '03', title: 'Beratung', text: 'Innovative Lösungen für Altbau, Modernisierung und Detailarbeiten mit Blick auf Funktion, Haltbarkeit und Ästhetik.' }
];

const gallery = [
  { src: '/fliesenoptik_marmor_drei.jpg', alt: 'Marmoroptik im WC', caption: 'Marmorino WC' },
  { src: '/marmor_zylinder.jpg', alt: 'Zylindrische Fliesenarbeit', caption: 'Zylindrisch' },
  { src: '/fliesenoptik_marmor.jpg', alt: 'Marmoroptik im Bad', caption: 'Marmorino Bad' },
  { src: '/marmor_klein.jpg', alt: 'Mosaikfliesen', caption: 'Mosaik' },
  { src: '/IMG_0943.jpg', alt: 'Großformatige Fliesen', caption: 'Großformat' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9898d890f0fb?auto=format&fit=crop&w=900&q=80', alt: 'Natursteinprojekt', caption: 'Naturstein' },
  { src: '/IMG_1605.jpg', alt: 'Bad mit Spiegel', caption: 'Bad mit Spiegel' },
  { src: '/IMG_1606.jpg', alt: 'Dusche und Badewanne', caption: 'Dusche & Badewanne' }
];

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <>
      <header>
        <nav className="nav">
          <a className="logo" href="#home" aria-label="Fliesenmensch Startseite">
            <span className="logo-box" aria-hidden="true" />
            <span>fliesenmensch.</span>
          </a>
          <ul className="menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#werke">Über</a></li>
            <li><a href="#kompetenz">Kompetenz</a></li>
          </ul>
        </nav>
      </header>

      <main className="hero" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
        <CursorGrid cellSize={64} radius={155} color="196, 138, 94" gridOpacity={0.07} fillOpacity={0.16} />
        <div className="hero-text" style={{ position: 'relative', zIndex: 1 }}>
          <h1>Fliesen.<br />Fliesen.<br />Fliesen.</h1>
          <p>Fliesen, Marmor &amp; Steine sind für die Ewigkeit – deshalb braucht das Handwerk echte Präzision und vorausschauende Planung bis zur letzten Fuge.</p>
        </div>
        <div className="hero-image" style={{ position: 'relative', zIndex: 1 }}>
          <div className="image-placeholder" role="img" aria-label="Marmor- und Travertinfliesen" />
        </div>
      </main>

      <section className="slider-section" aria-label="Projekt-Slider" id="werke">
        <div className="slider-card">
          <div className="slider-panel">
            <div className="slides">
              {slides.map((slide, index) => (
                <div className={`slide ${index === activeSlide ? 'active' : ''}`} key={slide.alt}>
                  <img src={slide.src} alt={slide.alt} />
                </div>
              ))}
            </div>
            <div className="slide-meta"><span className="meta-badge">Rückblick</span><span className="meta-label">{slides[activeSlide].label}</span></div>
            <div className="slider-controls">
              <button className="nav-btn" type="button" aria-label="Vorheriges Bild" onClick={() => changeSlide(-1)}>&#8249;</button>
              <button className="nav-btn" type="button" aria-label="Nächstes Bild" onClick={() => changeSlide(1)}>&#8250;</button>
            </div>
          </div>
          <div className="text-panel">
            <div className="text-box">
              <span className="eyebrow">Meine Werke</span>
              <h2>Fliesenhandwerk.</h2>
              <p>Hochwertige Materialien, präzise Verarbeitung und eine ruhige, zeitlose Ästhetik. Jede Fläche wird so geplant, dass sie nicht nur schön wirkt, sondern auch langfristig überzeugt.</p>
              <div className="feature-list"><span className="feature-item">Maß</span><span className="feature-item">Handwerk</span><span className="feature-item">Details</span></div>
              <div className="cta-row"><a href="#kompetenz" className="btn primary">Mehr erfahren</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="competence-section" aria-label="Kompetenzbereich" id="kompetenz">
        <div className="competence-header"><span className="eyebrow">Kompetenz</span><h2>Arbeitsweise</h2></div>
        <div className="competence-grid">
          {services.map((service) => (
            <article className="competence-card" key={service.number}>
              <div className="competence-number">{service.number}</div><h3>{service.title}</h3><p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reuse-section" id="wiederaufnahmesystem" aria-labelledby="reuse-heading">
        <div className="reuse-panel">
          <div className="reuse-content">
            <span className="eyebrow">Flexibel gestalten</span>
            <h2 id="reuse-heading">Fliesen, die mit dem Standort weiterziehen.</h2>
            <p className="reuse-intro">Ein Fliesenwiederaufnahmesystem eröffnet neue Möglichkeiten für temporäre und wechselnde Flächen. Es eignet sich besonders für Läden, Ausstellungen und Pop-up-Stores, in denen Gestaltung flexibel bleiben und sich an neue Konzepte anpassen soll.</p>
            <div className="reuse-benefits">
              <article className="reuse-benefit"><h3>Für wechselnde Konzepte</h3><p>Eine passende Lösung, wenn Verkaufsflächen oder Präsentationen regelmäßig neu gestaltet werden.</p></article>
              <article className="reuse-benefit"><h3>Für starke Auftritte</h3><p>Fliesen bringen Materialität und eine hochwertige Anmutung in Ladenbau, Showroom und Ausstellung.</p></article>
              <article className="reuse-benefit"><h3>Gemeinsam geplant</h3><p>Format, Fläche und Einsatz werden auf das jeweilige Projekt und die Anforderungen vor Ort abgestimmt.</p></article>
            </div>
            <div className="cta-row"><a href="mailto:?subject=Anfrage%20Fliesenwiederaufnahmesystem" className="btn secondary">Projekt besprechen</a></div>
            <p className="reuse-note">Die konkrete Wiederaufnahme und Wiederverwendung hängen vom gewählten System, dem Untergrund und den Einsatzbedingungen ab und werden projektbezogen geprüft.</p>
          </div>
        </div>
      </section>

      <section className="gallery-section" aria-label="Bildergalerie">
        <div className="gallery-header"><span className="eyebrow">Portfolio</span><h2>Einblicke</h2></div>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <figure className="gallery-card" key={item.caption}>
              <div className="gallery-image"><img src={item.src} alt={item.alt} loading="lazy" /></div>
              <figcaption className="gallery-caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="typewriter-section" aria-label="Handwerk mit Charakter">
        <div className="typewriter-panel"><div className="typewriter-content"><div className="typewriter-box">
          <span className="eyebrow">Handwerk mit Charakter</span>
          <h2 className="typewriter-text">Ich schaffe Lebensraum.</h2>
          <p>Präzision, Materialgefühl und eine ruhige Ästhetik geben jedem Raum eine eigene Atmosphäre – langlebig, hochwertig und bis in die letzte Fuge durchdacht.</p>
          <div className="cta-row"><a href="mailto:?subject=Termin%20vereinbaren" className="btn primary">Termin vereinbaren</a><a href="#werke" className="btn secondary">Projekt ansehen</a></div>
        </div></div></div>
      </section>
    </>
  );
}
