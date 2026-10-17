const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const ideas = {
  tired: [
    ["Take a two-minute pause", "Put both feet on the floor, drop your shoulders, and take five slow breaths. You don’t need to solve everything this minute."],
    ["Make one thing easier", "Choose the smallest task on your list and remove one obstacle. Or decide it can wait. Rest is allowed to be the plan."],
    ["Get a little daylight", "Stand by a window or step outside for a few minutes. No workout, no goal — just a change of scene."]
  ],
  stuck: [
    ["Try the five-minute start", "Set a timer for five minutes and begin the thing you’ve been avoiding. You can stop when the timer ends; starting is the win."],
    ["Change your scenery", "Move to another chair, clear a tiny patch of desk, or take a short walk. A small shift can help you begin again."],
    ["Write down the next step", "Not the whole plan — just the very next action. Make it so small that it feels almost too easy."]
  ],
  happy: [
    ["Put a little joy on the calendar", "Choose one thing you’re looking forward to and give it a real time and place. Small joys deserve a spot too."],
    ["Make something just because", "Take a photo, make a playlist, cook something colourful, or doodle for ten minutes. No need to make it impressive."],
    ["Celebrate a quiet win", "Name one thing you handled recently, even if nobody else noticed. Give yourself credit before rushing to the next thing."]
  ],
  social: [
    ["Send a no-pressure hello", "Text someone a memory, a song, or a simple “you crossed my mind today.” Connection doesn’t need a big opening line."],
    ["Make a tiny plan", "Ask someone to take a walk, share a snack, or have a ten-minute catch-up. Keep the plan easy to say yes to."],
    ["Offer a specific compliment", "Tell someone exactly what you appreciate about them. A sincere, specific compliment can stay with a person all day."]
  ]
};
let currentMood = null;
let ideaIndex = 0;
$$(".mood-card").forEach(card => card.addEventListener("click", () => {
  currentMood = card.dataset.mood;
  ideaIndex = Math.floor(Math.random() * ideas[currentMood].length);
  $$(".mood-card").forEach(c => c.classList.toggle("selected", c === card));
  renderIdea();
}));
function renderIdea() {
  const [title, description] = ideas[currentMood][ideaIndex];
  $("#suggestion").querySelector(".suggestion-label").textContent = "YOUR TINY NEXT STEP";
  $("#suggestion").querySelector("h3").textContent = title;
  $("#suggestion").querySelector("p").textContent = description;
  $("#another-idea").hidden = false;
}
$("#another-idea").addEventListener("click", () => {
  if (!currentMood) return;
  const list = ideas[currentMood];
  ideaIndex = (ideaIndex + 1) % list.length;
  renderIdea();
});

const prompts = [
  "What is one thing you can make easier for yourself this week?",
  "What felt good today, even for a moment?",
  "What are you carrying that you could give yourself permission to put down?",
  "What would a kinder version of your to-do list look like?",
  "What is something small you’re proud of lately?",
  "What do you want more of in the next seven days?",
  "What is one thing your future self might thank you for?"
];
let lastPrompt = 0;
$("#new-prompt").addEventListener("click", () => {
  let next = lastPrompt;
  while (prompts.length > 1 && next === lastPrompt) next = Math.floor(Math.random() * prompts.length);
  lastPrompt = next;
  $("#prompt-text").textContent = prompts[next];
});

const days = ["M", "T", "W", "T", "F", "S", "S"];
const storageKey = "littleWinsClubHabit_v1";
let habitState = { name: "", completed: [] };
try { habitState = { ...habitState, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch (e) {}
function saveState() { try { localStorage.setItem(storageKey, JSON.stringify(habitState)); } catch (e) {} }
function renderWeek() {
  $("#habit-title").textContent = habitState.name || "One day at a time";
  $("#habit-name").value = habitState.name || "";
  const grid = $("#week-grid");
  grid.innerHTML = "";
  days.forEach((day, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-check" + (habitState.completed.includes(i) ? " done" : "");
    btn.setAttribute("aria-label", `${["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i]}: ${habitState.completed.includes(i) ? "completed" : "not completed"}`);
    const label = document.createElement("span"); label.textContent = day;
    const mark = document.createElement("span"); mark.textContent = habitState.completed.includes(i) ? "✓" : "·";
    btn.append(label, mark);
    btn.addEventListener("click", () => {
      habitState.completed = habitState.completed.includes(i) ? habitState.completed.filter(n => n !== i) : [...habitState.completed, i];
      saveState(); renderWeek();
    });
    grid.appendChild(btn);
  });
  $("#streak-count").textContent = `${habitState.completed.length} of 7 little wins`;
}
$("#save-habit").addEventListener("click", () => {
  const value = $("#habit-name").value.trim();
  if (!value) { $("#habit-feedback").textContent = "Add a small habit first — even a two-minute one counts."; return; }
  habitState.name = value;
  saveState(); renderWeek();
  $("#habit-feedback").textContent = "Your tiny habit is saved in this browser. You’ve got this.";
});
$("#reset-week").addEventListener("click", () => {
  habitState.completed = [];
  saveState(); renderWeek();
  $("#habit-feedback").textContent = "Fresh week, fresh start. No guilt attached.";
});
renderWeek();

let toastTimer;
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
$("#bookmark-tip").addEventListener("click", async () => {
  const text = "Little Wins Club reminder: you don’t need to have it all figured out to take the next step.";
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast("Reminder copied — keep it somewhere you’ll see it ♡");
    } else toast("Reminder: You don’t need it all figured out to take the next step. ♡");
  } catch (e) { toast("Reminder: You don’t need it all figured out to take the next step. ♡"); }
});
const menuToggle = $(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const nav = $(".site-header nav");
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$("#year").textContent = new Date().getFullYear();
