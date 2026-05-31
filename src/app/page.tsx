"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-deep: #003876;
          --blue-mid:  #0056A4;
          --blue-light:#1a7fc4;
          --red-sunat: #C8102E;
          --gold:      #F0A500;
          --white:     #FFFFFF;
        }

        body { font-family: 'Barlow', sans-serif; overflow-x: hidden; }

        /* ── NAVBAR ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 70px;
          background: var(--white);
          border-bottom: 3px solid var(--blue-mid);
          box-shadow: ${scrolled ? "0 2px 20px rgba(0,0,0,.12)" : "0 2px 10px rgba(0,0,0,.06)"};
          transition: box-shadow .3s;
        }

        .navbar-logo {
          display: flex; align-items: center; gap: 16px;
          opacity: 0; transform: translateX(-30px);
          transition: opacity .6s ease .1s, transform .6s ease .1s;
        }
        .navbar-logo.show { opacity: 1; transform: translateX(0); }

        .logo-sub {
          font-size: 11px; font-weight: 600; color: var(--blue-mid);
          letter-spacing: 1.5px; text-transform: uppercase;
          display: block;
          border-left: 2px solid #dde4ee;
          padding-left: 16px;
        }

        .navbar-btn {
          opacity: 0; transform: translateX(30px);
          transition: opacity .6s ease .3s, transform .6s ease .3s;
        }
        .navbar-btn.show { opacity: 1; transform: translateX(0); }

        .btn-login {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 28px;
          background: var(--blue-deep);
          border: 2px solid var(--blue-deep);
          border-radius: 6px;
          color: var(--white);
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          transition: background .25s, transform .2s, box-shadow .25s;
          white-space: nowrap;
          box-shadow: 0 2px 12px rgba(0,56,118,.25);
        }
        .btn-login:hover {
          background: var(--blue-mid);
          border-color: var(--blue-mid);
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(0,56,118,.35);
        }

        /* ── HERO ── */
        .hero {
          position: relative; height: 100vh; min-height: 600px;
          display: flex; align-items: center;
          overflow: hidden;
          padding-top: 70px;
        }

        .hero-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(105deg,
              rgba(0,30,70,.93) 0%,
              rgba(0,56,118,.78) 40%,
              rgba(0,86,164,.48) 70%,
              transparent 100%),
            url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80') center/cover no-repeat;
          transform: scale(1.05);
          transition: transform 8s ease-out;
        }
        .hero-bg.show { transform: scale(1); }

        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-accent {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 5px;
          background: linear-gradient(to bottom, var(--red-sunat), var(--blue-light));
        }

        .hero-content {
          position: relative; z-index: 2;
          padding: 0 80px; max-width: 760px;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 100px;
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          color: rgba(255,255,255,.85); text-transform: uppercase;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .6s ease .4s, transform .6s ease .4s;
        }
        .hero-badge.show { opacity: 1; transform: translateY(0); }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(40px, 7vw, 90px);
          font-weight: 800; line-height: .95;
          color: var(--white); text-transform: uppercase;
          letter-spacing: -1px;
          opacity: 0; transform: translateY(40px);
          transition: opacity .7s ease .55s, transform .7s ease .55s;
        }
        .hero-title.show { opacity: 1; transform: translateY(0); }
        .hero-title em { font-style: normal; color: var(--gold); }

        .hero-desc {
          margin-top: 24px;
          font-size: 17px; font-weight: 300; line-height: 1.7;
          color: rgba(255,255,255,.75); max-width: 500px;
          opacity: 0; transform: translateY(30px);
          transition: opacity .7s ease .7s, transform .7s ease .7s;
        }
        .hero-desc.show { opacity: 1; transform: translateY(0); }

        .hero-divider {
          width: 60px; height: 3px; margin: 28px 0;
          background: linear-gradient(to right, var(--gold), var(--red-sunat));
          border-radius: 2px;
          opacity: 0; transform: scaleX(0); transform-origin: left;
          transition: opacity .5s ease .85s, transform .5s ease .85s;
        }
        .hero-divider.show { opacity: 1; transform: scaleX(1); }

        .hero-btns {
          display: flex; gap: 16px; flex-wrap: wrap;
          opacity: 0; transform: translateY(30px);
          transition: opacity .7s ease 1s, transform .7s ease 1s;
        }
        .hero-btns.show { opacity: 1; transform: translateY(0); }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 36px;
          background: var(--gold);
          border: none; border-radius: 6px;
          color: #1a1000;
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; text-decoration: none;
          transition: background .25s, transform .2s, box-shadow .25s;
          box-shadow: 0 4px 20px rgba(240,165,0,.35);
        }
        .btn-primary:hover {
          background: #ffc107;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(240,165,0,.45);
        }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 36px;
          background: transparent;
          border: 2px solid rgba(255,255,255,.4); border-radius: 6px;
          color: var(--white);
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; text-decoration: none;
          transition: background .25s, border-color .25s, transform .2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.8);
          transform: translateY(-2px);
        }

        /* ── STATS BAR ── */
        .stats-bar {
          background: var(--white);
          border-top: 4px solid var(--blue-mid);
          display: flex; justify-content: center;
          padding: 36px 48px; gap: 64px;
          flex-wrap: wrap;
          box-shadow: 0 -4px 30px rgba(0,0,0,.08);
        }

        .stat-item {
          text-align: center;
          opacity: 0; transform: translateY(20px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .stat-item.show { opacity: 1; transform: translateY(0); }
        .stat-item:nth-child(1) { transition-delay: 0s; }
        .stat-item:nth-child(2) { transition-delay: .15s; }
        .stat-item:nth-child(3) { transition-delay: .3s; }

        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 42px; font-weight: 800;
          color: var(--blue-deep); line-height: 1;
        }
        .stat-num span { color: var(--gold); }

        .stat-label {
          font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
          color: #888; text-transform: uppercase; margin-top: 6px;
        }

        /* ── BOTTOM STRIPE ── */
        .bottom-stripe {
          background: var(--blue-deep);
          padding: 20px 48px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .stripe-text { font-size: 13px; color: rgba(255,255,255,.5); letter-spacing: .5px; }
        .stripe-dots { display: flex; gap: 8px; }
        .stripe-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.2); }
        .stripe-dots span:first-child { background: var(--gold); }
        .stripe-dots span:nth-child(2) { background: var(--red-sunat); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; height: 60px; }
          .logo-sub { display: none; }
          .btn-login { padding: 8px 16px; font-size: 12px; gap: 6px; }
          .btn-login svg { display: none; }
          .hero { padding-top: 60px; }
          .hero-content { padding: 0 24px 0 28px; max-width: 100%; }
          .hero-badge { font-size: 9px; padding: 5px 12px; }
          .hero-desc { font-size: 15px; }
          .btn-primary, .btn-secondary { padding: 13px 24px; font-size: 13px; }
          .stats-bar { gap: 32px; padding: 28px 24px; }
          .stat-num { font-size: 32px; }
          .bottom-stripe { padding: 16px 20px; flex-direction: column; align-items: flex-start; }
          .stripe-text { font-size: 11px; }
        }

        @media (max-width: 480px) {
          .hero-btns { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
          .stats-bar { gap: 24px; }
        }
      `}</style>

      {/* ── NAVBAR blanca ── */}
      <nav className="navbar">
        <div className={`navbar-logo ${loaded ? "show" : ""}`}>
          <Image
            src="/logo-sunat.png"
            alt="SUNAT"
            width={130}
            height={40}
            className="object-contain"
            priority
          />
          <span className="logo-sub">Operaciones en Línea</span>
        </div>

        <div className={`navbar-btn ${loaded ? "show" : ""}`}>
          <Link href="/login" className="btn-login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className={`hero-bg ${loaded ? "show" : ""}`} />
        <div className="hero-grid" />
        <div className="hero-accent" />

        <div className="hero-content">
          <div className={`hero-badge ${loaded ? "show" : ""}`}>
            ✦ &nbsp; Sistema Integrado de Recaudación
          </div>

          <h1 className={`hero-title ${loaded ? "show" : ""}`}>
            Tu cumplimiento<br />
            <em>tributario,</em><br />
            sin complicaciones
          </h1>

          <p className={`hero-desc ${loaded ? "show" : ""}`}>
            Gestiona tus declaraciones, guías y consultas fiscales desde un solo lugar,
            de forma rápida, segura y transparente.
          </p>

          <div className={`hero-divider ${loaded ? "show" : ""}`} />

          <div className={`hero-btns ${loaded ? "show" : ""}`}>
            <Link href="/marketing" className="btn-primary">
              Crear Cuenta
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <StatsBar />

      {/* ── BOTTOM STRIPE ── */}
      <div className="bottom-stripe">
        <span className="stripe-text">© 2026 SUNAT — Superintendencia Nacional de Aduanas y de Administración Tributaria</span>
        <div className="stripe-dots">
          <span /><span /><span />
        </div>
      </div>
    </>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { num: "2M", suffix: "+", label: "Contribuyentes Activos" },
    { num: "98", suffix: "%", label: "Transacciones Exitosas" },
    { num: "24", suffix: "/7", label: "Disponibilidad del Sistema" },
  ];

  return (
    <div className="stats-bar" ref={ref}>
      {stats.map((s, i) => (
        <div key={i} className={`stat-item ${vis ? "show" : ""}`}>
          <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
