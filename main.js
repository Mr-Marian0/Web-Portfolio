import {tools, softSkills, toolsDescriptions} from "./image/svg/svg_objects.js";


const grid_Tools = document.querySelector('.grid_tools');
const gridToolId1 = document.getElementById("gridTool1");
const gridToolId2 = document.getElementById("gridTool2");

const tools_used = document.querySelector('.tools_used');
const grid_softSkills = document.querySelector('.grid_softskills');
const images = document.querySelectorAll(".profile img"); //used to put profile on TOP
const flipSkillCard = document.querySelector(".Skillcard"); //used to flip skill
const BackCard = document.querySelector(".container2_wrap1"); //back of the card

const project_lists = document.querySelector('.project_lists');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal_close');

const Main_Projects = [
    {
        projectClass: "project1", 
        jobType: "Mapping, Field Work and Web Development", 
        image: "image/projects/mamuric2.png",
        additionalImage: ["image/projects/mamuric1.png", "image/projects/mamuric3.png"],
        description: "Created a map for Mamuric7 internet provider highlighting the locations of Network Access Points from different locations. We also developed a local server website using XAMPP that allows the users/admins to perform CRUD operations.",
        toolsUsed: ["html","css", "javascript", "php", "xampp"]
    },
    {
        projectClass: "project2", 
        jobType: "Thesis / Capstone", 
        image: "image/projects/thesis1.png",
        additionalImage: ["image/projects/thesis2.png","image/projects/thesis3.png","image/projects/thesis4.png"],
        description: "We developed a local server website for laboratory assistant. The system manages equipment borrowing, user logs, and generates reports. It also integrates RFID for quick user identification.",
        toolsUsed: ["html","css", "javascript", "nodeJs", "git", "github", "MYSQL"]
    },
    {
        projectClass: "project3",
        jobType: "Identification Reviewer",
        image: "image/projects/revWeb1.png",
        additionalImage: ["image/projects/revWeb4.png", "image/projects/revWeb3.png", "image/projects/revWeb2.png"],
        description: "It was a project idea for me to be able to review while waiting for my Civil Service Exam. Where users can put sentences and select a word to be blanked. In which the data will be saved to their localStorage.",
        toolsUsed: ["html","css","javascript", "visualStudioCode", "git", "github"]
    },
    {
        projectClass: "project4",
        jobType: "Game Development",
        image: "image/projects/gameDev1.png",
        additionalImage: ["image/projects/gameDev2.png", "image/projects/gameDev3.png", "image/projects/gameDev4.png", "image/projects/gameDev5.png"],
        description: "This was a game project that I made. It was a 2D top down game where you play as a character solving puzzle and escaping the asylum. Characters, textures and button designs were made by me with the help of Krita.",
        toolsUsed: ["unity", "cSharp", "visualStudioCode", "krita", "git", "github"]
    }
]

window.addEventListener("load", ()=>{

    introAnimation();

});

window.addEventListener("load", ()=>{
    introAnimation();
    renderAllTools();
    renderProjects();      // This now includes all project event listeners
    selectProfile();
    listenToScrollArea();
    shiftingTabArea();
    sendMail();
    listenToFlipCard();
    renderSoftSkills();
    listenToContainer2Clicks();
    
    // Bind modal close events
    const modalCloseBtn = document.querySelector('.modal_close');
    const modal = document.getElementById('imageModal');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
});

function setRandomBimoImage(){

    const image = document.getElementById("bimoImage");

    const random = Math.floor(Math.random()*16)+1;

    image.src = `image/me${random}.jpg`;
}

function introAnimation() {

    const tl = gsap.timeline({

        onComplete() {

            const intro = document.querySelector(".bimo_intro");

            if (intro) {
                intro.remove();
            }

        }

    });

    tl.to(".bimo_start span, .bimo_end span", {

        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"

    });

    tl.to(".bimo_loader", {

        width: "220px",
        duration: 1,
        ease: "power3.inOut"

    }, "<");

    tl.to(".bimo_start", {

        x: -40,
        duration: 1,
        ease: "power3.inOut"

    }, "<");

    tl.to(".bimo_end", {

        x: 40,
        duration: 1,
        ease: "power3.inOut"

    }, "<");

    tl.to(".bimo_loader", {

        width: "250vw",
        height: "250vh",

        borderRadius: 0,

        duration: 1.8,

        ease: "power4.inOut"

    });

    tl.to(".bimo_intro", {

        opacity: 0,

        duration: 0.4,

        onComplete() {

            document.querySelector(".bimo_intro")?.remove();

        }

    });

    tl.to(".picture_content, .Me", {

        opacity: 1,

        duration: 1,

        stagger: 0.2

    }, "-=0.5");

    tl.to("body", {
        backgroundColor: "tomato",
        duration: 0.2
    }, "<");

}

