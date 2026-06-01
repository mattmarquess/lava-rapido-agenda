function useSupabaseAuth() {
  return Boolean(getSupabaseClient());
}

async function isAdminAuthenticated() {
  if (useSupabaseAuth()) {
    const { data, error } = await getSupabaseClient().auth.getSession();
    return !error && Boolean(data.session);
  }

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

async function requireAdminAuth() {
  if (!elements.loginPanel || !elements.adminContent) {
    return true;
  }

  if (await isAdminAuthenticated()) {
    showAdminContent();
    return true;
  }

  showLoginPanel();
  return false;
}

async function handleLogin(event) {
  event.preventDefault();

  if (useSupabaseAuth()) {
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;

    if (!email) {
      elements.loginMessage.textContent = "Informe o e-mail do administrador.";
      return;
    }

    elements.loginMessage.textContent = "Entrando...";

    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      elements.loginMessage.textContent = "E-mail ou senha inválidos.";
      return;
    }

    elements.loginPassword.value = "";
    elements.loginMessage.textContent = "";
    showAdminContent();
    initProtectedAdminPage();
    return;
  }

  if (elements.loginPassword.value === getAdminPassword() || elements.loginPassword.value === defaultAdminPassword) {
    sessionStorage.setItem("brilhomax_admin_session", "ok");
    elements.loginPassword.value = "";
    elements.loginMessage.textContent = "";
    showAdminContent();
    initProtectedAdminPage();
    return;
  }

  elements.loginMessage.textContent = "Senha incorreta.";
}

async function handleLogout() {
  if (useSupabaseAuth()) {
    await getSupabaseClient().auth.signOut();
  }

  sessionStorage.removeItem("brilhomax_admin_session");
  showLoginPanel();
}

function handlePasswordReset() {
  if (useSupabaseAuth()) {
    elements.loginMessage.textContent = "Use o e-mail e senha do usuário criado no Supabase.";
    return;
  }

  clearAdminPassword();
  sessionStorage.removeItem("brilhomax_admin_session");
  elements.loginPassword.value = "";
  elements.loginMessage.textContent = "Senha restaurada. Use 1234 para entrar.";
}

function handlePasswordSave(event) {
  event.preventDefault();

  const formData = new FormData(elements.passwordForm);
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (!useSupabaseAuth() && currentPassword !== getAdminPassword()) {
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

  if (useSupabaseAuth()) {
    getSupabaseClient().auth.updateUser({ password: newPassword }).then(({ error }) => {
      if (error) {
        elements.passwordMessage.textContent = "Não foi possível alterar a senha.";
        return;
      }

      elements.passwordForm.reset();
      elements.passwordMessage.textContent = "Senha alterada com sucesso.";
    });
    return;
  }

  saveAdminPassword(newPassword);
  elements.passwordForm.reset();
  elements.passwordMessage.textContent = "Senha local alterada com sucesso.";
}

function initAuth() {
  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", handleLogin);
  }

  if (elements.logoutButton) {
    elements.logoutButton.addEventListener("click", handleLogout);
  }

  if (elements.resetAdminPasswordButton) {
    elements.resetAdminPasswordButton.addEventListener("click", handlePasswordReset);
  }

  if (elements.passwordForm) {
    elements.passwordForm.addEventListener("submit", handlePasswordSave);
  }
}
