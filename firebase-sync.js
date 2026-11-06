"use strict";

(() => {
  const allowedEmail = "ssllfelipe@gmail.com";
  const firebaseConfig = {
    apiKey: "AIzaSyCZHCKeQhW3b305ghjH8Cgnx4aOQgDHHq4",
    authDomain: "felipe-da-silva-e-silva.firebaseapp.com",
    projectId: "felipe-da-silva-e-silva",
    storageBucket: "felipe-da-silva-e-silva.firebasestorage.app",
    messagingSenderId: "624097661136",
    appId: "1:624097661136:web:2a170b79a7c84466144ed5",
    measurementId: "G-D2JG7XN4V3"
  };
  const authForm = document.getElementById("cloud-login-form");
  if (!authForm) return;

  const loginState = document.getElementById("cloud-login-state");
  const sessionState = document.getElementById("cloud-session-state");
  const authFeedback = document.getElementById("cloud-auth-feedback");
  const sessionMessage = document.getElementById("cloud-session-message");
  const emailInput = document.getElementById("cloud-email");
  const passwordInput = document.getElementById("cloud-password");
  const rememberMeInput = document.getElementById("cloud-remember-me");
  const createAccountButton = document.getElementById("cloud-create-account");
  const resendVerificationButton = document.getElementById("cloud-resend-verification");
  const signOutButton = document.getElementById("cloud-sign-out");
  const printerForm = document.getElementById("printer-form");
  const savedRecords = document.querySelector(".saved-printers");
  let auth;
  let database;
  let activeUser = null;
  let stopListening = null;
  let authGeneration = 0;
  emailInput.value = allowedEmail;
  rememberMeInput.checked = localStorage.getItem("ic-firebase-remember-me") === "true";

  const setAuthPersistence = async () => {
    const rememberMe = rememberMeInput.checked;
    localStorage.setItem("ic-firebase-remember-me", String(rememberMe));
    const persistence = rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await auth.setPersistence(persistence);
  };

  const setMessage = (element, message, isError = false) => {
    element.textContent = message;
    element.classList.toggle("error", isError);
  };

  const showCloudRecords = visible => {
    printerForm.hidden = !visible;
    savedRecords.hidden = !visible;
  };

  const showSignedInState = (user, needsVerification = false, recordsReady = true) => {
    loginState.hidden = Boolean(user);
    sessionState.hidden = !user;
    showCloudRecords(Boolean(user && !needsVerification && recordsReady));
    resendVerificationButton.hidden = !needsVerification;
    if (user) {
      sessionMessage.textContent = needsVerification
        ? `Confirme o endereço ${user.email} pelo link enviado por e-mail para liberar a sincronização.`
        : recordsReady
          ? `Conectado como ${user.email}. As fichas e fotos são sincronizadas em tempo real.`
          : `Conectado como ${user.email}. Preparando a sincronização...`;
    }
  };

  const describeError = error => {
    const messages = {
      "auth/email-already-in-use": "Este e-mail já possui acesso. Use Entrar.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/invalid-email": "Informe um e-mail válido.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
      "auth/network-request-failed": "Sem conexão com a internet. Verifique a rede e tente novamente.",
      "auth/operation-not-allowed": "Ative E-mail/senha em Authentication no Firebase.",
      "auth/user-disabled": "Esta conta foi desativada no Firebase."
    };
    return messages[error.code] || error.message || "Ocorreu um erro inesperado no Firebase.";
  };

  const fileToDataUrl = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Não foi possível preparar uma foto."));
    reader.readAsDataURL(blob);
  });

  const compressImage = async image => {
    let bitmap;
    try {
      bitmap = await createImageBitmap(image);
      let scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
      const qualities = [0.78, 0.65, 0.52, 0.4];
      while (scale >= 0.25) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Este navegador não conseguiu processar a foto.");
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        for (const quality of qualities) {
          const compressed = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
          if (compressed && compressed.size <= 620000) return await fileToDataUrl(compressed);
        }
        scale *= 0.75;
      }
      throw new Error("A foto não pôde ser reduzida o suficiente para a cota gratuita.");
    } finally {
      bitmap?.close();
    }
  };

  const recordCollection = () => database.collection("printerRecords");
  const photoCollection = (recordId, type) =>
    recordCollection().doc(recordId).collection("photos").doc(type);

  const saveRecord = async (record, images, removedImages = []) => {
    if (!activeUser || !activeUser.emailVerified) {
      throw new Error("Entre com o e-mail autorizado e confirme o endereço antes de sincronizar.");
    }
    const cloudRecord = { ...record, ownerEmail: allowedEmail };
    const recordReference = recordCollection().doc(record.id);
    await recordReference.set({
      ownerEmail: allowedEmail,
      record: cloudRecord,
      ready: false,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const photoTypes = [
      ["printer-photo", images.printerPhoto],
      ["test-page", images.testPage],
      ["printer-reset", images.printerReset],
      ["machine-cleaning-photo", images.machineCleaningPhoto]
    ];
    for (const [type, image] of photoTypes) {
      const reference = photoCollection(record.id, type);
      if (image) {
        const dataUrl = await compressImage(image);
        await reference.set({
          ownerEmail: allowedEmail,
          dataUrl,
          contentType: "image/jpeg",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else if (removedImages.includes(type)) {
        await reference.delete();
      }
    }
    await recordReference.update({
      ready: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  const deleteRecord = async recordId => {
    if (!activeUser || !activeUser.emailVerified) {
      throw new Error("Entre com o e-mail autorizado e confirme o endereço antes de excluir.");
    }
    const batch = database.batch();
    const recordReference = recordCollection().doc(recordId);
    ["printer-photo", "test-page", "printer-reset", "machine-cleaning-photo"].forEach(type => {
      batch.delete(photoCollection(recordId, type));
    });
    batch.delete(recordReference);
    await batch.commit();
  };

  const loadImage = async (recordId, type) => {
    if (!activeUser || !activeUser.emailVerified) return null;
    const snapshot = await photoCollection(recordId, type).get();
    if (!snapshot.exists) return null;
    const dataUrl = snapshot.data().dataUrl;
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error("Não foi possível carregar uma foto sincronizada.");
    return response.blob();
  };

  const startSync = async generation => {
    const collection = recordCollection();
    const query = collection
      .where("ownerEmail", "==", allowedEmail)
      .where("ready", "==", true);
    const existing = await query.get();
    if (generation !== authGeneration) return;
    const existingIds = new Set(existing.docs.map(document => document.id));
    const localRecords = window.icPrinterRecords.readLocalRecords();
    for (const record of localRecords) {
      if (existingIds.has(record.id)) continue;
      const images = await window.icPrinterRecords.loadLocalRecordImages(record);
      await saveRecord(record, images);
      existingIds.add(record.id);
      if (generation !== authGeneration) return;
    }
    if (generation !== authGeneration) return;

    stopListening?.();
    await new Promise((resolve, reject) => {
      let firstSnapshot = true;
      stopListening = query.onSnapshot(snapshot => {
        if (generation !== authGeneration) {
          if (firstSnapshot) resolve();
          return;
        }
        try {
          const cloudRecords = snapshot.docs.map(document => {
            const data = document.data();
            if (!data.record || data.record.id !== document.id) {
              throw new Error(`A ficha ${document.id} tem dados inválidos no Firestore.`);
            }
            return data.record;
          });
          window.icPrinterRecords.applyCloudRecords(cloudRecords).then(() => {
            if (firstSnapshot) {
              firstSnapshot = false;
              resolve();
            }
          }).catch(error => {
            setMessage(authFeedback, `Não foi possível atualizar o histórico: ${error.message}`, true);
            if (firstSnapshot) {
              firstSnapshot = false;
              reject(error);
            }
          });
        } catch (error) {
          setMessage(authFeedback, error.message, true);
          if (firstSnapshot) {
            firstSnapshot = false;
            reject(error);
          }
        }
      }, error => {
        setMessage(authFeedback, `A conexão em tempo real foi interrompida: ${error.message}`, true);
        if (firstSnapshot) {
          firstSnapshot = false;
          reject(error);
        }
      });
    });
  };

  window.icFirebaseSync = { saveRecord, deleteRecord, loadImage };

  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    if (email !== allowedEmail) {
      setMessage(authFeedback, `Este acesso está restrito a ${allowedEmail}.`, true);
      return;
    }
    setMessage(authFeedback, "Conectando...");
    try {
      await setAuthPersistence();
      await auth.signInWithEmailAndPassword(email, passwordInput.value);
      passwordInput.value = "";
      setMessage(authFeedback, "");
    } catch (error) {
      setMessage(authFeedback, describeError(error), true);
    }
  });

  createAccountButton.addEventListener("click", async () => {
    const email = emailInput.value.trim().toLowerCase();
    if (email !== allowedEmail) {
      setMessage(authFeedback, `Crie o acesso somente para ${allowedEmail}.`, true);
      return;
    }
    if (!passwordInput.value || passwordInput.value.length < 6) {
      setMessage(authFeedback, "Digite uma senha com pelo menos 6 caracteres.", true);
      passwordInput.focus();
      return;
    }
    setMessage(authFeedback, "Criando o acesso e enviando o e-mail de verificação...");
    try {
      await setAuthPersistence();
      const credential = await auth.createUserWithEmailAndPassword(email, passwordInput.value);
      await credential.user.sendEmailVerification();
      await auth.signOut();
      passwordInput.value = "";
      setMessage(authFeedback, "Acesso criado. Confirme o e-mail enviado antes de entrar.");
    } catch (error) {
      setMessage(authFeedback, describeError(error), true);
    }
  });

  resendVerificationButton.addEventListener("click", async () => {
    try {
      await activeUser.sendEmailVerification();
      setMessage(authFeedback, "Novo e-mail de verificação enviado.");
    } catch (error) {
      setMessage(authFeedback, describeError(error), true);
    }
  });

  signOutButton.addEventListener("click", async () => {
    try {
      await auth.signOut();
      setMessage(authFeedback, "Você saiu da conta.");
    } catch (error) {
      setMessage(authFeedback, describeError(error), true);
    }
  });

  try {
    if (!window.firebase?.apps) throw new Error("Os serviços Firebase não carregaram. Verifique sua conexão.");
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = app.auth();
    database = app.firestore();
    auth.onAuthStateChanged(async user => {
      const generation = ++authGeneration;
      stopListening?.();
      stopListening = null;
      activeUser = null;
      if (!user) {
        showSignedInState(null);
        return;
      }
      if (user.email?.toLowerCase() !== allowedEmail) {
        setMessage(authFeedback, `Somente ${allowedEmail} pode acessar as fichas.`, true);
        await auth.signOut();
        return;
      }
      activeUser = user;
      if (!user.emailVerified) {
        showSignedInState(user, true);
        return;
      }
      showSignedInState(user, false, false);
      setMessage(authFeedback, "Carregando fichas e sincronizando...");
      try {
        await startSync(generation);
        if (generation === authGeneration) {
          showSignedInState(user);
          setMessage(authFeedback, "Sincronização em tempo real ativa.");
        }
      } catch (error) {
        showCloudRecords(false);
        setMessage(authFeedback, `Não foi possível sincronizar: ${error.message}`, true);
      }
    }, error => {
      showCloudRecords(false);
      setMessage(authFeedback, `Não foi possível verificar o acesso: ${error.message}`, true);
    });
  } catch (error) {
    showCloudRecords(false);
    setMessage(authFeedback, error.message, true);
  }
})();