function renderAllTools(){
    let count = 0;
    for (const [key, value] of Object.entries(tools)) {
        const targetGrid = count < 16 ? grid_Tools : gridToolId2;
        targetGrid.insertAdjacentHTML("beforeend", value);
        count++;
    }

    setInterval(()=>{
        if(gridToolId2.style.zIndex === "-1"){
            gridToolId2.style.zIndex = 1;
            gridToolId2.style.opacity = 1;
        } else {
            gridToolId2.style.zIndex = -1;
            gridToolId2.style.opacity = 0;
        }
        
    }, 4000);
}

function listenToContainer2Clicks(){
    // collect all svg elements that match any class in toolsDescriptions
    const classNames = toolsDescriptions.flatMap(obj => Object.keys(obj).filter(k => k !== "description" && k !== "image" && k !== "level"));
    const selector = classNames.map(c => `svg.${c}`).join(", ");
    const svgs = document.querySelectorAll(selector);
    console.log(selector)

    softSkills.forEach(ss => {
        let skill = document.querySelector(`.${ss.name}`)

        skill.addEventListener('click', () => {
            BackCard.innerHTML = "";

            const cloneSvg2 = ss.svg.replace(/width="20px"/g, 'width="100px"').replace(/height="20px"/g, 'height="100px"');

            BackCard.innerHTML = `
                    <div class="tool-desc">
                    <h2>${ss.name.toUpperCase()}</h2>
                    ${cloneSvg2}
                    <p>${ss.description}</p>
                    ${
                        ss.level
                        ? `<div class="progress-bar">
                            <div class="progress" style="width: ${ss.level}%;"></div>
                            </div>
                            <small>${ss.level}%</small>`
                        : ""
                    }
                    </div>
                `;

            flipSkillCard.classList.toggle('flipSkillCard');
        })
    })

    svgs.forEach(svg => {
        svg.addEventListener('click', () => {
            BackCard.innerHTML = "";

            const matchedClass = toolsDescriptions.find(obj => Object.keys(obj).includes(svg.classList[0]));
            let getClass = svg.classList[0];

            if(matchedClass){
                const tool = toolsDescriptions.find(t => t[getClass] !== undefined);
                console.log(tool);
                const clonedSvg = svg.cloneNode(true);
                clonedSvg.setAttribute("width", 100);
                clonedSvg.setAttribute("height", 100);

                BackCard.innerHTML = `
                    <div class="tool-desc">
                    <h2>${matchedClass[getClass].toUpperCase().replaceAll("_"," ")}</h2>
                    ${clonedSvg.outerHTML}
                    <p>${tool.description}</p>
                    ${
                        tool.level
                        ? `<div class="progress-bar">
                            <div class="progress" style="width: ${tool.level}%;"></div>
                            </div>
                            <small>${tool.level}%</small>`
                        : ""
                    }
                    </div>
                `;
            }

            flipSkillCard.classList.toggle('flipSkillCard');
        })
    })


}

function renderSoftSkills(){
    softSkills.forEach(skill => {
        const item = document.createElement("div");
        item.className = `${skill.name}`;
        item.id = "softskill-item";
        item.setAttribute("role", "listitem");
        item.setAttribute("arial-label", skill.name);

        item.innerHTML = `
            <span class="softskill-icon" aria-hidden="true">${skill.svg}</span>
            <span class="softskill-text">${skill.name}</span>
            `;

            grid_softSkills.appendChild(item);
    })
}

function renderProjects() {
    project_lists.innerHTML = ''; // Clear existing content
    
    Main_Projects.forEach((project, index) => {
        // Generate tools HTML for the back of the card
        const toolsHTML = project.toolsUsed.length > 0 
            ? project.toolsUsed.map(tool => tools[tool.toLowerCase()] || '').join('') 
            : '<p>No tools specified</p>';
            
        // Short description for the card back (first 100 chars)
        const shortDesc = project.description.length > 100 
            ? project.description.substring(0, 100) + '...' 
            : project.description;
        
        // Get a random image from additionalImage or use the main image
        const allImages = [project.image, ...project.additionalImage];
        const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
        
        const cardHTML = `
            <div class="project-card" data-index="${index}">
                <div class="project-card-inner">
                    <div class="project-card-front">
                        <img src="${project.image}" alt="${project.jobType}">
                        <h3>${project.jobType}</h3>
                    </div>
                    <div class="project-card-back">
                        <img src="${randomImage}" alt="${project.jobType}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                        <p>${shortDesc}</p>
                        <div class="tools_used">
                            ${toolsHTML}
                        </div>
                        <button class="read-more-btn" data-index="${index}">Read More</button>
                    </div>
                </div>
            </div>
        `;
        
        project_lists.insertAdjacentHTML("beforeend", cardHTML);
    });
    
    // Add click listeners for flip cards and read more buttons
    attachProjectEventListeners();
}

