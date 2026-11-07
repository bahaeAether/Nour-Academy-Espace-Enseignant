import { groupes, eleves } from "./data.js";

// regex
const regexNom = /^[A-Za-zÀ-ÿ\s-]{2,}$/;
const regexGroupe = /^.+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelephone = /^(?:(?:06|07)\d{8}|\+212[67]\d{8})$/;
const regexCode = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// filtres
const filtreGroup = document.getElementById("filtre-groupe");
const inputRecherche = document.getElementById("recherche");
const compteur = document.getElementById("compteur");
const tri = document.getElementById("tri");
const aucunResultat = document.getElementById("aucun-resultat");
const listeEleves = document.getElementById("liste-eleves");

// formulaire
const formEleve = document.getElementById("form-eleve");
const prenom = document.getElementById("prenom");
const nom = document.getElementById("nom");
const groupe = document.getElementById("groupe");
const email = document.getElementById("email");
const telephone = document.getElementById("telephone");
const code = document.getElementById("code");
const codeForce = document.getElementById("code-force");

const succes = document.getElementById("form-succes");
const erreur = document.getElementById("form-erreur");

// statistiques
const bilanMoyenne = document.querySelector("#bilan-moyenne");
const bilanAbsences = document.querySelector("#bilan-absences");
const bilanAlertes = document.querySelector("#bilan-alertes");
const bilanMeilleur = document.querySelector("#bilan-meilleur");
const listeParents = document.querySelector("#liste-parents");
const aucuneAlerte = document.querySelector("#aucune-alerte");

// fiche d'un élève
const dialogFiche = document.querySelector("#fiche");
const ficheNom = document.querySelector("#fiche-nom");
const ficheGroupe = document.querySelector("#fiche-groupe");
const ficheNotes = document.querySelector("#fiche-notes");

groupes.forEach((group) => {
  ajouterOptionGroupe(group, filtreGroup);
  ajouterOptionGroupe(group, groupe);
});

afficherEleves();
mettreAJourBilan();

inputRecherche.addEventListener("input", afficherEleves);
filtreGroup.addEventListener("change", afficherEleves);
tri.addEventListener("change", afficherEleves);
listeEleves.addEventListener("click", absencesNotesFiche);
prenom.addEventListener("input", function () {
  validerChamp(
    prenom,
    regexNom,
    document.querySelector("#prenom-msg"),
    "Minimum 2 caractères : lettres, espaces ou tirets.",
  );
});
nom.addEventListener("input", function () {
  validerChamp(
    nom,
    regexNom,
    document.querySelector("#nom-msg"),
    "Minimum 2 caractères : lettres, espaces ou tirets.",
  );
});
groupe.addEventListener("input", function () {
  validerChamp(
    groupe,
    regexGroupe,
    document.querySelector("#groupe-msg"),
    "Veuillez choisir un groupe.",
  );
});
email.addEventListener("input", function () {
  validerChamp(
    email,
    regexEmail,
    document.querySelector("#email-msg"),
    "Veuillez entrer une adresse email valide.",
  );
});
telephone.addEventListener("input", function () {
  validerChamp(
    telephone,
    regexTelephone,
    document.querySelector("#telephone-msg"),
    "Numéro invalide. Utilisez 06/07 ou +212 6/7.",
  );
});
code.addEventListener("input", function () {
  validerChamp(
    code,
    regexCode,
    document.querySelector("#code-msg"),
    "8 caractères minimum, 1 majuscule, 1 chiffre et 1 caractère spécial.",
  );
  verifierForceCode();
});
formEleve.addEventListener("submit", formValidation);
dialogFiche.addEventListener("click", function (event) {
  if (event.target === dialogFiche) {
    dialogFiche.close();
  }
});

function afficherEleves() {
  let elevesFiltres = eleves.filter((eleve) => {
    return (
      isInFullName(eleve, inputRecherche.value) &&
      isInGroup(eleve, filtreGroup.value)
    );
  });

  if (tri.value === "nom") trierParNom(elevesFiltres);
  if (tri.value === "moyenne") trierParMoyenne(elevesFiltres);

  const lignes = elevesFiltres.map(creerLigne);
  listeEleves.replaceChildren(...lignes);
  compteur.textContent = elevesFiltres.length + " élève(s)";
  aucunResultat.hidden = elevesFiltres.length !== 0;

  mettreAJourBilan();
}

