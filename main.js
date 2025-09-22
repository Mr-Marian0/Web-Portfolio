import {tools} from "./image/svg/svg_objects.js";


const grid_Tools = document.querySelector('.grid_tools');
const tools_used = document.querySelector('.tools_used');
const images = document.querySelectorAll(".profile img"); //used to put profile on TOP

const project_lists = document.querySelector('.project_lists');

const Main_Projects = [

    {projectClass: "project1", jobType: "Mapping, Field Work and Web Development", image: "image/projects/mamuric2.png",
    description: "Created a map for Mamuric7 internet provider highlighting the locations of Network Access Points from different locations. We also developed a local server website using XAMPP that allows the users/admins to perform CRUD operations.",
    toolsUsed: ["html","css", "javascript", "php", "xampp"] },

    {projectClass: "project2", jobType: "Thesis / Capstone", image: "image/projects/thesis1.png",
    description: "We developed a local server website for laboratory assistant",
    toolsUsed: ["html","css", "javascript", "nodeJs", "git", "github", "MYSQL"] },
]

renderAllTools();
renderProjects();
selectProfile();
listenToScrollArea();
shiftingTabArea();
sendMail();

function renderAllTools(){
    for (const [key, value] of Object.entries(tools)){
        grid_Tools.insertAdjacentHTML("beforeend", value)
    }
}

function renderProjects(){
    Main_Projects.forEach(element => {
        const HTMLcontent = `<div class=${element.projectClass}>
                    <img src=${element.image}>
                    <div class="project_des">
                            <h3><span>Title: </span>${element.jobType}</h3>
                            <p><span>Description:</span> ${element.description}</p>
                            <div class="project_tools">
                                <p><span>Tools used:</span></p>
                                <div class="tools_used">
                                    ${element.toolsUsed.map(Tool => tools[`${Tool}`]).join("")}
                                </div>
                            </div>
                    </div>
                </div>`

        project_lists.insertAdjacentHTML("beforeend", HTMLcontent);
    });
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