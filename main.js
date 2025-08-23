import {tools} from "./image/svg/svg_objects.js";

const grid_Tools = document.querySelector('.grid_tools');
const tools_used = document.querySelector('.tools_used');

const project_lists = document.querySelector('.project_lists');

const Main_Projects = [
    {projectClass: "project2", jobType: "Thesis / Capstone", image: "image/projects/thesis1.png",
    description: "Developed a local server website for laboratory assistant",
    toolsUsed: ["html","css", "javascript", "nodeJs", "git", "github", "MYSQL"] },
]

renderAllTools();
renderProjects();

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
                            <h3>Type of Job: ${element.jobType}</h3>
                            <p><span>Job Description:</span> ${element.description}</p>
                            <div class="project_tools">
                                <p>Tools:</p>
                                <div class="tools_used">
                                    
                                </div>
                            </div>
                    </div>
                </div>`

        project_lists.insertAdjacentHTML("beforeend", HTMLcontent);
    });
}



toolsUsed([]);

function toolsUsed(a){
    return console.log(a)
}