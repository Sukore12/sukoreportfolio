// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("navList");
menuBtn.addEventListener("click", function () {
  const open = navList.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// Academic planner
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const msg = document.getElementById("taskMsg");
  const count = document.getElementById("taskCount");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() {
    try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
  }
  function render() {
    list.innerHTML = "";
    tasks.forEach(function (task, i) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark task completed");
      box.addEventListener("change", function () { tasks[i].done = box.checked; save(); render(); });
      const text = document.createElement("span");
      text.textContent = task.text;
      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "Delete";
      del.addEventListener("click", function () { tasks.splice(i, 1); save(); render(); });
      li.append(box, text, del);
      list.appendChild(li);
    });
    const left = tasks.filter(function (t) { return !t.done; }).length;
    count.textContent = tasks.length ? left + " of " + tasks.length + " tasks left" : "No tasks yet. Add your first one above.";
  }
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "") { msg.textContent = "Type a task before adding it."; return; }
    msg.textContent = "";
    tasks.push({ text: value, done: false });
    input.value = "";
    save();
    render();
  });
  render();
}

// Contact form validation
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  function setErr(id, text) { document.getElementById(id + "Err").textContent = text; return text === ""; }
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const phone = contactForm.phone.value.trim();
    const message = contactForm.message.value.trim();
    document.getElementById("formSuccess").textContent = "";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const checks = [
      setErr("name", name === "" ? "Enter your name." : ""),
      setErr("email", email === "" ? "Enter your email address." : !emailOk.test(email) ? "Enter a valid email, like name@example.com." : ""),
      setErr("phone", phone === "" ? "Enter your phone number." : !/^\d+$/.test(phone) ? "Use digits only, with no spaces or symbols." : ""),
      setErr("message", message === "" ? "Enter a message." : "")
    ];
    if (checks.every(Boolean)) {
      document.getElementById("formSuccess").textContent = "Thanks, " + name + ". Your message has been sent.";
      contactForm.reset();
    }
  });
}
