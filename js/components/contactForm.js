/* Contact form: client-side validation + send through EmailJS (loaded in index.html). */
export function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const fields = {
    name: { input: document.getElementById("inputName"), error: document.getElementById("nameError") },
    email: { input: document.getElementById("inputEmail"), error: document.getElementById("emailError") },
    message: { input: document.getElementById("inputMessage"), error: document.getElementById("messageError") },
  };

  const rules = {
    name: (v) => (v ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
    message: (v) => (v ? "" : "Please add a message."),
  };

  function validate() {
    let valid = true;
    for (const [key, { input, error }] of Object.entries(fields)) {
      const msg = rules[key](input.value.trim());
      error.textContent = msg;
      input.toggleAttribute("aria-invalid", Boolean(msg));
      if (msg) valid = false;
    }
    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      status.textContent = "Please fix the highlighted fields.";
      status.dataset.state = "error";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.dataset.state = "";

    const params = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
    };

    // EmailJS loads async from a CDN; if it never arrived, fail politely
    const sender = window.emailjs
      ? window.emailjs.send.bind(window.emailjs)
      : () => Promise.reject(new Error("EmailJS not loaded"));

    sender("service_zcz47oc", "template_bf4vakb", params)
      .then(() => {
        status.textContent = "Message sent. Thanks for reaching out!";
        status.dataset.state = "success";
        form.reset();
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please email me directly instead.";
        status.dataset.state = "error";
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}
