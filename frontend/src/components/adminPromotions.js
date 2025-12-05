import React from "react";
import "./adminPromotions.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";

function AdminPromotions() {
  const navigate = useNavigate();
  const { currentUser, userAuth } = useAuth();

  useEffect(() => {
    if (userAuth === "ADMIN") return;
    navigate("/login");
  }, [navigate, userAuth]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [sendEmail, setSendEmail] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:9090";

  const authHeader = () => {
    const token = currentUser?.token || JSON.parse(localStorage.getItem("user"))?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/promotions`, {
        headers: { ...authHeader() }
      });
      if (!res.ok) throw new Error("Failed to load promotions");
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const createPromotion = async () => {
    try {
      const body = { title, description, code, discount: Number(discount), active: true, sendEmail };
      const res = await fetch(`${API}/api/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Create failed");
      }
      const created = await res.json();
      setPromotions((p) => [created, ...p]);
      setTitle("");
      setDescription("");
      setCode("");
      setDiscount(0);
    } catch (err) {
      console.error(err);
      alert("Failed to create promotion: " + err.message);
    }
  };

  const updatePromotion = async (id, updates) => {
    try {
      const res = await fetch(`${API}/api/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setPromotions((p) => p.map((x) => (x.id === id ? updated : x)));
    } catch (err) {
      console.error(err);
      alert("Failed to update promotion");
    }
  };

  const deletePromotion = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;
    try {
      const res = await fetch(`${API}/api/promotions/${id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });
      if (!res.ok) throw new Error("Delete failed");
      setPromotions((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete promotion");
    }
  };

  const PromotionCard = ({ promo }) => {
    const [editing, setEditing] = useState(false);
    const [local, setLocal] = useState({ ...promo });

    const save = () => {
      const updates = {
        title: local.title,
        description: local.description,
        code: local.code,
        discount: Number(local.discount),
        active: local.active,
      };
      updatePromotion(promo.id, updates);
      setEditing(false);
    };

    const toggleActive = () => {
      const updates = { active: !local.active };
      updatePromotion(promo.id, updates);
      setLocal((l) => ({ ...l, active: !l.active }));
    };

    return (
      <div className="promo-card">
        {editing ? (
          <>
            <input className="promo-input" value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} />
            <textarea className="promo-textarea" value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
            <input className="promo-input" value={local.code} onChange={(e) => setLocal({ ...local, code: e.target.value })} />
            <input className="promo-input" type="number" value={local.discount} onChange={(e) => setLocal({ ...local, discount: e.target.value })} />
            <div className="promo-card-actions">
              <button className="promo-button primary" onClick={save}>Save</button>
              <button className="promo-button" onClick={() => { setEditing(false); setLocal({ ...promo }); }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="promo-title">{promo.title}</h3>
            <p className="promo-desc">{promo.description}</p>
            <div className="promo-meta">
              <span className="promo-code">Code: <strong>{promo.code}</strong></span>
              <span className="promo-discount">{promo.discount}%</span>
            </div>
            <div className="promo-card-actions">
              <label className="switch">
                <input type="checkbox" checked={local.active} onChange={toggleActive} />
                <span className="slider" />
              </label>
              <button className="promo-button" onClick={() => setEditing(true)}>Edit</button>
              <button className="promo-button danger" onClick={() => deletePromotion(promo.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="admin-promotions-page">
      <div className="admin-promotions-card">
        <h1>Manage Promotions</h1>

        <div className="create-form">
          <input placeholder="Promotion Title" className="promo-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Description" className="promo-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder="Code (e.g. FALL20)" className="promo-input" value={code} onChange={(e) => setCode(e.target.value)} />
          <input placeholder="Discount %" className="promo-input" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          <label style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            <span style={{color:'#fff'}}>Send email alert to opted-in users</span>
          </label>
          <div className="create-actions">
            <button className="promo-button primary" onClick={createPromotion}>Create Promotion</button>
          </div>
        </div>

        <h2>Existing Promotions</h2>
        {loading ? <p>Loading...</p> : (
          <div className="promo-grid">
            {promotions.map((p) => (
              <PromotionCard key={p.id} promo={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPromotions;
