import{i as g,g as m,a as y,o as f,G as b,s as x,b as h,c as v,d as E}from"./firebase-BYUqd4lZ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const u={apiKey:void 0,authDomain:void 0,projectId:void 0,storageBucket:void 0,messagingSenderId:void 0,appId:void 0,measurementId:void 0},w=["apiKey","authDomain","projectId","storageBucket","messagingSenderId","appId"],l=w.filter(e=>!u[e]);if(l.length>0)throw console.error("⚠️ Firebase config missing required fields:",l.join(", ")),console.error("Please create .env.local with your Firebase credentials."),console.error("See .env.example for the required variables."),new Error(`Missing required Firebase configuration: ${l.join(", ")}`);const p=g(u),d=m(p);y(p);function c(){const e=document.getElementById("app");e.innerHTML=`
    <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: system-ui, sans-serif;">
      <h1 style="text-align: center; color: #1a73e8;">🔐 Zenko Financial Auth</h1>
      
      <div id="auth-status" style="padding: 15px; margin: 20px 0; border-radius: 8px; background: #f5f5f5;">
        <p style="margin: 0;">Estado: <strong id="status-text">Cargando...</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;" id="user-email"></p>
      </div>

      <!-- Login con Google -->
      <div id="google-login-section" style="margin: 20px 0;">
        <button id="google-login-btn" style="width: 100%; padding: 12px; background: #4285f4; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span>🔑</span> Iniciar sesión con Google
        </button>
      </div>

      <div style="text-align: center; margin: 20px 0; color: #999;">─── o ───</div>

      <!-- Login con Email/Password -->
      <div id="email-login-section">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email:</label>
          <input type="email" id="email-input" placeholder="tu@email.com" 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Contraseña:</label>
          <input type="password" id="password-input" placeholder="••••••••" 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="login-btn" style="flex: 1; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Iniciar sesión
          </button>
          <button id="signup-btn" style="flex: 1; padding: 10px; background: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Crear cuenta
          </button>
        </div>
      </div>

      <!-- Logout -->
      <div id="logout-section" style="display: none; margin-top: 20px;">
        <button id="logout-btn" style="width: 100%; padding: 12px; background: #ea4335; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
          🚪 Cerrar sesión
        </button>
      </div>

      <div id="error-message" style="margin-top: 15px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c33; display: none;"></div>
    </div>
  `,document.getElementById("google-login-btn").addEventListener("click",I),document.getElementById("login-btn").addEventListener("click",L),document.getElementById("signup-btn").addEventListener("click",B),document.getElementById("logout-btn").addEventListener("click",k)}async function I(){try{const e=new b;await x(d,e),i("")}catch(e){i(`Error Google: ${e.message}`)}}async function L(){const e=document.getElementById("email-input").value,t=document.getElementById("password-input").value;if(!e||!t){i("Por favor completa todos los campos");return}try{await h(d,e,t),i("")}catch(r){i(`Error login: ${r.message}`)}}async function B(){const e=document.getElementById("email-input").value,t=document.getElementById("password-input").value;if(!e||!t){i("Por favor completa todos los campos");return}if(t.length<6){i("La contraseña debe tener al menos 6 caracteres");return}try{await v(d,e,t),i("")}catch(r){i(`Error registro: ${r.message}`)}}async function k(){try{await E(d),i("")}catch(e){i(`Error logout: ${e.message}`)}}function i(e){const t=document.getElementById("error-message");e?(t.textContent=e,t.style.display="block"):t.style.display="none"}function C(e){const t=document.getElementById("status-text"),r=document.getElementById("user-email"),s=document.getElementById("email-login-section"),o=document.getElementById("google-login-section"),n=document.getElementById("logout-section");e?(t.textContent="✅ Autenticado",t.style.color="#34a853",r.textContent=`Usuario: ${e.email}`,s.style.display="none",o.style.display="none",n.style.display="block"):(t.textContent="❌ No autenticado",t.style.color="#ea4335",r.textContent="",s.style.display="block",o.style.display="block",n.style.display="none")}f(d,e=>{console.log("Auth state changed:",e),C(e)});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c();