function creerLigne(eleve) {
  const line = document.createElement("li");
  line.className = "rounded-2xl border border-line bg-card p-3";
  line.dataset.id = `${eleve.id}`;
  if (eleve.absences >= 3) {
    line.classList.add("alerte");
  }

  const outerDiv = document.createElement("div");
  outerDiv.className = "flex flex-col gap-3 lg:flex-row lg:items-center";

  const noteMessage = document.createElement("p");
  noteMessage.textContent = "La note doit être un nombre entre 0 et 20.";
  noteMessage.className = "message mt-2 text-xs text-alert";
  noteMessage.hidden = true;

  const btnFiche = document.createElement("button");
  btnFiche.type = "button";
  btnFiche.className =
    "btn-fiche flex min-h-11 flex-1 items-center gap-3 text-left cursor-pointer";

  const avatar = document.createElement("span");
  avatar.className =
    "grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand";
  avatar.textContent = `${eleve.prenom[0]}${eleve.nom[0]}`;
  if (eleve.absences >= 3) {
    avatar.classList.remove("bg-brand-soft", "text-brand");
    avatar.classList.add("bg-alert", "text-white");
  }

  const informations = document.createElement("span");
  informations.className = "min-w-0 flex-1";

  const fullName = document.createElement("span");
  fullName.className = "block truncate font-medium";
  fullName.textContent = `${eleve.prenom} ${eleve.nom}`;

  const absences = document.createElement("span");
  absences.className = "block text-sm text-muted";
  absences.textContent = `${eleve.absences} absence(s)`;
  if (eleve.absences >= 3) {
    const badge = document.createElement("span");
    badge.className =
      "badge ml-1 whitespace-nowrap rounded-full bg-alert px-2 py-0.5 text-xs font-medium text-white";
    badge.textContent = "Prévenir les parents";

    absences.append(" ", badge);
  }
  informations.append(fullName, absences);

  const moyenne = document.createElement("span");
  moyenne.className = "font-serif text-xl";
  moyenne.textContent = calculerMoyenne(eleve.notes);

  btnFiche.append(avatar, informations, moyenne);

  const actions = document.createElement("div");
  actions.className = "flex gap-2";

  const btnAbsent = document.createElement("button");
  btnAbsent.type = "button";
  btnAbsent.className =
    "btn-absent h-11 rounded-full border border-line px-3 sm:px-4 text-sm font-medium hover:bg-paper cursor-pointer";
  btnAbsent.textContent = "Absent";

  const label = document.createElement("label");
  label.className = "flex-1";

  const texteCache = document.createElement("span");
  texteCache.className = "sr-only";
  texteCache.textContent = "Note sur 20";

  const inputNote = document.createElement("input");
  inputNote.id = `input-${eleve.id}`;
  inputNote.type = "number";
  inputNote.min = "0";
  inputNote.max = "20";
  inputNote.step = "0.25";
  inputNote.placeholder = "Note";
  inputNote.className =
    "h-11 w-full rounded-full border border-line bg-paper px-4 text-sm lg:w-24";

  label.append(texteCache, inputNote);

  const btnNote = document.createElement("button");
  btnNote.type = "button";
  btnNote.className =
    "btn-note h-11 rounded-full bg-ink px-3 sm:px-4 text-sm font-medium text-white hover:bg-brand cursor-pointer";
  btnNote.textContent = "Ajouter la note";

  actions.append(btnAbsent, label, btnNote);
  outerDiv.append(btnFiche, actions);
  line.append(outerDiv, noteMessage);

  return line;
}

function calculerMoyenne(notes) {
  if (notes.length === 0) return "——";

  return calculerMoyenneNumber(notes).toFixed(2) + " / 20";
}

function calculerMoyenneNumber(notes) {
  const total = notes.reduce((somme, note) => somme + note, 0);

  return total / notes.length;
}

function ajouterOptionGroupe(groupe, dropdownElement) {
  const option = document.createElement("option");
  option.value = groupe.id;
  option.textContent = groupe.nom;

  dropdownElement.append(option);
}

function isInGroup(eleve, groupId) {
  if (!groupId) return true;
  return eleve.groupeId === Number(groupId);
}

