// MIA Admin Dashboard - JavaScript Frontend Client
// Detecta dinámicamente el context path (/admin-api/api) o fallback
const CONTEXT_ROOT = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '');
const API_BASE = CONTEXT_ROOT ? CONTEXT_ROOT : '/admin-api/api';

const state = {
  token: localStorage.getItem('mia_jwt_token') || '',
  user: JSON.parse(localStorage.getItem('mia_user') || 'null'),
  searchTerm: '',
  category: 'todos',
  environment: 'ALL',
  status: 'ALL',
  onlyFavorites: false,
  page: 0,
  size: 8,
  sortBy: 'name',
  totalPages: 1,
  totalElements: 0
};

// Elements
const authBadge = document.getElementById('authBadge');
const authText = document.getElementById('authText');
const userAvatar = document.getElementById('userAvatar');
const authBtn = document.getElementById('authBtn');
const jwtBar = document.getElementById('jwtBar');
const jwtTokenText = document.getElementById('jwtTokenText');
const copyTokenBtn = document.getElementById('copyTokenBtn');

const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statMaint = document.getElementById('statMaint');
const statFavs = document.getElementById('statFavs');

const searchInput = document.getElementById('searchInput');
const envSelect = document.getElementById('envSelect');
const statusSelect = document.getElementById('statusSelect');
const sortSelect = document.getElementById('sortSelect');
const favToggleBtn = document.getElementById('favToggleBtn');
const categoryPills = document.querySelectorAll('.category-pill');

const projectsGrid = document.getElementById('projectsGrid');
const paginationInfo = document.getElementById('paginationInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

// Init
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  if (state.token) {
    updateAuthUI();
    loadDashboard();
  } else {
    // Intentar login automático con admin por defecto para una experiencia de usuario inmediata
    autoLoginDefaultAdmin();
  }
});

function setupEventListeners() {
  authBtn.addEventListener('click', () => {
    if (state.token) {
      logout();
    } else {
      openLoginModal();
    }
  });

  copyTokenBtn?.addEventListener('click', () => {
    if (state.token) {
      navigator.clipboard.writeText(state.token);
      copyTokenBtn.innerText = '¡Copiado!';
      setTimeout(() => copyTokenBtn.innerText = 'Copiar', 2000);
    }
  });

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchTerm = e.target.value.trim();
      state.page = 0;
      loadProjects();
    }, 300);
  });

  envSelect.addEventListener('change', (e) => {
    state.environment = e.target.value;
    state.page = 0;
    loadProjects();
  });

  statusSelect.addEventListener('change', (e) => {
    state.status = e.target.value;
    state.page = 0;
    loadProjects();
  });

  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.page = 0;
    loadProjects();
  });

  favToggleBtn.addEventListener('click', () => {
    state.onlyFavorites = !state.onlyFavorites;
    favToggleBtn.classList.toggle('active', state.onlyFavorites);
    state.page = 0;
    loadProjects();
  });

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.category = pill.dataset.category;
      state.page = 0;
      loadProjects();
    });
  });

  prevPageBtn.addEventListener('click', () => {
    if (state.page > 0) {
      state.page--;
      loadProjects();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (state.page < state.totalPages - 1) {
      state.page++;
      loadProjects();
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const username = loginUsername.value.trim();
    const password = loginPassword.value;
    await doLogin(username, password);
  });
}

async function autoLoginDefaultAdmin() {
  await doLogin('admin', 'admin123', true);
}

async function doLogin(username, password, silent = false) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: username, password })
    });

    if (!res.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await res.json();
    state.token = data.token;
    state.user = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      roles: Array.isArray(data.roles) ? data.roles : (data.roles ? Array.from(data.roles) : []),
      projectIds: Array.isArray(data.projectIds) ? data.projectIds : (data.projectIds ? Array.from(data.projectIds) : [])
    };

    localStorage.setItem('mia_jwt_token', state.token);
    localStorage.setItem('mia_user', JSON.stringify(state.user));

    updateAuthUI();
    closeLoginModal();
    loadDashboard();
  } catch (err) {
    if (!silent) {
      loginError.innerText = err.message || 'Error al iniciar sesión';
      loginError.style.display = 'block';
    } else {
      updateAuthUI();
    }
  }
}

