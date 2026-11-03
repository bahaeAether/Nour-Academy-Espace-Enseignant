import { groupes, eleves } from "./data.js";

const compteur = document.getElementById("compteur");
compteur.textContent = `${eleves.length} élèves`;

const listeEleves = document.getElementById("liste-eleves");

// console.log(eleves);

const lignes = eleves.map(creerLigne);
listeEleves.append(...lignes);

function creerLigne(eleve) {
    const line = document.createElement("li");
    line.className = "rounded-2xl border border-line bg-card p-3";
    line.dataset.id = `${eleve.id}`;
    if (eleve.absences >= 3) {
        line.classList.add('alerte');
    }

    const outerDiv = document.createElement("div");
    outerDiv.className = "flex flex-col gap-3 lg:flex-row lg:items-center";

    const noteMessage = document.createElement("p");
    noteMessage.textContent = "La note doit être un nombre entre 0 et 20.";
    noteMessage.className = "message mt-2 text-xs text-alert";
    noteMessage.hidden = true;

    const btnFiche = document.createElement("button");
    btnFiche.type = "button";
    btnFiche.className = "btn-fiche flex min-h-11 flex-1 items-center gap-3 text-left";

    const avatar = document.createElement("span");
    avatar.className = "grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand";
    avatar.textContent = `${eleve.prenom[0]}${eleve.nom[0]}`;
    if (eleve.absences >= 3) {
        avatar.classList.remove('bg-brand-soft', 'text-brand');
        avatar.classList.add('bg-alert', 'text-white');
    }

    const informations = document.createElement('span');
    informations.className = 'min-w-0 flex-1';

    const fullName = document.createElement("span");
    fullName.className = "block truncate font-medium";
    fullName.textContent = `${eleve.prenom} ${eleve.nom}`;

    const absences = document.createElement('span');
    absences.className = 'block text-sm text-muted';
    absences.textContent = `${eleve.absences} absence(s)`;
    if (eleve.absences >= 3) {
        const badge = document.createElement('span');
        badge.className = 'badge ml-1 whitespace-nowrap rounded-full bg-alert px-2 py-0.5 text-xs font-medium text-white';
        badge.textContent = 'Prévenir les parents';

        absences.append(' ', badge);
    }
    informations.append(fullName, absences);

    const moyenne = document.createElement('span');
    moyenne.className = 'font-serif text-xl';
    moyenne.textContent = calculerMoyenne(eleve.notes);

    btnFiche.append(avatar, informations, moyenne);

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    const btnAbsent = document.createElement('button');
    btnAbsent.type = 'button';
    btnAbsent.className = 'btn-absent h-11 rounded-full border border-line px-3 sm:px-4 text-sm font-medium hover:bg-paper';
    btnAbsent.textContent = 'Absent';

    const label = document.createElement('label');
    label.className = 'flex-1';

    const texteCache = document.createElement('span');
    texteCache.className = 'sr-only';
    texteCache.textContent = 'Note sur 20';

    const inputNote = document.createElement('input');
    inputNote.type = 'number';
    inputNote.min = '0';
    inputNote.max = '20';
    inputNote.step = '0.5';
    inputNote.placeholder = 'Note';
    inputNote.className = 'h-11 w-full rounded-full border border-line bg-paper px-4 text-sm lg:w-24';

    label.append(texteCache, inputNote);

    const btnNote = document.createElement('button');
    btnNote.type = 'button';
    btnNote.className = 'btn-note h-11 rounded-full bg-ink px-3 sm:px-4 text-sm font-medium text-white hover:bg-brand';
    btnNote.textContent = 'Ajouter la note';

    actions.append(btnAbsent, label, btnNote);
    outerDiv.append(btnFiche, actions);
    line.append(outerDiv, noteMessage);




    console.log(btnFiche);

    return line;
}


function calculerMoyenne(notes) {
    if (notes.length === 0) return '—';

    const total = notes.reduce((somme, note) => somme + note, 0);
    const moyenne = total / notes.length;

    return moyenne.toFixed(2) + ' / 20';
}