function isInFullName(eleve, subName) {
  const fullName = eleve.prenom.toLowerCase() + " " + eleve.nom.toLowerCase();
  return fullName.includes(subName.toLowerCase().trim());
}

function trierParNom(elevesFiltres) {
  return elevesFiltres.sort((a, b) => {
    const nomA = a.prenom.trim() + a.nom.trim();
    const nomB = b.prenom.trim() + b.nom.trim();

    return nomA <= nomB ? -1 : 1;
  });
}

function trierParMoyenne(elevesFiltres) {
  return elevesFiltres.sort((a, b) => {
    const moyAstring = calculerMoyenne(a.notes);
    const moyBstring = calculerMoyenne(b.notes);

    let moyA =
      moyAstring === "——" ? 0 : Number(moyAstring.replace(" / 20", ""));
    let moyB =
      moyBstring === "——" ? 0 : Number(moyBstring.replace(" / 20", ""));

    return moyB - moyA;
  });
}

function absencesNotesFiche(event) {
  const boutonAbsent = event.target.closest(".btn-absent");
  const boutonNote = event.target.closest(".btn-note");
  const boutonFiche = event.target.closest(".btn-fiche");

  if (!boutonAbsent && !boutonNote && !boutonFiche) return;

  const ligne = event.target.closest("li[data-id]");

  const eleve = eleves.find(function (eleve) {
    return eleve.id === Number(ligne.dataset.id);
  });

  if (!eleve) return;

  if (boutonFiche) {
    afficherFiche(eleve);
    return;
  }

  if (boutonAbsent) {
    eleve.absences++;
    const nouvelleLigne = creerLigne(eleve);
    ligne.replaceWith(nouvelleLigne);
  }

  if (boutonNote) {
    const input = ligne.querySelector("input");
    const message = ligne.querySelector(".message");
    const note = Number(input.value);

    if (
      input.value.trim() === "" ||
      Number.isNaN(note) ||
      note < 0 ||
      note > 20
    ) {
      message.hidden = false;
      input.parentElement.classList.add("erreur");
      return;
    }

    eleve.notes.push(note);

    const nouvelleLigne = creerLigne(eleve);
    ligne.replaceWith(nouvelleLigne);
  }

  mettreAJourBilan();
}

function validerChamp(champ, regex, messageElement, messageErreur) {
  const valeur = champ.value.trim();
  const parent = champ.parentElement;

  if (regex.test(valeur)) {
    parent.classList.remove("erreur");
    parent.classList.add("valide");

    messageElement.textContent = "Champ valide.";
    return true;
  }

  parent.classList.remove("valide");
  parent.classList.add("erreur");

  messageElement.textContent = messageErreur;
  return false;
}

function verifierForceCode() {
  let force = 0;

  if (code.value.length >= 8) force++;
  if (/[A-Z]/.test(code.value) && /\d/.test(code.value)) force++;
  if (/[^A-Za-z0-9]/.test(code.value)) force++;

  codeForce.value = force;
}