function logout() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('mia_jwt_token');
  localStorage.removeItem('mia_user');
  updateAuthUI();
  projectsGrid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <h3>Sesión Cerrada</h3>
      <p>Debes iniciar sesión con JWT para visualizar y buscar proyectos.</p>
      <button class="btn btn-primary" onclick="openLoginModal()" style="margin-top: 1rem;">Iniciar Sesión</button>
    </div>
  `;
}

function updateAuthUI() {
  const dot = authBadge.querySelector('.status-dot');
  if (state.token && state.user) {
    dot.classList.add('active');
    const rolesArr = state.user.roles || [];
    const rolesStr = rolesArr.map(r => typeof r === 'string' ? r.replace('ROLE_', '') : r).join(', ') || 'USER';
    const projCount = (state.user.projectIds || []).length;
    authText.innerText = `${state.user.fullName} [${rolesStr}] • ${projCount} proy.`;
    authBtn.innerText = 'Cerrar Sesión';
    authBtn.className = 'btn btn-outline-red btn-sm';
    jwtBar.style.display = 'flex';
    jwtTokenText.innerText = state.token;
  } else {
    dot.classList.remove('active');
    authText.innerText = 'No Autenticado';
    authBtn.innerText = 'Iniciar Sesión (JWT)';
    authBtn.className = 'btn btn-primary btn-sm';
    jwtBar.style.display = 'none';
  }
}

async function loadDashboard() {
  loadStats();
  loadProjects();
}

async function loadStats() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/projects/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const stats = await res.json();
      statTotal.innerText = stats.totalProjects;
      statActive.innerText = stats.activeProjects;
      statMaint.innerText = stats.maintenanceProjects;
      statFavs.innerText = stats.favoritesCount;
    }
  } catch (err) {
    console.error('Error al cargar métricas:', err);
  }
}

async function loadProjects() {
  if (!state.token) return;

  projectsGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #94a3b8;">
      Cargando proyectos desde Spring Boot API...
    </div>
  `;

  try {
    const params = new URLSearchParams({
      search: state.searchTerm,
      category: state.category,
      environment: state.environment,
      status: state.status,
      onlyFavorites: state.onlyFavorites,
      page: state.page,
      size: state.size,
      sortBy: state.sortBy
    });

    const res = await fetch(`${API_BASE}/projects?${params}`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });

    if (res.status === 401 || res.status === 403) {
      logout();
      return;
    }

    const data = await res.json();
    state.totalPages = data.totalPages;
    state.totalElements = data.totalElements;

    renderProjects(data.content);
    renderPagination(data);
  } catch (err) {
    projectsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; color: #f43f5e;">
        <h3>Error al consultar la API</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

function renderProjects(projects) {
  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No se encontraron proyectos</h3>
        <p>Prueba ajustando el término de búsqueda o limpiando los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = projects.map(p => `
    <div class="project-card" id="card-${p.id}">
      <div>
        <div class="project-header">
          <div class="project-avatar" style="background-color: ${p.iconBgColor || '#2563eb'}">
            ${getIconSvg(p.icon)}
          </div>
          <div class="project-title-area">
            <h3 class="project-title" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</h3>
            <p class="project-subtitle" title="${escapeHtml(p.subtitle || '')}">${escapeHtml(p.subtitle || p.categoryLabel || '')}</p>
          </div>
          <button class="project-fav-btn ${p.isFavorite ? 'is-fav' : ''}" 
                  onclick="toggleProjectFavorite('${p.id}')" 
                  title="${p.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito'}">
            ★
          </button>
        </div>

        <p class="project-description">${escapeHtml(p.description || 'Sin descripción.')}</p>

        <div class="project-badges">
          <span class="badge badge-env-${p.environment.toLowerCase()}">${p.environment}</span>
          <span class="badge badge-status-${p.status === 'active' ? 'active' : p.status === 'maintenance' ? 'maint' : 'offline'}">
            ${p.status === 'active' ? '● En Línea' : p.status === 'maintenance' ? '▲ Mantenimiento' : '✕ Offline'}
          </span>
          <span class="badge" style="background: rgba(255,255,255,0.06); color: #cbd5e1;">
            ${escapeHtml(p.categoryLabel || p.category)}
          </span>
          <span class="badge" style="background: rgba(255,255,255,0.06); color: #94a3b8;">
            ${escapeHtml(p.version || 'v1.0')}
          </span>
        </div>
      </div>

      <div class="project-footer">
        <div>
          <span>Uptime: <strong>${escapeHtml(p.uptime || '99.9%')}</strong></span>
        </div>
        <a href="${p.url || '#'}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
          Abrir ↗
        </a>
      </div>
    </div>
  `).join('');
}

function renderPagination(data) {
  const start = data.totalElements === 0 ? 0 : data.page * data.size + 1;
  const end = Math.min((data.page + 1) * data.size, data.totalElements);
  paginationInfo.innerText = `Mostrando ${start} - ${end} de ${data.totalElements} proyectos`;

  prevPageBtn.disabled = data.page === 0;
  nextPageBtn.disabled = data.page >= data.totalPages - 1 || data.totalPages === 0;
}

async function toggleProjectFavorite(id) {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/projects/${id}/favorite`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      loadStats();
      loadProjects();
    }
  } catch (err) {
    console.error('Error al alternar favorito:', err);
  }
}

function openLoginModal() {
  loginModal.classList.add('active');
}

function closeLoginModal() {
  loginModal.classList.remove('active');
}

function quickLogin(user, pass) {
  loginUsername.value = user;
  loginPassword.value = pass;
  doLogin(user, pass);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getIconSvg(iconName) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>`;
}
