async function loadResume() {
  const response = await fetch('data/resume-content.json');
  const data = await response.json();

  document.getElementById('resume-name').textContent = data.name;

  document.getElementById('resume-contact').innerHTML = `
    ${data.location} &middot;
    <a href="tel:${data.phoneLink}">${data.phone}</a> &middot;
    <a href="mailto:${data.email}">${data.email}</a> &middot;
    <a href="${data.linkedin}" target="_blank">LinkedIn</a>
  `;

  document.getElementById('resume-summary').textContent = data.summary;

  const skillsHTML = data.skills.map(skill => `
    <div class="skill-group">
      <h3>${skill.category}</h3>
      <p>${skill.items}</p>
    </div>
  `).join('');
  document.getElementById('resume-skills').innerHTML = skillsHTML;

  const experienceHTML = data.experience.map(job => {
    if (job.isParent) {
      const subrolesHTML = job.subroles.map(sub => `
        <div class="resume-subentry">
          <div class="resume-entry-header">
            <h4>${sub.title}</h4>
            <span class="resume-date">${sub.dates}</span>
          </div>
          <ul>
            ${sub.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        </div>
      `).join('');

      return `
        <div class="resume-entry">
          <div class="resume-entry-header">
            <h3>${job.title} | ${job.company}</h3>
            <span class="resume-date">${job.dates}</span>
          </div>
          ${subrolesHTML}
        </div>
      `;
    }

    const titleLine = job.company ? `${job.title} | ${job.company}` : job.title;
    return `
      <div class="resume-entry">
        <div class="resume-entry-header">
          <h3>${titleLine}</h3>
          <span class="resume-date">${job.dates}</span>
        </div>
        <ul>
          ${job.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');
  document.getElementById('resume-experience').innerHTML = experienceHTML;

  const educationHTML = data.education.map(edu => `
    <div class="resume-entry">
      <div class="resume-entry-header">
        <h3>${edu.degree}</h3>
        <span class="resume-date">${edu.dates}</span>
      </div>
      <p>${edu.details}</p>
    </div>
  `).join('');
  document.getElementById('resume-education').innerHTML = educationHTML;

  const recognitionHTML = data.recognition.map(item => `<p>${item}</p>`).join('');
  document.getElementById('resume-recognition').innerHTML = recognitionHTML;
}

loadResume();