function formValidation(event) {
  event.preventDefault();

  const champs = [prenom, nom, groupe, email, telephone, code];

  const validations = [
    validerChamp(
      prenom,
      regexNom,
      document.querySelector("#prenom-msg"),
      "2 caractères minimum : lettres, espaces ou tirets.",
    ),

    validerChamp(
      nom,
      regexNom,
      document.querySelector("#nom-msg"),
      "2 caractères minimum : lettres, espaces ou tirets.",
    ),

    validerChamp(
      groupe,
      regexGroupe,
      document.querySelector("#groupe-msg"),
      "Veuillez choisir un groupe.",
    ),

    validerChamp(
      email,
      regexEmail,
      document.querySelector("#email-msg"),
      "Veuillez entrer une adresse email valide.",
    ),

    validerChamp(
      telephone,
      regexTelephone,
      document.querySelector("#telephone-msg"),
      "Numéro de téléphone invalide.",
    ),

    validerChamp(
      code,
      regexCode,
      document.querySelector("#code-msg"),
      "Code invalide : vérifiez les critères.",
    ),
  ];

  if (
    !validations.every(function (valide) {
      return valide;
    })
  ) {
    const index = validations.findIndex(function (valide) {
      return !valide;
    });

    champs[index].focus();
    return;
  }

  const doubles = eleves.some(function (eleve) {
    return (
      eleve.groupeId === Number(groupe.value) &&
      eleve.prenom.toLowerCase() === prenom.value.trim().toLowerCase() &&
      eleve.nom.toLowerCase() === nom.value.trim().toLowerCase()
    );
  });

  if (doubles) {
    erreur.textContent = "Cet élève existe déjà dans ce groupe.";
    erreur.hidden = false;
    return;
  }

  const nombreEleves = eleves.filter(function (eleve) {
    return eleve.groupeId === Number(groupe.value);
  }).length;

  if (nombreEleves >= 15) {
    erreur.textContent = "Ce groupe est complet (15 élèves).";
    erreur.hidden = false;
    return;
  }

  const nouvelEleve = {
    id:
      Math.max(
        ...eleves.map(function (eleve) {
          return eleve.id;
        }),
      ) + 1,

    prenom: capitalize(prenom.value.trim()),
    nom: capitalize(nom.value.trim()),
    groupeId: Number(groupe.value),
    telephoneParent: telephone.value.trim(),
    emailParent: email.value.trim(),
    absences: 0,
    notes: [],
  };

  eleves.push(nouvelEleve);
  afficherEleves();

  formEleve.reset();
  codeForce.value = 0;
  champs.forEach(function (champ) {
    champ.parentElement.classList.remove("valide", "erreur");
  });
  erreur.hidden = true;
  succes.hidden = false;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function mettreAJourBilan() {
  let elevesFiltres = eleves;

  if (filtreGroup.value !== "") {
    elevesFiltres = eleves.filter(function (eleve) {
      return eleve.groupeId === Number(filtreGroup.value);
    });
  }

  const totalNotes = [];
  elevesFiltres.forEach(function (eleve) {
    return totalNotes.push(...eleve.notes);
  });

  bilanMoyenne.textContent = calculerMoyenne(totalNotes);

  const totalAbsences = elevesFiltres.reduce(function (total, eleve) {
    return total + eleve.absences;
  }, 0);

  bilanAbsences.textContent = totalAbsences;

  const elevesEnAlerte = elevesFiltres.filter(function (eleve) {
    return eleve.absences >= 3;
  });

  bilanAlertes.textContent = elevesEnAlerte.length;

  const parents = elevesEnAlerte.map(function (eleve) {
    return eleve.prenom + " " + eleve.nom + " — " + eleve.telephoneParent;
  });

  listeParents.replaceChildren();

  parents.forEach(function (parent) {
    const li = document.createElement("li");

    li.className = "rounded-xl bg-card px-3 py-2 ring-1 ring-line";
    li.textContent = parent;

    listeParents.append(li);
  });

  if (
    elevesFiltres.every(function (eleve) {
      return eleve.absences < 3;
    })
  ) {
    aucuneAlerte.hidden = false;
  } else {
    aucuneAlerte.hidden = true;
  }

  const elevesAvecNotes = elevesFiltres.filter(function (eleve) {
    return eleve.notes.length > 0;
  });

  if (elevesAvecNotes.length > 0) {
    const meilleurEleve = elevesAvecNotes.reduce(function (meilleur, eleve) {
      const eleveMoyenne = calculerMoyenneNumber(eleve.notes);
      const meilleurMoyenne = calculerMoyenneNumber(meilleur.notes);

      if (eleveMoyenne > meilleurMoyenne) return eleve;
      return meilleur;
    }, elevesAvecNotes[0]);

    bilanMeilleur.textContent = `${meilleurEleve.prenom} ${meilleurEleve.nom} — ${calculerMoyenne(meilleurEleve.notes)}`;
  } else bilanMeilleur.textContent = "——";
}

function afficherFiche(eleve) {
  ficheNom.textContent = eleve.prenom + " " + eleve.nom;

  const groupeEleve = groupes.find(function (groupe) {
    return groupe.id === eleve.groupeId;
  });

  ficheGroupe.textContent = groupeEleve.nom + " — " + groupeEleve.cours;

  ficheNotes.replaceChildren();

  eleve.notes.forEach(function (note) {
    const li = document.createElement("li");

    li.className = "rounded-full bg-paper px-3 py-1";
    li.textContent = note.toLocaleString("fr-FR");

    ficheNotes.append(li);
  });

  dialogFiche.showModal();
}
