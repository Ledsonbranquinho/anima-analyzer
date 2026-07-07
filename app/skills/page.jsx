"use client";

import { useMemo, useState } from "react";
import skills from "../../data/skills.json";

const TIPOS = ["Todos", ...Array.from(new Set(skills.map((s) => s.tipo)))];

function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function SkillsPage() {
  const [busca, setBusca] = useState("");
  const [tipoAtivo, setTipoAtivo] = useState("Todos");
  const [tagAtiva, setTagAtiva] = useState(null);
  const [aberta, setAberta] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const todasTags = useMemo(
    () => Array.from(new Set(skills.flatMap((s) => s.tags))).sort(),
    []
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return skills.filter((s) => {
      if (tipoAtivo !== "Todos" && s.tipo !== tipoAtivo) return false;
      if (tagAtiva && !s.tags.includes(tagAtiva)) return false;
      if (!termo) return true;
      const alvo = [s.titulo, s.resumo, s.conteudo, s.autor, ...s.tags]
        .join(" ")
        .toLowerCase();
      return alvo.includes(termo);
    });
  }, [busca, tipoAtivo, tagAtiva]);

  async function copiar(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <main className="wrap">
      <header className="hero">
        <div className="brand">
          <span className="mark">SIA</span>
          <span className="brand-name">Sociedade IAnônima</span>
        </div>
        <h1>Swipe File de Skills</h1>
        <p className="sub">
          Biblioteca das skills, prompts, templates e automações que a
          comunidade compartilha. Busque, copie e adapte.
        </p>
        <div className="stats">
          <span>{skills.length} skills documentadas</span>
          <span className="dot">•</span>
          <span>{todasTags.length} tags</span>
        </div>
      </header>

      <section className="controls">
        <input
          className="search"
          type="text"
          placeholder="Buscar por título, conteúdo, tag ou autor…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="tipos">
          {TIPOS.map((t) => (
            <button
              key={t}
              className={`chip ${tipoAtivo === t ? "chip-on" : ""}`}
              onClick={() => setTipoAtivo(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {todasTags.length > 0 && (
          <div className="tags-row">
            {tagAtiva && (
              <button
                className="chip chip-clear"
                onClick={() => setTagAtiva(null)}
              >
                ✕ limpar tag
              </button>
            )}
            {todasTags.map((tag) => (
              <button
                key={tag}
                className={`tag ${tagAtiva === tag ? "tag-on" : ""}`}
                onClick={() => setTagAtiva(tagAtiva === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="grid">
        {filtradas.map((s) => (
          <article
            key={s.id}
            className="card"
            onClick={() => setAberta(s)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setAberta(s)}
          >
            <div className="card-top">
              <span className="badge">{s.tipo}</span>
              <span className="data">{formatarData(s.data)}</span>
            </div>
            <h3>{s.titulo}</h3>
            <p className="resumo">{s.resumo}</p>
            <div className="card-tags">
              {s.tags.map((tag) => (
                <span key={tag} className="mini-tag">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="card-foot">
              <span className="autor">{s.autor}</span>
              <span className="ver">ver skill →</span>
            </div>
          </article>
        ))}
        {filtradas.length === 0 && (
          <div className="empty">
            Nenhuma skill encontrada com esses filtros.
          </div>
        )}
      </section>

      <footer className="foot">
        Sociedade IAnônima · atualizado continuamente pela comunidade
      </footer>

      {aberta && (
        <div className="modal" onClick={() => setAberta(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <div>
                <span className="badge">{aberta.tipo}</span>
                <h2>{aberta.titulo}</h2>
              </div>
              <button className="close" onClick={() => setAberta(null)}>
                ✕
              </button>
            </div>
            <p className="resumo">{aberta.resumo}</p>
            <div className="card-tags">
              {aberta.tags.map((tag) => (
                <span key={tag} className="mini-tag">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="conteudo-box">
              <button
                className="copy"
                onClick={() => copiar(aberta.conteudo)}
              >
                {copiado ? "✓ copiado" : "copiar"}
              </button>
              <pre>{aberta.conteudo}</pre>
            </div>
            <div className="sheet-foot">
              <span>por {aberta.autor}</span>
              {aberta.fonte && (
                <a href={aberta.fonte} target="_blank" rel="noreferrer">
                  fonte original ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          color: #ececf1;
          font-family: "DM Sans", system-ui, sans-serif;
        }
        .hero {
          text-align: center;
          margin-bottom: 40px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }
        .mark {
          font-weight: 800;
          letter-spacing: 1px;
          font-size: 14px;
          background: linear-gradient(135deg, #a78bfa, #7c5cff);
          color: #0b0b12;
          padding: 5px 9px;
          border-radius: 8px;
        }
        .brand-name {
          font-weight: 600;
          font-size: 14px;
          color: #b6b6c8;
          letter-spacing: 0.3px;
        }
        h1 {
          font-size: clamp(30px, 6vw, 48px);
          font-weight: 800;
          margin: 0 0 12px;
          background: linear-gradient(135deg, #fff, #b6a4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sub {
          max-width: 560px;
          margin: 0 auto;
          color: #a9a9bd;
          font-size: 17px;
          line-height: 1.55;
        }
        .stats {
          margin-top: 18px;
          font-size: 14px;
          color: #8a8aa0;
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .dot {
          opacity: 0.5;
        }
        .controls {
          margin-bottom: 34px;
        }
        .search {
          width: 100%;
          box-sizing: border-box;
          padding: 15px 18px;
          border-radius: 14px;
          border: 1px solid #2a2a3a;
          background: #14141d;
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: border-color 0.15s;
        }
        .search:focus {
          border-color: #7c5cff;
        }
        .tipos {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        .chip {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid #2a2a3a;
          background: #14141d;
          color: #c9c9d8;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .chip:hover {
          border-color: #4a4a63;
        }
        .chip-on {
          background: #7c5cff;
          border-color: #7c5cff;
          color: #fff;
          font-weight: 600;
        }
        .chip-clear {
          color: #ff9d9d;
          border-color: #4a2a2a;
        }
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }
        .tag {
          padding: 5px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #8a8aa0;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.15s;
        }
        .tag:hover {
          color: #b6a4ff;
        }
        .tag-on {
          color: #b6a4ff;
          font-weight: 600;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .card {
          background: #14141d;
          border: 1px solid #24242f;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-3px);
          border-color: #7c5cff;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .badge {
          font-size: 12px;
          font-weight: 600;
          color: #b6a4ff;
          background: #221c3a;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .data {
          font-size: 12px;
          color: #6a6a80;
        }
        .card h3 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.3;
        }
        .resumo {
          color: #a9a9bd;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 14px;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .mini-tag {
          font-size: 12px;
          color: #8a8aa0;
        }
        .card-foot {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .autor {
          color: #6a6a80;
        }
        .ver {
          color: #b6a4ff;
          font-weight: 600;
        }
        .empty {
          grid-column: 1 / -1;
          text-align: center;
          color: #8a8aa0;
          padding: 60px 20px;
        }
        .foot {
          text-align: center;
          margin-top: 56px;
          color: #6a6a80;
          font-size: 13px;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(6, 6, 12, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 50;
        }
        .sheet {
          background: #12121b;
          border: 1px solid #2a2a3a;
          border-radius: 20px;
          max-width: 720px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 28px;
        }
        .sheet-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
        }
        .sheet-head h2 {
          margin: 12px 0 0;
          font-size: 24px;
          font-weight: 800;
        }
        .close {
          background: #1c1c28;
          border: 1px solid #2a2a3a;
          color: #c9c9d8;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .close:hover {
          border-color: #7c5cff;
        }
        .conteudo-box {
          position: relative;
          margin-top: 18px;
        }
        .copy {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #7c5cff;
          border: none;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .copy:hover {
          background: #6a4aef;
        }
        .conteudo-box pre {
          background: #0c0c14;
          border: 1px solid #24242f;
          border-radius: 14px;
          padding: 20px;
          padding-top: 48px;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #d4d4e4;
          margin: 0;
        }
        .sheet-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          font-size: 13px;
          color: #8a8aa0;
        }
        .sheet-foot a {
          color: #b6a4ff;
          text-decoration: none;
        }
      `}</style>
      <style jsx global>{`
        body {
          background: #0a0a10;
        }
      `}</style>
    </main>
  );
}