function attachProjectEventListeners() {
    // Flip card on click (but not when clicking the read more button)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't flip if clicking on the read more button
            if (e.target.classList.contains('read-more-btn')) {
                return;
            }
            this.classList.toggle('flipped');
        });
    });
    
    // Read More button listeners
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip
            const index = parseInt(this.getAttribute('data-index'));
            openModal(index);
        });
    });
}

function openModal(projectIndex) {
    const project = Main_Projects[projectIndex];
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalToolsList = document.getElementById('modalToolsList');
    const modalThumbnails = document.getElementById('modalThumbnails');
    
    // Set main content
    modalTitle.textContent = project.jobType;
    modalImage.src = project.image;
    modalDescription.textContent = project.description;
    
    // Generate tools HTML for modal
    const toolsHTML = project.toolsUsed.length > 0 
        ? project.toolsUsed.map(tool => tools[tool.toLowerCase()] || '').join('') 
        : '<p>No tools specified</p>';
    modalToolsList.innerHTML = toolsHTML;
    
    // Generate thumbnails (first image is the main one, add the rest)
    modalThumbnails.innerHTML = '';
    const allImages = [project.image, ...project.additionalImage];
    allImages.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.classList.add('modal-thumb');
        if (idx === 0) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            modalImage.src = imgSrc;
            document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        modalThumbnails.appendChild(thumb);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function selectProfile(){

    let rand1 = Math.floor(Math.random() * 16) + 1;
    let rand2;
    do {
    rand2 = Math.floor(Math.random() * 16) + 1;
    } while (rand2 === rand1);

    document.querySelector('.img1').src = `image/me${rand1}.jpg`;
    document.querySelector('.img2').src = `image/me${rand2}.jpg`;

    images.forEach(img => {
        img.addEventListener("click", () => {
            images.forEach(i => i.classList.remove("active"));
            img.classList.add("active");
        });
    });
}

function listenToScrollArea() {
    const targets = [
        { id: 'hd_home', min: 0, max: 399 },
        { id: 'hd_skill', min: 400, max: 1199 },
        { id: 'hd_projects', min: 1200, max: 1999 },
        { id: 'hd_contancts', min: 2000, max: Infinity }
    ];

    const container = document.querySelector(".main_container");

    function updateActiveState() {
        const scrollY = container.scrollTop;

        targets.forEach(target => {
            const element = document.getElementById(target.id);
            if (element) {
                if (scrollY >= target.min && scrollY <= target.max) {
                    element.style.backgroundColor = '#243c3c';
                } else {
                    element.style.backgroundColor = '';
                }
            }
        });
    }

    updateActiveState();
    container.addEventListener('scroll', updateActiveState);
}

function shiftingTabArea() {
    const container = document.querySelector('.main_container');
    const headBar_Home = document.getElementById('hd_home');
    const headBar_Skill = document.getElementById('hd_skill');
    const headBar_Project = document.getElementById('hd_projects');
    const headBar_Contact = document.getElementById('hd_contancts');
    const contact_Button = document.querySelector('.contact_btn');

    const sectionCount = 4;
    const sectionHeight = container.scrollHeight / sectionCount;

    headBar_Home.addEventListener('click', () => {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    headBar_Skill.addEventListener('click', () => {
        container.scrollTo({
            top: sectionHeight,
            behavior: 'smooth'
        });
    });

    headBar_Project.addEventListener('click', () => {
        container.scrollTo({
            top: sectionHeight * 2,
            behavior: 'smooth'
        });
    });

    headBar_Contact.addEventListener('click', () => {
        container.scrollTo({
            top: sectionHeight * 3,
            behavior: 'smooth'
        });
    });

    contact_Button.addEventListener('click', () => {
        container.scrollTo({
            top: sectionHeight * 3,
            behavior: 'smooth'
        });
    });
}

function sendMail(){

    const sendMessage = document.querySelector('.send_message').addEventListener('click', ()=>{
        let parms = {
            name: document.getElementById("input_name").value,
            email: document.getElementById("input_address").value,
            message: document.getElementById("input_message").value,
        }
        emailjs.send("service_zcz47oc", "template_bf4vakb", parms).then(alert("Email has been sent"));
    })
}

function listenToFlipCard(){
    BackCard.addEventListener('click', ()=>{
        flipSkillCard.classList.toggle('flipSkillCard');
    })
}