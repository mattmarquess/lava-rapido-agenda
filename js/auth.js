function isAdminAuthenticated() {
  return sessionStorage.getItem("brilhomax_admin_session") === "ok";
}

function showAdminContent() {
  if (elements.loginPanel) {
    elements.loginPanel.hidden = true;
  }

  if (elements.adminContent) {
    elements.adminContent.hidden = false;
  }
}

function showLoginPanel() {
  if (elements.adminContent) {
    elements.adminContent.hidden = true;
  }

  if (elements.loginPanel) {
    elements.loginPanel.hidden = false;
  }
}

function requireAdminAuth() {
  if (!elements.loginPanel || !elements.adminContent) {
    return true;
  }

  if (isAdminAuthenticated()) {
    showAdminContent();
    return true;
  }

  showLoginPanel();
  return false;
}

function handleLogin(event) {
  event.preventDefault();

  if (elements.loginPassword.value === getAdminPassword()) {
    sessionStorage.setItem("brilhomax_admin_session", "ok");
    elements.loginPassword.value = "";
    elements.loginMessage.textContent = "";
    showAdminContent();
    initProtectedAdminPage();
    return;
  }

  elements.loginMessage.textContent = "Senha incorreta.";
}

function handleLogout() {
  sessionStorage.removeItem("brilhomax_admin_session");
  showLoginPanel();
}

function handlePasswordSave(event) {
  event.preventDefault();

  const formData = new FormData(elements.passwordForm);
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (currentPassword !== getAdminPassword()) {
    elements.passwordMessage.textContent = "Senha atual incorreta.";
    return;
  }

  if (newPassword.length < 4) {
    elements.passwordMessage.textContent = "Use uma senha com pelo menos 4 caracteres.";
    return;
  }

  if (newPassword !== confirmPassword) {
    elements.passwordMessage.textContent = "A confirmação não confere.";
    return;
  }

  saveAdminPassword(newPassword);
  elements.passwordForm.reset();
  elements.passwordMessage.textContent = "Senha alterada com sucesso.";
}

function initAuth() {
  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", handleLogin);
  }

  if (elements.logoutButton) {
    elements.logoutButton.addEventListener("click", handleLogout);
  }

  if (elements.passwordForm) {
    elements.passwordForm.addEventListener("submit", handlePasswordSave);
  }
}
