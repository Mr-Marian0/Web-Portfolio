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