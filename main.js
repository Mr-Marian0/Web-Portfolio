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
        description: "Created a map for Mamuric7 internet provider highlighting the locations of Network Access Points from different locations. We also developed a local server website using XAMPP that allows the users/admins to perform CRUD operations.",
        toolsUsed: ["html","css", "javascript", "php", "xampp"]
    },

    {
        projectClass: "project2", 
        jobType: "Thesis / Capstone", 
        image: "image/projects/thesis1.png",
        description: "We developed a local server website for laboratory assistant",
        toolsUsed: ["html","css", "javascript", "nodeJs", "git", "github", "MYSQL"]
    },
]

renderAllTools();
renderProjects();
selectProfile();
listenToScrollArea();
shiftingTabArea();
sendMail();
listenToFlipCard();
renderSoftSkills();
listenToContainer2Clicks();


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
                    <h2>${matchedClass[getClass].toUpperCase()}</h2>
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
    Main_Projects.forEach(element => {
        const toolsHTML = element.toolsUsed.length > 0 
            ? element.toolsUsed.map(Tool => tools[`${Tool}`]).join("") 
            : '<p style="color: #40e0d0; font-style: italic;">No tools specified yet</p>';
        
        const HTMLcontent = `<div class="${element.projectClass}">
                    <img src="${element.image}" alt="${element.jobType}" class="project_thumbnail">
                    <div class="project_des">
                        <h3><span>Title: </span>${element.jobType}</h3>
                        <p><span>Description: </span>${element.description}</p>
                        <div class="project_tools">
                            <p><span>Tools used:</span></p>
                            <div class="tools_used">
                                ${toolsHTML}
                            </div>
                        </div>
                    </div>
                </div>`;

        project_lists.insertAdjacentHTML("beforeend", HTMLcontent);
    });
    
    // Add click event listeners to all project thumbnails
    initializeImagePopup();
}

function initializeImagePopup() {
    const thumbnails = document.querySelectorAll('.project_thumbnail');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            openModal(this.src, Main_Projects[index].jobType);
        });
    });
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal(imageSrc, caption) {
    imageModal.style.display = 'block';
    modalImage.src = imageSrc;
    modalCaption.textContent = caption;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function selectProfile(){
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