import { useState, useEffect } from "react";
import kamera from './assets/kamera.jpeg';
import smartphone from './assets/Smartphone Interactive Display.jpeg';
const API_URL = "https://suitmedia-backend.suitdev.com/api/ideas";

export default function IdeasList() {
  const [ideas, setIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('-published_at');
  const [total, setTotal] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const totalPages = Math.ceil(total / size);

  // Restore state dari localStorage (hanya sekali waktu awal)
  useEffect(() => {
    const stored = localStorage.getItem('ideas-list-state');
    if (stored) {
      const { page, size, sort } = JSON.parse(stored);
      setPage(page);
      setSize(size);
      setSort(sort);
    }
    setIsReady(true);
  }, []);

  // Persist state ke localStorage setiap kali berubah
  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem('ideas-list-state', JSON.stringify({ page, size, sort }));
  }, [page, size, sort, isReady]);

  // Fetch data API, tapi tunggu state restored
  useEffect(() => {
    if (!isReady) return;
    async function fetchIdeas() {
      const url = `${API_URL}?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`;
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const json = await res.json();
        setIdeas(json.data);
        setTotal(json.meta.total);
      } catch (e) {
        setIdeas([]);
        setTotal(0);
      }
    }
    fetchIdeas();
  }, [page, size, sort, isReady]);

  function getPageNumbers() {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) end = Math.min(5, totalPages);
    if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  function getFallbackImg(idx) {
    return idx % 2 === 0 ? kamera : smartphone;
  }

  // Optional: Jangan render apa-apa sebelum state restored
  if (!isReady) return null;

  return (
    <div style={{ maxWidth: 1320, margin: "32px auto" }}>
      {/* Controls */}
      <div className="list-controls" style={{maxWidth: 1320}}>
        <span>
          Showing {(page - 1) * size + 1} - {Math.min(page * size, total)} of {total}
        </span>
        <div>
          <label>
            Show per page:
            <select
              value={size}
              onChange={e => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <label style={{ marginLeft: 16 }}>
            Sort by:
            <select
              value={sort}
              onChange={e => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="-published_at">Newest</option>
              <option value="published_at">Oldest</option>
            </select>
          </label>
        </div>
      </div>

      {/* Ideas List */}
      <div className="ideas-list">
        {ideas.map((idea, idx) => (
          <div key={idea.id} className="card">
            <div className="card-img-wrap">
              {(idea.small_image || idea.medium_image) ? (
                <img
                  src={idea.small_image || idea.medium_image}
                  alt={idea.title}
                  loading="lazy"
                  className="card-img"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImg(idx);
                  }}
                />
              ) : (
                <img
                  src={getFallbackImg(idx)}
                  alt="fallback"
                  loading="lazy"
                  className="card-img"
                />
              )}
            </div>
            <div className="card-content">
              <div className="card-date">
                {new Date(idea.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="card-title">{idea.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {/* First page */}
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="double-arrow"
          aria-label="First"
        >«</button>
        {/* Prev */}
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Prev"
        >&lt;</button>
        {/* Ellipsis left */}
        {page > 3 && totalPages > 5 && (
          <>
            <button onClick={() => setPage(1)} className={page === 1 ? "active" : ""}>1</button>
            {page > 4 && <span className="dots">...</span>}
          </>
        )}
        {/* Page numbers */}
        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={num === page ? "active" : ""}
          >
            {num}
          </button>
        ))}
        {/* Ellipsis right */}
        {page < totalPages - 2 && totalPages > 5 && (
          <>
            {page < totalPages - 3 && <span className="dots">...</span>}
            <button onClick={() => setPage(totalPages)} className={page === totalPages ? "active" : ""}>{totalPages}</button>
          </>
        )}
        {/* Next */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next"
        >&gt;</button>
        {/* Last page */}
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className="double-arrow"
          aria-label="Last"
        >»</button>
      </div>
    </div>
  );
}
