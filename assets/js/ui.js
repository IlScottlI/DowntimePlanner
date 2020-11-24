// Select DOM elements to work with
const userName = document.getElementById("userName");
const userImage = document.getElementById("userImage");
const signInButton = document.getElementById("SignIn");
const cardDiv = document.getElementById("card-div");
const mailButton = document.getElementById("readMail");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");
let lists = [];
function showWelcomeMessage(account) {
    // Reconfiguring DOM elements
    //cardDiv.style.display = "initial";
    //userName.innerHTML = `${account.username}`;
    //signInButton.setAttribute("onclick", "signOut();");
    //signInButton.setAttribute("class", "btn btn-success");
    //signInButton.innerHTML = "Sign Out";
}

function updateUI(data, endpoint) {
    if (endpoint === graphConfig.graphMeEndpoint) {
        userName.innerHTML = `${data.givenName} ${data.surname}`;
        // const title = document.createElement("p");
        // title.innerHTML = "<strong>Plant: </strong>" + data.officeLocation;
        // const email = document.createElement("p");
        // email.innerHTML = "<strong>Mail: </strong>" + data.mail;
        // const phone = document.createElement("p");
        // phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
        // const address = document.createElement("p");
        // address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
        // profileDiv.appendChild(title);
        // profileDiv.appendChild(email);
        // profileDiv.appendChild(phone);
        // profileDiv.appendChild(address);
    } else if (endpoint === graphConfig.graphMePhotoEndpoint) {
        console.log(data)
        userImage.src = data;
    }

    else if (endpoint === graphConfig.graphMailEndpoint) {
        if (data.value.length < 1) {
            alert("Your mailbox is empty!");
        } else {
            const tabList = document.getElementById("list-tab");
            tabList.innerHTML = ""; // clear tabList at each readMail call
            const tabContent = document.getElementById("nav-tabContent");

            data.value.map((d, i) => {
                // Keeping it simple
                if (i < 10) {
                    const listItem = document.createElement("a");
                    listItem.setAttribute(
                        "class",
                        "list-group-item list-group-item-action"
                    );
                    listItem.setAttribute("id", "list" + i + "list");
                    listItem.setAttribute("data-toggle", "list");
                    listItem.setAttribute("href", "#list" + i);
                    listItem.setAttribute("role", "tab");
                    listItem.setAttribute("aria-controls", i);
                    listItem.innerHTML = d.subject;
                    tabList.appendChild(listItem);

                    const contentItem = document.createElement("div");
                    contentItem.setAttribute("class", "tab-pane fade");
                    contentItem.setAttribute("id", "list" + i);
                    contentItem.setAttribute("role", "tabpanel");
                    contentItem.setAttribute("aria-labelledby", "list" + i + "list");
                    contentItem.innerHTML =
                        "<strong> from: " +
                        d.from.emailAddress.address +
                        "</strong><br><br>" +
                        d.bodyPreview +
                        "...";
                    tabContent.appendChild(contentItem);
                }
            });
        }
    } else if (endpoint === graphConfig.graphSharePointLists) {
        lists = data.value;
        try {
            data.value.forEach((element) => {
                console.log(element.name);
            });
        } catch (error) { }
        const tabList = document.getElementById("list-tab");
        tabList.innerHTML = ""; // clear tabList at each readMail call
        const tabContent = document.getElementById("nav-tabContent");

        data.value.map((d, i) => {
            // Keeping it simple
            if (i < 10) {
                const listItem = document.createElement("a");
                listItem.setAttribute(
                    "class",
                    "list-group-item list-group-item-action"
                );
                listItem.setAttribute("id", "list" + i + "list");
                listItem.setAttribute("data-toggle", "list");
                listItem.setAttribute("href", "#list" + i);
                listItem.setAttribute("role", "tab");
                listItem.setAttribute("aria-controls", i);
                listItem.innerHTML = d.name;
                tabList.appendChild(listItem);

                const contentItem = document.createElement("div");
                contentItem.setAttribute("class", "tab-pane fade");
                contentItem.setAttribute("id", "list" + i);
                contentItem.setAttribute("role", "tabpanel");
                contentItem.setAttribute("aria-labelledby", "list" + i + "list");
                contentItem.innerHTML =
                    "<strong>  " +
                    d.name +
                    "</strong><br><br><a target='_blank' href=" +
                    '"' +
                    d.webUrl +
                    '">' +
                    d.webUrl +
                    "</a>";
                tabContent.appendChild(contentItem);
            }
        });
    }
}
